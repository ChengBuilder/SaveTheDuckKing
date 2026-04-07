'use strict';

const fs = require('fs');
const path = require('path');

const CODE_EXTENSIONS = new Set([
  '.js',
  '.cjs',
  '.mjs',
  '.json',
  '.md',
  '.txt',
  '.yml',
  '.yaml',
  '.toml'
]);

const SCRIPT_EXTENSIONS = new Set([
  '.js',
  '.cjs',
  '.mjs',
  '.ts'
]);

const ASSET_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.bmp',
  '.atlas',
  '.mp3',
  '.wav',
  '.ogg',
  '.aac',
  '.ttf',
  '.fnt',
  '.wasm',
  '.mp4',
  '.mov',
  '.skel',
  '.plist',
  '.bin'
]);

const IMPORT_FORBIDDEN_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.bmp',
  '.atlas',
  '.mp3',
  '.wav',
  '.ogg',
  '.aac',
  '.ttf',
  '.fnt',
  '.wasm',
  '.mp4',
  '.mov'
]);

const ALLOWED_MIXED_DIRECTORIES = new Set([
  'cocos-js/assets'
]);

/**
 * 检查素材与代码分离规范。
 * 目标：避免素材目录混入脚本，或代码目录混入二进制素材。
 */
function checkAssetCodeSeparation() {
  const projectRoot = path.resolve(__dirname, '..', '..');
  const files = collectFiles(projectRoot);
  const issues = [];

  checkNativeDirectorySafety(projectRoot, files, issues);
  checkImportDirectorySafety(projectRoot, files, issues);
  checkArchitectureDirectorySafety(projectRoot, files, issues);
  checkMixedDirectories(projectRoot, files, issues);

  if (issues.length > 0) {
    console.error('[check-asset-code-separation] 发现分层问题：');
    for (const issue of issues) {
      console.error('- ' + issue);
    }
    process.exitCode = 1;
    return;
  }

  console.log('[check-asset-code-separation] 通过');
}

/**
 * 检查 native 目录中是否混入脚本文件。
 * @param {string} projectRoot 项目根目录
 * @param {string[]} files 文件列表
 * @param {string[]} issues 问题列表
 */
function checkNativeDirectorySafety(projectRoot, files, issues) {
  for (const filePath of files) {
    if (!containsPathSegment(filePath, 'native')) {
      continue;
    }

    const extension = path.extname(filePath).toLowerCase();
    if (!SCRIPT_EXTENSIONS.has(extension)) {
      continue;
    }

    issues.push('native 目录不应包含脚本: ' + toRelative(projectRoot, filePath));
  }
}

/**
 * 检查 import 目录中是否混入二进制素材。
 * @param {string} projectRoot 项目根目录
 * @param {string[]} files 文件列表
 * @param {string[]} issues 问题列表
 */
function checkImportDirectorySafety(projectRoot, files, issues) {
  for (const filePath of files) {
    if (!containsPathSegment(filePath, 'import')) {
      continue;
    }

    const extension = path.extname(filePath).toLowerCase();
    if (!IMPORT_FORBIDDEN_EXTENSIONS.has(extension)) {
      continue;
    }

    issues.push('import 目录不应包含二进制素材: ' + toRelative(projectRoot, filePath));
  }
}

/**
 * 检查 architecture 目录中是否混入素材文件。
 * @param {string} projectRoot 项目根目录
 * @param {string[]} files 文件列表
 * @param {string[]} issues 问题列表
 */
function checkArchitectureDirectorySafety(projectRoot, files, issues) {
  const architecturePrefix = normalizePath(path.join(projectRoot, 'architecture')) + '/';

  for (const filePath of files) {
    const normalizedPath = normalizePath(filePath);
    if (!normalizedPath.startsWith(architecturePrefix)) {
      continue;
    }

    const extension = path.extname(filePath).toLowerCase();
    if (!ASSET_EXTENSIONS.has(extension)) {
      continue;
    }

    issues.push('architecture 目录不应包含素材文件: ' + toRelative(projectRoot, filePath));
  }
}

/**
 * 检查目录是否出现“代码文件 + 素材文件”混放。
 * @param {string} projectRoot 项目根目录
 * @param {string[]} files 文件列表
 * @param {string[]} issues 问题列表
 */
function checkMixedDirectories(projectRoot, files, issues) {
  const directoryStatsMap = new Map();

  for (const filePath of files) {
    const directoryPath = path.dirname(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const directoryStats = ensureDirectoryStats(directoryStatsMap, directoryPath);

    if (CODE_EXTENSIONS.has(extension)) {
      directoryStats.hasCodeFile = true;
    }

    if (ASSET_EXTENSIONS.has(extension)) {
      directoryStats.hasAssetFile = true;
    }

    directoryStats.fileCount += 1;
  }

  for (const [directoryPath, directoryStats] of directoryStatsMap.entries()) {
    if (!directoryStats.hasCodeFile || !directoryStats.hasAssetFile) {
      continue;
    }

    const relativeDirectoryPath = toRelative(projectRoot, directoryPath);
    if (ALLOWED_MIXED_DIRECTORIES.has(relativeDirectoryPath)) {
      continue;
    }

    issues.push('目录同时存在代码与素材，请拆分: ' + relativeDirectoryPath);
  }
}

/**
 * 获取或创建目录统计对象。
 * @param {Map<string, {hasCodeFile: boolean, hasAssetFile: boolean, fileCount: number}>} directoryStatsMap 目录统计映射
 * @param {string} directoryPath 目录路径
 * @returns {{hasCodeFile: boolean, hasAssetFile: boolean, fileCount: number}}
 */
function ensureDirectoryStats(directoryStatsMap, directoryPath) {
  const existingStats = directoryStatsMap.get(directoryPath);
  if (existingStats) {
    return existingStats;
  }

  const nextStats = {
    hasCodeFile: false,
    hasAssetFile: false,
    fileCount: 0
  };
  directoryStatsMap.set(directoryPath, nextStats);
  return nextStats;
}

/**
 * 收集目录下的全部文件。
 * @param {string} rootDir 根目录
 * @returns {string[]}
 */
function collectFiles(rootDir) {
  const results = [];
  const pendingDirectories = [rootDir];

  while (pendingDirectories.length > 0) {
    const currentDirectory = pendingDirectories.pop();
    const entries = fs.readdirSync(currentDirectory, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDirectory, entry.name);
      if (entry.isDirectory()) {
        pendingDirectories.push(fullPath);
        continue;
      }
      if (entry.isFile()) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

/**
 * 判断路径中是否包含指定目录名。
 * @param {string} targetPath 目标路径
 * @param {string} segmentName 目录名
 * @returns {boolean}
 */
function containsPathSegment(targetPath, segmentName) {
  const normalizedPath = normalizePath(targetPath);
  const marker = '/' + segmentName + '/';
  return normalizedPath.includes(marker) || normalizedPath.endsWith('/' + segmentName);
}

/**
 * 规范化路径分隔符为正斜杠。
 * @param {string} targetPath 目标路径
 * @returns {string}
 */
function normalizePath(targetPath) {
  return targetPath.replace(/\\/g, '/');
}

/**
 * 输出相对路径（统一正斜杠）。
 * @param {string} rootDir 根目录
 * @param {string} targetPath 目标路径
 * @returns {string}
 */
function toRelative(rootDir, targetPath) {
  return normalizePath(path.relative(rootDir, targetPath));
}

checkAssetCodeSeparation();
