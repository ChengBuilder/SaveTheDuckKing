'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const CONFIG_RELATIVE_PATH = 'subpackages/audioBundle/config.audio-bundle.json';
const LEGACY_IMPORT_DIR_RELATIVE_PATH = 'subpackages/audioBundle/import/legacy';
const LEGACY_ROOT_PATH_MAP = Object.freeze({
  win: 'legacy/victory',
  adz: 'legacy/unknownAdz',
  fly: 'legacy/fly',
  bdz: 'legacy/unknownBdz',
  door: 'legacy/door',
  ls: 'legacy/unknownLs',
  lz: 'legacy/fruitBornDuplicateLz',
  pop: 'legacy/pop',
  over: 'legacy/gameOver',
  gz: 'legacy/levelCompleteDuplicateGz',
  levelup: 'legacy/levelUp',
  show: 'legacy/levelCompleteDuplicateShow'
});
const LEGACY_ROOT_TOKENS = new Set(Object.keys(LEGACY_ROOT_PATH_MAP));
const LEGACY_IMPORT_NAME_MAP = Object.freeze({
  'door.json': 'door',
  'fly.json': 'fly',
  'fruitBornDuplicateLz.json': 'fruitBornDuplicateLz',
  'gameOver.json': 'gameOver',
  'levelCompleteDuplicateGz.json': 'levelCompleteDuplicateGz',
  'levelCompleteDuplicateShow.json': 'levelCompleteDuplicateShow',
  'levelUp.json': 'levelUp',
  'pop.json': 'pop',
  'unknownAdz.json': 'unknownAdz',
  'unknownBdz.json': 'unknownBdz',
  'unknownLs.json': 'unknownLs',
  'victory.json': 'victory'
});

function semanticizeAudioBundleLegacyAssets() {
  const layout = resolveProjectLayout(__dirname);
  const configAbsolutePath = resolveProjectFilePath(layout, CONFIG_RELATIVE_PATH);
  const configDisplayLabel = formatProjectPathFromWorkspace(layout, CONFIG_RELATIVE_PATH);
  const legacyImportDirAbsolutePath = resolveProjectFilePath(layout, LEGACY_IMPORT_DIR_RELATIVE_PATH);
  const legacyImportDirDisplayLabel = formatProjectPathFromWorkspace(layout, LEGACY_IMPORT_DIR_RELATIVE_PATH);

  const configResult = updateBundleConfig(configAbsolutePath, configDisplayLabel);
  const importResult = updateLegacyImportClipNames(legacyImportDirAbsolutePath, legacyImportDirDisplayLabel);
  console.log(
    '[audioBundle legacy 语义化]',
    configResult.label,
    '旧根路径更新',
    configResult.replacementCount,
    '条'
  );
  console.log(
    '[audioBundle legacy 语义化]',
    importResult.label,
    'AudioClip 名称更新',
    importResult.replacementCount,
    '条'
  );
}

function updateBundleConfig(filePath, displayLabel) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const parsedJson = JSON.parse(originalContent);
  const paths = parsedJson.paths || {};
  let replacementCount = 0;

  for (const pathEntry of Object.values(paths)) {
    if (!Array.isArray(pathEntry) || typeof pathEntry[0] !== 'string') {
      continue;
    }

    const semanticPath = LEGACY_ROOT_PATH_MAP[pathEntry[0]];
    if (semanticPath && semanticPath !== pathEntry[0]) {
      pathEntry[0] = semanticPath;
      replacementCount += 1;
    }
  }

  verifyNoLegacyRootTokens(paths, displayLabel);

  const nextContent = JSON.stringify(parsedJson, null, 2) + '\n';
  if (nextContent !== originalContent) {
    fs.writeFileSync(filePath, nextContent);
  }

  return {
    label: displayLabel,
    replacementCount
  };
}

function verifyNoLegacyRootTokens(paths, displayLabel) {
  const remainingTokens = new Set();

  for (const pathEntry of Object.values(paths || {})) {
    if (!Array.isArray(pathEntry) || typeof pathEntry[0] !== 'string') {
      continue;
    }

    if (LEGACY_ROOT_TOKENS.has(pathEntry[0])) {
      remainingTokens.add(pathEntry[0]);
    }
  }

  if (remainingTokens.size > 0) {
    throw new Error(
      '[audioBundle legacy 语义化] ' +
      displayLabel +
      ' 仍包含旧根 token: ' +
      Array.from(remainingTokens).sort().join(', ')
    );
  }
}

function updateLegacyImportClipNames(directoryPath, displayLabel) {
  const fileNames = Object.keys(LEGACY_IMPORT_NAME_MAP).sort();
  let replacementCount = 0;

  for (const fileName of fileNames) {
    const filePath = path.join(directoryPath, fileName);
    const expectedName = LEGACY_IMPORT_NAME_MAP[fileName];
    const originalContent = fs.readFileSync(filePath, 'utf8');
    const parsedJson = JSON.parse(originalContent);
    const currentName = readLegacyAudioClipName(parsedJson, fileName);
    if (currentName === expectedName) {
      continue;
    }

    writeLegacyAudioClipName(parsedJson, expectedName);
    const nextContent = JSON.stringify(parsedJson) + '\n';
    if (nextContent !== originalContent) {
      fs.writeFileSync(filePath, nextContent);
      replacementCount += 1;
    }
  }

  verifyLegacyImportClipNames(directoryPath, displayLabel);
  return {
    label: displayLabel,
    replacementCount: replacementCount
  };
}

function readLegacyAudioClipName(parsedJson, fileName) {
  if (!Array.isArray(parsedJson) || !Array.isArray(parsedJson[5]) || !Array.isArray(parsedJson[5][0])) {
    throw new Error('[audioBundle legacy 语义化] legacy 元数据结构异常：' + String(fileName));
  }
  const clipEntry = parsedJson[5][0];
  if (typeof clipEntry[1] !== 'string') {
    throw new Error('[audioBundle legacy 语义化] legacy 音频名称缺失：' + String(fileName));
  }
  return clipEntry[1];
}

function writeLegacyAudioClipName(parsedJson, nextName) {
  parsedJson[5][0][1] = String(nextName);
}

function verifyLegacyImportClipNames(directoryPath, displayLabel) {
  const mismatches = [];
  for (const [fileName, expectedName] of Object.entries(LEGACY_IMPORT_NAME_MAP)) {
    const filePath = path.join(directoryPath, fileName);
    const parsedJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const currentName = readLegacyAudioClipName(parsedJson, fileName);
    if (currentName !== expectedName) {
      mismatches.push(fileName + ':' + currentName + '->' + expectedName);
    }
  }

  if (mismatches.length > 0) {
    throw new Error(
      '[audioBundle legacy 语义化] ' +
      displayLabel +
      ' 仍存在未收敛 AudioClip 名称：' +
      mismatches.join(', ')
    );
  }
}

semanticizeAudioBundleLegacyAssets();
