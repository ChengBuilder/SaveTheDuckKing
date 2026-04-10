'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const WOOD_PALETTE_MAP = {
  a: 'grayWood',
  b: 'lightWood',
  c: 'redWood',
  d: 'brownWood',
  e: 'goldWood',
  f: 'yellowWood'
};

const CONFIG_TARGETS = [
  'subpackages/DuckBundle/config.duck-bundle.json'
];

const IMPORT_DIRECTORY_TARGETS = [
  'subpackages/DuckBundle/import'
];

const GAME_JS_RELATIVE_PATH = 'game.js';

const GAME_JS_REPLACEMENTS = [
  {
    before: 'woodColorArr=["a","b","c","d","e"]',
    after: 'woodColorArr=["grayWood","lightWood","redWood","brownWood","goldWood"]'
  },
  {
    before: 'singleColorArr=["a","b","f","c"]',
    after: 'singleColorArr=["grayWood","lightWood","yellowWood","redWood"]'
  }
];

const LEGACY_WOOD_PATH_PATTERN = /^tex\/wood\/([abcdef])\/\1(\d+)(\/(?:spriteFrame|texture))?$/;
const LEGACY_WOOD_NAME_PATTERN = /"name"\s*:\s*"([abcdef])(\d+)"/g;

/**
 * 把 DuckBundle 里的木板配色族从 a..f 直接收敛到可读语义名。
 * 本脚本只处理已经通过运行时与素材抽样双重确认的稳定命名：
 * a/b/c/d/e/f -> gray/light/red/brown/gold/yellow wood
 */
function semanticizeDuckBundleWoodAssets() {
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

  console.log('[木板语义化] 已完成 DuckBundle 木板配色族 rename。');
  for (const result of configResults) {
    console.log('[木板语义化] 配置更新:', result.label, '路径改写数:', result.replacementCount);
  }
  for (const result of importResults) {
    console.log('[木板语义化] 元数据更新:', result.label, '文件更新数:', result.updatedFileCount, '名称改写数:', result.replacementCount);
  }
  console.log('[木板语义化] 运行时更新:', gameJsResult.label, '替换条目数:', gameJsResult.replacementCount);
}

/**
 * 更新 bundle 配置中的 canonical 木板路径。
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

    const semanticPath = renameWoodPath(pathEntry[0]);
    if (semanticPath !== pathEntry[0]) {
      pathEntry[0] = semanticPath;
      replacementCount += 1;
    }
  }

  verifyNoLegacyWoodPathEntries(parsedJson, displayLabel);

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
 * 更新 SpriteFrame import 元数据中的可读名字。
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

    if (!originalContent.includes('"cc.SpriteFrame"') || !originalContent.includes('"_textureSource"')) {
      continue;
    }

    let fileReplacementCount = 0;
    const nextContent = originalContent.replace(LEGACY_WOOD_NAME_PATTERN, (match, familyCode, serialNumber) => {
      const semanticPrefix = WOOD_PALETTE_MAP[familyCode];
      if (!semanticPrefix) {
        return match;
      }

      fileReplacementCount += 1;
      return '"name":"' + semanticPrefix + serialNumber + '"';
    });

    if (fileReplacementCount > 0) {
      fs.writeFileSync(filePath, nextContent);
      updatedFileCount += 1;
      replacementCount += fileReplacementCount;
    }
  }

  verifyNoLegacyWoodNames(directoryPath, displayLabel);

  return {
    label: displayLabel,
    updatedFileCount: updatedFileCount,
    replacementCount: replacementCount
  };
}

/**
 * 更新 game.js 中的木板配色数组，保持运行时直接命中新 canonical 路径。
 * @param {string} filePath game.js 绝对路径
 * @param {string} displayLabel 展示标签
 * @returns {{label: string, replacementCount: number}}
 */
function updateGameJs(filePath, displayLabel) {
  let content = fs.readFileSync(filePath, 'utf8');
  let replacementCount = 0;

  for (const replacement of GAME_JS_REPLACEMENTS) {
    if (content.includes(replacement.after)) {
      continue;
    }

    if (!content.includes(replacement.before)) {
      throw new Error('[木板语义化] 未找到预期片段，无法安全更新 game.js：' + replacement.before);
    }

    content = content.replace(replacement.before, replacement.after);
    replacementCount += 1;
  }

  fs.writeFileSync(filePath, content);

  for (const replacement of GAME_JS_REPLACEMENTS) {
    if (!content.includes(replacement.after)) {
      throw new Error('[木板语义化] game.js 未成功写入新片段：' + replacement.after);
    }
  }

  return {
    label: displayLabel,
    replacementCount: replacementCount
  };
}

/**
 * 把单个 canonical 木板路径收敛到新命名。
 * @param {string} assetPath 旧路径
 * @returns {string}
 */
function renameWoodPath(assetPath) {
  const match = String(assetPath || '').match(LEGACY_WOOD_PATH_PATTERN);
  if (!match) {
    return assetPath;
  }

  const familyCode = match[1];
  const serialNumber = match[2];
  const suffix = match[3] || '';
  const semanticPrefix = WOOD_PALETTE_MAP[familyCode];

  if (!semanticPrefix) {
    return assetPath;
  }

  return 'tex/wood/' + semanticPrefix + '/' + semanticPrefix + serialNumber + suffix;
}

/**
 * 校验配置文件里已不存在旧木板路径。
 * @param {{paths?: Record<string, unknown>}} parsedJson 配置 JSON
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacyWoodPathEntries(parsedJson, displayLabel) {
  const legacyPathList = [];

  for (const pathEntry of Object.values(parsedJson.paths || {})) {
    if (!Array.isArray(pathEntry) || typeof pathEntry[0] !== 'string') {
      continue;
    }

    if (LEGACY_WOOD_PATH_PATTERN.test(pathEntry[0])) {
      legacyPathList.push(pathEntry[0]);
    }
  }

  if (legacyPathList.length > 0) {
    throw new Error('[木板语义化] 配置中仍残留旧木板路径：' + displayLabel + ' -> ' + legacyPathList.slice(0, 5).join(', '));
  }
}

/**
 * 校验 import 目录里已不存在旧木板 SpriteFrame 名称。
 * @param {string} directoryPath import 目录
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacyWoodNames(directoryPath, displayLabel) {
  const legacyFileList = [];

  for (const fileName of fs.readdirSync(directoryPath)) {
    if (!fileName.endsWith('.json')) {
      continue;
    }

    const filePath = path.join(directoryPath, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (!fileContent.includes('"cc.SpriteFrame"') || !fileContent.includes('"_textureSource"')) {
      continue;
    }

    LEGACY_WOOD_NAME_PATTERN.lastIndex = 0;
    if (LEGACY_WOOD_NAME_PATTERN.test(fileContent)) {
      legacyFileList.push(fileName);
    }
  }

  if (legacyFileList.length > 0) {
    throw new Error('[木板语义化] import 元数据仍残留旧木板名称：' + displayLabel + ' -> ' + legacyFileList.slice(0, 5).join(', '));
  }
}

semanticizeDuckBundleWoodAssets();
