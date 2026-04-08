'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const CONFIG_TARGETS = [
  'subpackages/uiBundle/config.ui-bundle.json',
  'assets/uibundle/config.json',
  'assets/uiBundlebundle/config.json'
];

const IMPORT_DIRECTORY_TARGETS = [
  'subpackages/uiBundle/import',
  'assets/uibundle/import',
  'assets/uiBundlebundle/import'
];

const SKIN_PAGE_NAME_MAP = {
  p1: 'skinPage1',
  p2: 'skinPage2',
  p3: 'skinPage3',
  p4: 'skinPage4',
  p5: 'skinPage5',
  p6: 'skinPage6',
  p7: 'skinPage7',
  p8: 'skinPage8',
  p9: 'skinPage9',
  p10: 'skinPage10'
};

const LEGACY_SKIN_PATH_PATTERN = /^tex\/book\/鸽鸽图鉴\/皮肤图鉴\/p(10|[1-9])(?:\/(spriteFrame|texture))?$/;
const LEGACY_SKIN_NAME_PATTERN = /"name":"(p10|p[1-9])"/g;

/**
 * 把 uiBundle 图鉴皮肤页短 token 命名（p1..p10）收敛为可读命名。
 * 当前策略：
 * 1. tex/book/鸽鸽图鉴/皮肤图鉴/pN -> tex/book/pigeonGallery/skinCollection/skinPageN
 * 2. SpriteFrame 名 pN -> skinPageN
 */
function semanticizeUiBundleBookSkinAssets() {
  const layout = resolveProjectLayout(__dirname);

  const configResults = CONFIG_TARGETS.map((relativePath) => {
    const absolutePath = resolveProjectFilePath(layout, relativePath);
    return updateUiBundleConfig(absolutePath, formatProjectPathFromWorkspace(layout, relativePath));
  });

  const importResults = IMPORT_DIRECTORY_TARGETS.map((relativePath) => {
    const absolutePath = resolveProjectFilePath(layout, relativePath);
    return updateUiBundleImportNames(absolutePath, formatProjectPathFromWorkspace(layout, relativePath));
  });

  console.log('[uiBundle语义化] 已完成图鉴皮肤页命名收敛。');
  for (const result of configResults) {
    console.log(
      '[uiBundle语义化] 配置更新:',
      result.label,
      '路径改写数:',
      result.replacementCount
    );
  }
  for (const result of importResults) {
    console.log(
      '[uiBundle语义化] 元数据更新:',
      result.label,
      '文件更新数:',
      result.updatedFileCount,
      '名称改写数:',
      result.replacementCount
    );
  }
}

/**
 * 更新 uiBundle 配置中的图鉴皮肤页路径。
 * @param {string} filePath 配置绝对路径
 * @param {string} displayLabel 展示标签
 * @returns {{label: string, replacementCount: number}}
 */
function updateUiBundleConfig(filePath, displayLabel) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const parsedJson = JSON.parse(originalContent);
  let replacementCount = 0;

  for (const pathEntry of Object.values(parsedJson.paths || {})) {
    if (!Array.isArray(pathEntry) || typeof pathEntry[0] !== 'string') {
      continue;
    }

    const semanticPath = normalizeUiBundleSkinPath(pathEntry[0]);
    if (semanticPath !== pathEntry[0]) {
      pathEntry[0] = semanticPath;
      replacementCount += 1;
    }
  }

  verifyNoLegacyUiBundleSkinPaths(parsedJson, displayLabel);

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
 * 更新 uiBundle import 目录中的图鉴皮肤页 SpriteFrame 名称。
 * @param {string} directoryPath import 目录
 * @param {string} displayLabel 展示标签
 * @returns {{label: string, updatedFileCount: number, replacementCount: number}}
 */
function updateUiBundleImportNames(directoryPath, displayLabel) {
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
    const nextContent = originalContent.replace(LEGACY_SKIN_NAME_PATTERN, (match, token) => {
      const semanticName = SKIN_PAGE_NAME_MAP[token];
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

  verifyNoLegacyUiBundleSkinNames(directoryPath, displayLabel);

  return {
    label: displayLabel,
    updatedFileCount: updatedFileCount,
    replacementCount: replacementCount
  };
}

/**
 * 规范化 uiBundle 图鉴皮肤页路径。
 * @param {string} assetPath 原始路径
 * @returns {string}
 */
function normalizeUiBundleSkinPath(assetPath) {
  const matched = String(assetPath || '').match(LEGACY_SKIN_PATH_PATTERN);
  if (!matched) {
    return String(assetPath || '');
  }

  const pageIndex = matched[1];
  const suffix = matched[2] || '';
  const semanticBasePath = 'tex/book/pigeonGallery/skinCollection/skinPage' + pageIndex;

  if (!suffix) {
    return semanticBasePath;
  }

  return semanticBasePath + '/' + suffix;
}

/**
 * 校验配置里已经没有旧图鉴皮肤页路径。
 * @param {{paths?: Record<string, unknown>}} parsedJson 配置 JSON
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacyUiBundleSkinPaths(parsedJson, displayLabel) {
  const legacyPathList = [];

  for (const pathEntry of Object.values(parsedJson.paths || {})) {
    if (!Array.isArray(pathEntry) || typeof pathEntry[0] !== 'string') {
      continue;
    }

    const pathValue = pathEntry[0];
    if (LEGACY_SKIN_PATH_PATTERN.test(pathValue)) {
      legacyPathList.push(pathValue);
    }
  }

  if (legacyPathList.length > 0) {
    throw new Error(
      '[uiBundle语义化] 配置中仍残留图鉴皮肤页旧路径：' +
      displayLabel +
      ' -> ' +
      legacyPathList.slice(0, 5).join(', ')
    );
  }
}

/**
 * 校验 import 目录里已不存在 p1..p10 图鉴皮肤页名称。
 * @param {string} directoryPath import 目录
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacyUiBundleSkinNames(directoryPath, displayLabel) {
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

    LEGACY_SKIN_NAME_PATTERN.lastIndex = 0;
    if (LEGACY_SKIN_NAME_PATTERN.test(fileContent)) {
      legacyFileList.push(fileName);
    }
  }

  if (legacyFileList.length > 0) {
    throw new Error(
      '[uiBundle语义化] import 元数据仍残留图鉴皮肤页旧名称：' +
      displayLabel +
      ' -> ' +
      legacyFileList.slice(0, 5).join(', ')
    );
  }
}

semanticizeUiBundleBookSkinAssets();
