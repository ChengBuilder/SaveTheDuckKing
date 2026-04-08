'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const DIRECTORY_SCAN_TARGETS = [
  'assets',
  'subpackages'
];

const DIRECT_FILE_TARGETS = [
  'game.json',
  'src/runtime-settings.json'
];

/**
 * 格式化项目内关键 JSON 清单。
 * 目标：优先提升 bundle 配置、入口配置和运行时设置的可读性，
 * 为后续语义化重构提供稳定的人类可读基线。
 */
function formatProjectJsonFiles() {
  const layout = resolveProjectLayout(__dirname);
  const jsonFilePaths = resolveJsonFilePaths(layout);
  const updatedFilePaths = [];

  for (const jsonFilePath of jsonFilePaths) {
    if (formatJsonFile(jsonFilePath)) {
      updatedFilePaths.push(jsonFilePath);
    }
  }

  console.log('[JSON格式化] 已扫描文件数:', jsonFilePaths.length);
  console.log('[JSON格式化] 已更新文件数:', updatedFilePaths.length);

  for (const updatedFilePath of updatedFilePaths) {
    const relativePath = path.relative(layout.projectRoot, updatedFilePath);
    console.log('[JSON格式化] 已更新:', formatProjectPathFromWorkspace(layout, relativePath));
  }
}

/**
 * 收集需要格式化的 JSON 文件。
 * @param {{projectRoot: string}} layout 项目布局
 * @returns {string[]}
 */
function resolveJsonFilePaths(layout) {
  const filePathSet = new Set();

  for (const relativePath of DIRECT_FILE_TARGETS) {
    const absolutePath = resolveProjectFilePath(layout, relativePath);
    if (fs.existsSync(absolutePath)) {
      filePathSet.add(absolutePath);
    }
  }

  for (const directoryRelativePath of DIRECTORY_SCAN_TARGETS) {
    const directoryPath = resolveProjectFilePath(layout, directoryRelativePath);
    if (!fs.existsSync(directoryPath)) {
      continue;
    }

    collectJsonFiles(directoryPath, filePathSet);
  }

  return Array.from(filePathSet).sort();
}

/**
 * 递归收集关键 JSON 文件。
 * 仅处理入口配置、bundle 配置与兼容配置，不触碰 import 元数据。
 * @param {string} directoryPath 当前目录
 * @param {Set<string>} filePathSet 文件集合
 */
function collectJsonFiles(directoryPath, filePathSet) {
  const directoryEntries = fs.readdirSync(directoryPath, { withFileTypes: true });

  for (const directoryEntry of directoryEntries) {
    const targetPath = path.join(directoryPath, directoryEntry.name);

    if (directoryEntry.isDirectory()) {
      if (directoryEntry.name === 'import' || directoryEntry.name === 'native') {
        continue;
      }
      collectJsonFiles(targetPath, filePathSet);
      continue;
    }

    if (!directoryEntry.isFile()) {
      continue;
    }

    if (shouldFormatJsonFile(directoryEntry.name)) {
      filePathSet.add(targetPath);
    }
  }
}

/**
 * 判断当前 JSON 文件是否属于关键清单。
 * @param {string} fileName 文件名
 * @returns {boolean}
 */
function shouldFormatJsonFile(fileName) {
  return fileName === 'game.json'
    || fileName === 'runtime-settings.json'
    || /^config(?:\.[a-z0-9-]+)?\.json$/i.test(fileName);
}

/**
 * 格式化单个 JSON 文件。
 * @param {string} filePath 文件路径
 * @returns {boolean}
 */
function formatJsonFile(filePath) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const parsedJson = JSON.parse(originalContent);
  const formattedContent = JSON.stringify(parsedJson, null, 2) + '\n';

  if (originalContent === formattedContent) {
    return false;
  }

  fs.writeFileSync(filePath, formattedContent);
  return true;
}

formatProjectJsonFiles();
