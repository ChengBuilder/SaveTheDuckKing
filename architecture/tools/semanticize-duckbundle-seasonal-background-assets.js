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

const SEASON_FOLDER_MAP = Object.freeze({
  冬: 'winterTheme',
  夏: 'summerTheme',
  春: 'springTheme',
  秋: 'autumnTheme',
  青色: 'cyanTheme'
});

const SEASON_ASSET_LEAF_MAP = Object.freeze({
  bg: 'background',
  井: 'well',
  右下: 'cornerBottomRight',
  左下: 'cornerBottomLeft'
});

const LEGACY_SEASONAL_PATH_PATTERN = /^tex\/newBg\/(冬|夏|春|秋|青色)\/(bg|井|右下|左下)([1-5])(?:\/(spriteFrame|texture))?$/;
const LEGACY_SPRITE_NAME_PATTERN = /"name"\s*:\s*"(bg|井|右下|左下)([1-5])"/g;

/**
 * 把 DuckBundle 季节背景目录（newBg）收敛到语义化英文命名。
 * 当前策略：
 * 1. tex/newBg/<季节>/<部件+索引> -> tex/seasonalBackground/<seasonTheme>/<semanticLeaf>
 * 2. 对应 SpriteFrame 名称改为 semantic + ThemeIndex
 * 3. game.js 中同名旧路径字符串一并替换（若存在）
 */
function semanticizeDuckBundleSeasonalBackgroundAssets() {
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

  console.log('[DuckBundle季节背景语义化] 已完成 seasonalBackground 路径收敛。');
  for (const result of configResults) {
    console.log(
      '[DuckBundle季节背景语义化] 配置更新:',
      result.label,
      '路径改写数:',
      result.replacementCount
    );
  }
  for (const result of importResults) {
    console.log(
      '[DuckBundle季节背景语义化] 元数据更新:',
      result.label,
      '文件更新数:',
      result.updatedFileCount,
      '名称改写数:',
      result.replacementCount
    );
  }
  console.log(
    '[DuckBundle季节背景语义化] 运行时更新:',
    gameJsResult.label,
    '路径替换总数:',
    gameJsResult.replacementCount
  );
}

/**
 * 更新 bundle 配置中的 seasonalBackground 路径。
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

    const semanticPath = normalizeSeasonalBackgroundPath(pathEntry[0]);
    if (semanticPath !== pathEntry[0]) {
      pathEntry[0] = semanticPath;
      replacementCount += 1;
    }
  }

  verifyNoLegacySeasonalBackgroundPaths(parsedJson, displayLabel);

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
 * 更新 SpriteFrame import 元数据中的季节背景名称。
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
    const nextContent = originalContent.replace(LEGACY_SPRITE_NAME_PATTERN, (match, legacyLeafToken, themeIndex) => {
      const semanticLeaf = SEASON_ASSET_LEAF_MAP[legacyLeafToken];
      if (!semanticLeaf) {
        return match;
      }

      fileReplacementCount += 1;
      return '"name":"' + semanticLeaf + 'Theme' + themeIndex + '"';
    });

    if (fileReplacementCount > 0) {
      fs.writeFileSync(filePath, nextContent);
      updatedFileCount += 1;
      replacementCount += fileReplacementCount;
    }
  }

  verifyNoLegacySeasonalBackgroundNames(directoryPath, displayLabel);

  return {
    label: displayLabel,
    updatedFileCount: updatedFileCount,
    replacementCount: replacementCount
  };
}

/**
 * 更新 game.js 中的旧 seasonal 路径字符串。
 * @param {string} filePath game.js 绝对路径
 * @param {string} displayLabel 展示标签
 * @returns {{label: string, replacementCount: number}}
 */
function updateGameJs(filePath, displayLabel) {
  let content = fs.readFileSync(filePath, 'utf8');
  let replacementCount = 0;

  const replacePatterns = [
    { legacy: 'tex/newBg/冬/', next: 'tex/seasonalBackground/winterTheme/' },
    { legacy: 'tex/newBg/夏/', next: 'tex/seasonalBackground/summerTheme/' },
    { legacy: 'tex/newBg/春/', next: 'tex/seasonalBackground/springTheme/' },
    { legacy: 'tex/newBg/秋/', next: 'tex/seasonalBackground/autumnTheme/' },
    { legacy: 'tex/newBg/青色/', next: 'tex/seasonalBackground/cyanTheme/' }
  ];

  for (const replacement of replacePatterns) {
    const parts = content.split(replacement.legacy);
    const hitCount = parts.length - 1;
    if (hitCount <= 0) {
      continue;
    }

    content = parts.join(replacement.next);
    replacementCount += hitCount;
  }

  if (replacementCount > 0) {
    fs.writeFileSync(filePath, content);
  }
  verifyNoLegacySeasonalBackgroundPathInGameJs(content, displayLabel);

  return {
    label: displayLabel,
    replacementCount: replacementCount
  };
}

/**
 * 规范化单条 seasonalBackground 路径。
 * @param {string} assetPath 原始路径
 * @returns {string}
 */
function normalizeSeasonalBackgroundPath(assetPath) {
  const matched = String(assetPath || '').match(LEGACY_SEASONAL_PATH_PATTERN);
  if (!matched) {
    return String(assetPath || '');
  }

  const legacySeasonToken = matched[1];
  const legacyLeafToken = matched[2];
  const suffix = matched[4] || '';
  const semanticSeasonFolder = SEASON_FOLDER_MAP[legacySeasonToken];
  const semanticLeaf = SEASON_ASSET_LEAF_MAP[legacyLeafToken];

  if (!semanticSeasonFolder || !semanticLeaf) {
    return String(assetPath || '');
  }

  const semanticBasePath = 'tex/seasonalBackground/' + semanticSeasonFolder + '/' + semanticLeaf;
  if (!suffix) {
    return semanticBasePath;
  }

  return semanticBasePath + '/' + suffix;
}

/**
 * 校验配置中已无旧 seasonal 背景路径。
 * @param {{paths?: Record<string, unknown>}} parsedJson 配置 JSON
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacySeasonalBackgroundPaths(parsedJson, displayLabel) {
  const legacyPathList = [];

  for (const pathEntry of Object.values(parsedJson.paths || {})) {
    if (!Array.isArray(pathEntry) || typeof pathEntry[0] !== 'string') {
      continue;
    }

    const pathValue = pathEntry[0];
    if (pathValue.startsWith('tex/newBg/')) {
      legacyPathList.push(pathValue);
    }
  }

  if (legacyPathList.length > 0) {
    throw new Error(
      '[DuckBundle季节背景语义化] 配置中仍残留旧路径：' +
      displayLabel +
      ' -> ' +
      legacyPathList.slice(0, 5).join(', ')
    );
  }
}

/**
 * 校验 import 目录中已无旧 seasonal SpriteFrame 名称。
 * @param {string} directoryPath import 目录
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacySeasonalBackgroundNames(directoryPath, displayLabel) {
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

    LEGACY_SPRITE_NAME_PATTERN.lastIndex = 0;
    if (LEGACY_SPRITE_NAME_PATTERN.test(fileContent)) {
      legacyFileList.push(fileName);
    }
  }

  if (legacyFileList.length > 0) {
    throw new Error(
      '[DuckBundle季节背景语义化] import 元数据仍残留旧名称：' +
      displayLabel +
      ' -> ' +
      legacyFileList.slice(0, 5).join(', ')
    );
  }
}

/**
 * 校验 game.js 中已无旧 seasonal 路径字符串。
 * @param {string} gameSource game.js 文本
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacySeasonalBackgroundPathInGameJs(gameSource, displayLabel) {
  const legacyMarkers = [
    'tex/newBg/冬/',
    'tex/newBg/夏/',
    'tex/newBg/春/',
    'tex/newBg/秋/',
    'tex/newBg/青色/'
  ];
  const remaining = legacyMarkers.filter((marker) => gameSource.includes(marker));

  if (remaining.length > 0) {
    throw new Error(
      '[DuckBundle季节背景语义化] game.js 中仍残留旧路径：' +
      displayLabel +
      ' -> ' +
      remaining.join(', ')
    );
  }
}

semanticizeDuckBundleSeasonalBackgroundAssets();
