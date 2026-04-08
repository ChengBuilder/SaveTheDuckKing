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

const IGNORED_DIRECTORY_NAMES = new Set([
  '.git',
  '.idea',
  'node_modules'
]);

/**
 * 生成“素材与代码分离报告”。
 * 输出项目当前代码文件、素材文件与混放目录统计，便于持续治理。
 */
function generateAssetCodeReport() {
  const projectRoot = path.resolve(__dirname, '..', '..');
  const outputPath = path.join(projectRoot, 'architecture', 'docs', 'asset-code-layout.md');
  const files = collectFiles(projectRoot);

  const summary = buildSummary(files);
  const bucketStats = buildBucketStats(projectRoot, files);
  const mixedDirectories = detectMixedDirectories(projectRoot, files);

  const markdownLines = [];
  markdownLines.push('# 素材与代码分离报告（自动生成）');
  markdownLines.push('');
  markdownLines.push('> 本文件由 `architecture/tools/generate-asset-code-report.js` 生成。');
  markdownLines.push('');
  markdownLines.push('## 总览');
  markdownLines.push('- 代码文件数：' + summary.codeFiles);
  markdownLines.push('- 素材文件数：' + summary.assetFiles);
  markdownLines.push('- 其他文件数：' + summary.otherFiles);
  markdownLines.push('- 扫描总文件数：' + summary.totalFiles);
  markdownLines.push('');
  markdownLines.push('## 一级目录分布');
  markdownLines.push('| 目录 | 代码文件 | 素材文件 | 其他文件 |');
  markdownLines.push('| --- | ---: | ---: | ---: |');
  for (const stat of bucketStats) {
    markdownLines.push(
      `| \`${stat.name}\` | ${stat.codeFiles} | ${stat.assetFiles} | ${stat.otherFiles} |`
    );
  }
  markdownLines.push('');
  markdownLines.push('## 混放目录（同时包含代码与素材）');
  if (mixedDirectories.length === 0) {
    markdownLines.push('- 无');
  } else {
    for (const directoryPath of mixedDirectories) {
      markdownLines.push('- `' + directoryPath + '`');
    }
  }
  markdownLines.push('');

  fs.writeFileSync(outputPath, markdownLines.join('\n'));
  console.log('[素材分层报告] 已生成:', outputPath);
}

/**
 * 构建全局统计。
 * @param {string[]} files 文件列表
 * @returns {{codeFiles: number, assetFiles: number, otherFiles: number, totalFiles: number}}
 */
function buildSummary(files) {
  let codeFiles = 0;
  let assetFiles = 0;
  let otherFiles = 0;

  for (const filePath of files) {
    const fileType = classifyFile(filePath);
    if (fileType === 'code') {
      codeFiles += 1;
      continue;
    }
    if (fileType === 'asset') {
      assetFiles += 1;
      continue;
    }
    otherFiles += 1;
  }

  return {
    codeFiles: codeFiles,
    assetFiles: assetFiles,
    otherFiles: otherFiles,
    totalFiles: files.length
  };
}

/**
 * 构建一级目录统计。
 * @param {string} projectRoot 项目根目录
 * @param {string[]} files 文件列表
 * @returns {{name: string, codeFiles: number, assetFiles: number, otherFiles: number}[]}
 */
function buildBucketStats(projectRoot, files) {
  const statsMap = new Map();
  const rootName = path.basename(projectRoot);

  for (const filePath of files) {
    const relativePath = toRelative(projectRoot, filePath);
    const pathSegments = relativePath.split('/');
    const firstSegment = pathSegments[0];
    const bucketName = pathSegments.length === 1
      ? rootName + ' (root)'
      : firstSegment;
    const bucketStats = ensureBucketStats(statsMap, bucketName);
    const fileType = classifyFile(filePath);

    if (fileType === 'code') {
      bucketStats.codeFiles += 1;
      continue;
    }
    if (fileType === 'asset') {
      bucketStats.assetFiles += 1;
      continue;
    }
    bucketStats.otherFiles += 1;
  }

  return Array.from(statsMap.values()).sort(function sortByBucketName(left, right) {
    return left.name.localeCompare(right.name);
  });
}

/**
 * 检测混放目录。
 * @param {string} projectRoot 项目根目录
 * @param {string[]} files 文件列表
 * @returns {string[]}
 */
function detectMixedDirectories(projectRoot, files) {
  const directoryStatsMap = new Map();

  for (const filePath of files) {
    const directoryPath = path.dirname(filePath);
    const directoryStats = ensureDirectoryStats(directoryStatsMap, directoryPath);
    const fileType = classifyFile(filePath);
    if (fileType === 'code') {
      directoryStats.hasCodeFile = true;
    } else if (fileType === 'asset') {
      directoryStats.hasAssetFile = true;
    }
  }

  const mixedDirectories = [];
  for (const [directoryPath, directoryStats] of directoryStatsMap.entries()) {
    if (directoryStats.hasCodeFile && directoryStats.hasAssetFile) {
      mixedDirectories.push(toRelative(projectRoot, directoryPath));
    }
  }

  return mixedDirectories.sort();
}

/**
 * 获取或创建桶统计对象。
 * @param {Map<string, {name: string, codeFiles: number, assetFiles: number, otherFiles: number}>} statsMap 统计映射
 * @param {string} bucketName 桶名称
 * @returns {{name: string, codeFiles: number, assetFiles: number, otherFiles: number}}
 */
function ensureBucketStats(statsMap, bucketName) {
  const existingStats = statsMap.get(bucketName);
  if (existingStats) {
    return existingStats;
  }

  const nextStats = {
    name: bucketName,
    codeFiles: 0,
    assetFiles: 0,
    otherFiles: 0
  };
  statsMap.set(bucketName, nextStats);
  return nextStats;
}

/**
 * 获取或创建目录统计对象。
 * @param {Map<string, {hasCodeFile: boolean, hasAssetFile: boolean}>} directoryStatsMap 目录统计映射
 * @param {string} directoryPath 目录路径
 * @returns {{hasCodeFile: boolean, hasAssetFile: boolean}}
 */
function ensureDirectoryStats(directoryStatsMap, directoryPath) {
  const existingStats = directoryStatsMap.get(directoryPath);
  if (existingStats) {
    return existingStats;
  }

  const nextStats = {
    hasCodeFile: false,
    hasAssetFile: false
  };
  directoryStatsMap.set(directoryPath, nextStats);
  return nextStats;
}

/**
 * 判断文件类型。
 * @param {string} filePath 文件路径
 * @returns {'code' | 'asset' | 'other'}
 */
function classifyFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (CODE_EXTENSIONS.has(extension)) {
    return 'code';
  }
  if (ASSET_EXTENSIONS.has(extension)) {
    return 'asset';
  }
  return 'other';
}

/**
 * 收集目录下全部文件。
 * @param {string} rootDir 根目录
 * @returns {string[]}
 */
function collectFiles(rootDir) {
  const filePaths = [];
  const pendingDirectories = [rootDir];

  while (pendingDirectories.length > 0) {
    const currentDirectory = pendingDirectories.pop();
    const entries = fs.readdirSync(currentDirectory, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDirectory, entry.name);
      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORY_NAMES.has(entry.name)) {
          continue;
        }
        pendingDirectories.push(fullPath);
      } else if (entry.isFile()) {
        filePaths.push(fullPath);
      }
    }
  }

  return filePaths;
}

/**
 * 转换为统一分隔符的相对路径。
 * @param {string} rootDir 根目录
 * @param {string} targetPath 目标路径
 * @returns {string}
 */
function toRelative(rootDir, targetPath) {
  return path.relative(rootDir, targetPath).replace(/\\/g, '/');
}

generateAssetCodeReport();
