'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const CONFIG_TARGETS = [
  'subpackages/DuckBundle/config.duck-bundle.json'
];

const IMPORT_DIRECTORY_TARGETS = [
  'subpackages/DuckBundle/import'
];

const GAME_JS_RELATIVE_PATH = 'game.js';

const BACKGROUND_PATH_MAP = Object.freeze({
  'tex/bg/mainLight': 'tex/background/mainLight',
  'tex/bg/背景': 'tex/background/mainBackground',
  'tex/bg/槽位': 'tex/background/slotBase',
  'tex/bg/槽位2': 'tex/background/slotOverlay',
  'tex/bg/井': 'tex/background/well',
  'tex/bg/水1': 'tex/background/waterLayer1',
  'tex/bg/水2': 'tex/background/waterLayer2',
  'tex/bg/岩浆1': 'tex/background/lavaLayer1',
  'tex/bg/岩浆2': 'tex/background/lavaLayer2',
  'tex/bg/右下': 'tex/background/cornerBottomRight',
  'tex/bg/左下': 'tex/background/cornerBottomLeft'
});

const SPRITE_FRAME_NAME_MAP = Object.freeze({
  背景: 'mainBackground',
  槽位: 'slotBase',
  槽位2: 'slotOverlay',
  井: 'well',
  水1: 'waterLayer1',
  水2: 'waterLayer2',
  岩浆1: 'lavaLayer1',
  岩浆2: 'lavaLayer2',
  右下: 'cornerBottomRight',
  左下: 'cornerBottomLeft'
});

const LEGACY_BACKGROUND_PATH_KEYS = Object.keys(BACKGROUND_PATH_MAP).sort((leftPath, rightPath) => {
  return rightPath.length - leftPath.length;
});
const LEGACY_NAME_KEYS = Object.keys(SPRITE_FRAME_NAME_MAP).sort((leftToken, rightToken) => {
  return rightToken.length - leftToken.length;
});
const LEGACY_NAME_PATTERN = new RegExp(
  '"name":"(' + LEGACY_NAME_KEYS.map(escapeRegExp).join('|') + ')"',
  'g'
);

/**
 * 把 DuckBundle 背景模块中的中文路径统一收敛为语义化英文命名。
 * 当前策略：
 * 1. tex/bg/* -> tex/background/*
 * 2. 背景相关 SpriteFrame 名称同步改为英文语义名
 * 3. game.js 中同名旧路径字符串一并替换，避免运行时仍走旧路径
 */
function semanticizeDuckBundleBackgroundAssets() {
  const layout = resolveProjectLayout(__dirname);

  const configResults = CONFIG_TARGETS.map((relativePath) => {
    const absolutePath = resolveProjectFilePath(layout, relativePath);
    return updateBundleConfig(absolutePath, formatProjectPathFromWorkspace(layout, relativePath));
  });

  const importResults = IMPORT_DIRECTORY_TARGETS.map((relativePath) => {
    const absolutePath = resolveProjectFilePath(layout, relativePath);
    return updateImportDirectory(absolutePath, formatProjectPathFromWorkspace(layout, relativePath));
  });

  const gameJsPath = resolveProjectFilePath(layout, GAME_JS_RELATIVE_PATH);
  const gameJsResult = updateGameJs(gameJsPath, formatProjectPathFromWorkspace(layout, GAME_JS_RELATIVE_PATH));

  console.log('[DuckBundle背景语义化] 已完成背景路径语义化收敛。');
  for (const result of configResults) {
    console.log(
      '[DuckBundle背景语义化] 配置更新:',
      result.label,
      '路径改写数:',
      result.replacementCount
    );
  }
  for (const result of importResults) {
    console.log(
      '[DuckBundle背景语义化] 元数据更新:',
      result.label,
      '文件更新数:',
      result.updatedFileCount,
      '名称改写数:',
      result.replacementCount
    );
  }
  console.log(
    '[DuckBundle背景语义化] 运行时更新:',
    gameJsResult.label,
    '路径替换总数:',
    gameJsResult.replacementCount,
    '命中旧路径种类数:',
    gameJsResult.touchedPathCount
  );
}

/**
 * 更新 bundle 配置中的背景路径。
 * @param {string} filePath 配置文件路径
 * @param {string} displayLabel 展示标签
 * @returns {{label: string, replacementCount: number}}
 */
function updateBundleConfig(filePath, displayLabel) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const parsedJson = JSON.parse(originalContent);
  let replacementCount = 0;

  for (const pathEntry of Object.values(parsedJson.paths || {})) {
    if (!Array.isArray(pathEntry) || typeof pathEntry[0] !== 'string') {
      continue;
    }

    const semanticPath = normalizeBackgroundPath(pathEntry[0]);
    if (semanticPath !== pathEntry[0]) {
      pathEntry[0] = semanticPath;
      replacementCount += 1;
    }
  }

  verifyNoLegacyBackgroundPaths(parsedJson, displayLabel);

  const formattedContent = JSON.stringify(parsedJson, null, 2) + '\n';
  if (formattedContent !== originalContent) {
    fs.writeFileSync(filePath, formattedContent);
  }

  return {
    label: displayLabel,
    replacementCount: replacementCount
  };
}

/**
 * 更新 SpriteFrame import 元数据中的背景名称。
 * @param {string} directoryPath import 目录
 * @param {string} displayLabel 展示标签
 * @returns {{label: string, updatedFileCount: number, replacementCount: number}}
 */
function updateImportDirectory(directoryPath, displayLabel) {
  const fileNames = fs.readdirSync(directoryPath).sort();
  let updatedFileCount = 0;
  let replacementCount = 0;

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.json')) {
      continue;
    }

    const filePath = path.join(directoryPath, fileName);
    const originalContent = fs.readFileSync(filePath, 'utf8');

    if (!originalContent.includes('"cc.SpriteFrame"')) {
      continue;
    }

    let fileReplacementCount = 0;
    const nextContent = originalContent.replace(LEGACY_NAME_PATTERN, (match, token) => {
      const semanticName = SPRITE_FRAME_NAME_MAP[token];
      if (!semanticName) {
        return match;
      }

      fileReplacementCount += 1;
      return '"name":"' + semanticName + '"';
    });

    if (fileReplacementCount > 0) {
      fs.writeFileSync(filePath, nextContent);
      updatedFileCount += 1;
      replacementCount += fileReplacementCount;
    }
  }

  verifyNoLegacyBackgroundSpriteNames(directoryPath, displayLabel);

  return {
    label: displayLabel,
    updatedFileCount: updatedFileCount,
    replacementCount: replacementCount
  };
}

/**
 * 更新 game.js 中的旧背景路径字符串。
 * @param {string} filePath game.js 绝对路径
 * @param {string} displayLabel 展示标签
 * @returns {{label: string, replacementCount: number, touchedPathCount: number}}
 */
function updateGameJs(filePath, displayLabel) {
  let content = fs.readFileSync(filePath, 'utf8');
  let replacementCount = 0;
  let touchedPathCount = 0;

  for (const legacyBasePath of LEGACY_BACKGROUND_PATH_KEYS) {
    const semanticBasePath = BACKGROUND_PATH_MAP[legacyBasePath];
    const parts = content.split(legacyBasePath);
    const hitCount = parts.length - 1;

    if (hitCount <= 0) {
      continue;
    }

    content = parts.join(semanticBasePath);
    replacementCount += hitCount;
    touchedPathCount += 1;
  }

  if (replacementCount > 0) {
    fs.writeFileSync(filePath, content);
  }
  verifyNoLegacyBackgroundPathInGameJs(content, displayLabel);

  return {
    label: displayLabel,
    replacementCount: replacementCount,
    touchedPathCount: touchedPathCount
  };
}

/**
 * 规范化单条背景路径。
 * @param {string} assetPath 原始路径
 * @returns {string}
 */
function normalizeBackgroundPath(assetPath) {
  const normalizedPath = String(assetPath || '');

  for (const legacyBasePath of LEGACY_BACKGROUND_PATH_KEYS) {
    const semanticBasePath = BACKGROUND_PATH_MAP[legacyBasePath];

    if (normalizedPath === legacyBasePath) {
      return semanticBasePath;
    }
    if (normalizedPath.startsWith(legacyBasePath + '/')) {
      return semanticBasePath + normalizedPath.slice(legacyBasePath.length);
    }
  }

  return normalizedPath;
}

/**
 * 校验配置中已无旧背景路径。
 * @param {{paths?: Record<string, unknown>}} parsedJson 配置 JSON
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacyBackgroundPaths(parsedJson, displayLabel) {
  const legacyPathList = [];

  for (const pathEntry of Object.values(parsedJson.paths || {})) {
    if (!Array.isArray(pathEntry) || typeof pathEntry[0] !== 'string') {
      continue;
    }

    const pathValue = pathEntry[0];
    if (pathValue.startsWith('tex/bg/')) {
      legacyPathList.push(pathValue);
    }
  }

  if (legacyPathList.length > 0) {
    throw new Error(
      '[DuckBundle背景语义化] 配置中仍残留旧背景路径：' +
      displayLabel +
      ' -> ' +
      legacyPathList.slice(0, 5).join(', ')
    );
  }
}

/**
 * 校验 import 目录中已无旧背景 SpriteFrame 名称。
 * @param {string} directoryPath import 目录
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacyBackgroundSpriteNames(directoryPath, displayLabel) {
  const legacyFileList = [];

  for (const fileName of fs.readdirSync(directoryPath)) {
    if (!fileName.endsWith('.json')) {
      continue;
    }

    const filePath = path.join(directoryPath, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (!fileContent.includes('"cc.SpriteFrame"')) {
      continue;
    }

    LEGACY_NAME_PATTERN.lastIndex = 0;
    if (LEGACY_NAME_PATTERN.test(fileContent)) {
      legacyFileList.push(fileName);
    }
  }

  if (legacyFileList.length > 0) {
    throw new Error(
      '[DuckBundle背景语义化] import 元数据仍残留旧名称：' +
      displayLabel +
      ' -> ' +
      legacyFileList.slice(0, 5).join(', ')
    );
  }
}

/**
 * 校验 game.js 中已无旧背景路径字符串。
 * @param {string} gameSource game.js 文本
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacyBackgroundPathInGameJs(gameSource, displayLabel) {
  const legacyPathList = [];

  for (const legacyBasePath of LEGACY_BACKGROUND_PATH_KEYS) {
    if (gameSource.includes(legacyBasePath)) {
      legacyPathList.push(legacyBasePath);
    }
  }

  if (legacyPathList.length > 0) {
    throw new Error(
      '[DuckBundle背景语义化] game.js 中仍残留旧背景路径：' +
      displayLabel +
      ' -> ' +
      legacyPathList.join(', ')
    );
  }
}

/**
 * 正则元字符转义。
 * @param {string} rawToken 原始文本
 * @returns {string}
 */
function escapeRegExp(rawToken) {
  return String(rawToken).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

semanticizeDuckBundleBackgroundAssets();
