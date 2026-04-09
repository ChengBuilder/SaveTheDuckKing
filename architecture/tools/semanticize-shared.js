'use strict';

const fs = require('fs');
const path = require('path');

/**
 * 遍历配置中的路径条目。
 * @param {{paths?: Record<string, unknown>}} parsedJson 配置 JSON
 * @param {(pathEntry: any) => void} visitor 遍历回调
 */
function forEachConfigPathEntry(parsedJson, visitor) {
  if (!parsedJson || typeof parsedJson !== 'object' || typeof visitor !== 'function') {
    return;
  }

  for (const pathEntry of Object.values(parsedJson.paths || {})) {
    if (!Array.isArray(pathEntry) || typeof pathEntry[0] !== 'string') {
      continue;
    }
    visitor(pathEntry);
  }
}

/**
 * 统一更新配置 JSON 中的资源路径。
 * @param {string} filePath 配置文件路径
 * @param {(assetPath: string) => string} normalizePath 路径归一化函数
 * @param {(parsedJson: Record<string, unknown>) => void} verifyAfterNormalize 归一化后校验
 * @returns {{replacementCount: number}}
 */
function updateConfigPathEntries(filePath, normalizePath, verifyAfterNormalize) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const parsedJson = JSON.parse(originalContent);
  let replacementCount = 0;

  forEachConfigPathEntry(parsedJson, (pathEntry) => {
    const nextPath = typeof normalizePath === 'function'
      ? normalizePath(pathEntry[0])
      : pathEntry[0];
    if (nextPath !== pathEntry[0]) {
      pathEntry[0] = nextPath;
      replacementCount += 1;
    }
  });

  if (typeof verifyAfterNormalize === 'function') {
    verifyAfterNormalize(parsedJson);
  }

  const formattedContent = JSON.stringify(parsedJson, null, 2) + '\n';
  if (formattedContent !== originalContent) {
    fs.writeFileSync(filePath, formattedContent);
  }

  return {
    replacementCount: replacementCount
  };
}

/**
 * 统一更新 import 目录内 SpriteFrame 元数据名称。
 * @param {string} directoryPath import 目录路径
 * @param {RegExp} legacyNamePattern 旧名称匹配正则（需包含 token 捕获组）
 * @param {(token: string, match: string) => string | null | undefined} resolveSemanticName 名称映射函数
 * @returns {{updatedFileCount: number, replacementCount: number}}
 */
function updateImportSpriteFrameNames(directoryPath, legacyNamePattern, resolveSemanticName) {
  const fileNames = fs.readdirSync(directoryPath).sort();
  let updatedFileCount = 0;
  let replacementCount = 0;

  for (let index = 0; index < fileNames.length; index += 1) {
    const fileName = fileNames[index];
    if (!fileName.endsWith('.json')) {
      continue;
    }

    const filePath = path.join(directoryPath, fileName);
    const originalContent = fs.readFileSync(filePath, 'utf8');
    if (!originalContent.includes('"cc.SpriteFrame"')) {
      continue;
    }

    let fileReplacementCount = 0;
    if (legacyNamePattern instanceof RegExp) {
      legacyNamePattern.lastIndex = 0;
    }
    const nextContent = originalContent.replace(legacyNamePattern, (match, token) => {
      const semanticName = typeof resolveSemanticName === 'function'
        ? resolveSemanticName(token, match)
        : null;
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

  return {
    updatedFileCount: updatedFileCount,
    replacementCount: replacementCount
  };
}

/**
 * 收集配置中的 legacy 路径条目。
 * @param {{paths?: Record<string, unknown>}} parsedJson 配置 JSON
 * @param {(pathValue: string) => boolean} isLegacyPath legacy 判断函数
 * @returns {string[]}
 */
function collectLegacyConfigPaths(parsedJson, isLegacyPath) {
  const legacyPathList = [];

  forEachConfigPathEntry(parsedJson, (pathEntry) => {
    const pathValue = pathEntry[0];
    if (typeof isLegacyPath === 'function' && isLegacyPath(pathValue)) {
      legacyPathList.push(pathValue);
    }
  });

  return legacyPathList;
}

/**
 * 收集 import 目录中仍包含 legacy SpriteFrame 名称的文件名。
 * @param {string} directoryPath import 目录路径
 * @param {RegExp} legacyNamePattern 旧名称匹配正则
 * @returns {string[]}
 */
function collectLegacySpriteFrameFiles(directoryPath, legacyNamePattern) {
  const legacyFileList = [];
  const fileNames = fs.readdirSync(directoryPath).sort();

  for (let index = 0; index < fileNames.length; index += 1) {
    const fileName = fileNames[index];
    if (!fileName.endsWith('.json')) {
      continue;
    }

    const filePath = path.join(directoryPath, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (!fileContent.includes('"cc.SpriteFrame"')) {
      continue;
    }

    if (legacyNamePattern instanceof RegExp) {
      legacyNamePattern.lastIndex = 0;
    }
    if (legacyNamePattern.test(fileContent)) {
      legacyFileList.push(fileName);
    }
  }

  return legacyFileList;
}

/**
 * 正则元字符转义。
 * @param {string} rawToken 原始文本
 * @returns {string}
 */
function escapeRegExp(rawToken) {
  return String(rawToken).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  updateConfigPathEntries: updateConfigPathEntries,
  updateImportSpriteFrameNames: updateImportSpriteFrameNames,
  collectLegacyConfigPaths: collectLegacyConfigPaths,
  collectLegacySpriteFrameFiles: collectLegacySpriteFrameFiles,
  escapeRegExp: escapeRegExp
};
