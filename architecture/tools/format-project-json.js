'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const DIRECTORY_SCAN_TARGETS = [
  '.'
];

const DIRECT_FILE_TARGETS = [
  'app-config.json',
  'game.json',
  'project.config.json',
  'project.private.config.json',
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
  const skippedFileReports = [];

  for (const jsonFilePath of jsonFilePaths) {
    const formatResult = formatJsonFile(jsonFilePath);
    if (formatResult.updated) {
      updatedFilePaths.push(jsonFilePath);
    }
    if (formatResult.skippedReason) {
      skippedFileReports.push({
        filePath: jsonFilePath,
        reason: formatResult.skippedReason
      });
    }
  }

  console.log('[JSON格式化] 已扫描文件数:', jsonFilePaths.length);
  console.log('[JSON格式化] 已更新文件数:', updatedFilePaths.length);
  console.log('[JSON格式化] 已跳过文件数:', skippedFileReports.length);

  for (const updatedFilePath of updatedFilePaths) {
    const relativePath = path.relative(layout.projectRoot, updatedFilePath);
    console.log('[JSON格式化] 已更新:', formatProjectPathFromWorkspace(layout, relativePath));
  }

  for (const skippedFileReport of skippedFileReports) {
    const relativePath = path.relative(layout.projectRoot, skippedFileReport.filePath);
    console.log(
      '[JSON格式化] 已跳过:',
      formatProjectPathFromWorkspace(layout, relativePath),
      '原因:',
      skippedFileReport.reason
    );
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
 * 递归收集项目内 JSON 文件。
 * 默认跳过 import/native 编译产物与隐藏目录，保留人工维护和治理层 JSON 的可读性。
 * @param {string} directoryPath 当前目录
 * @param {Set<string>} filePathSet 文件集合
 */
function collectJsonFiles(directoryPath, filePathSet) {
  const directoryEntries = fs.readdirSync(directoryPath, { withFileTypes: true });

  for (const directoryEntry of directoryEntries) {
    const targetPath = path.join(directoryPath, directoryEntry.name);

    if (directoryEntry.isDirectory()) {
      if (shouldSkipDirectory(directoryEntry.name)) {
        continue;
      }
      collectJsonFiles(targetPath, filePathSet);
      continue;
    }

    if (!directoryEntry.isFile()) {
      continue;
    }

    if (shouldFormatJsonFile(targetPath)) {
      filePathSet.add(targetPath);
    }
  }
}

/**
 * 判断当前目录是否需要跳过扫描。
 * @param {string} directoryName 目录名
 * @returns {boolean}
 */
function shouldSkipDirectory(directoryName) {
  return directoryName === '.git'
    || directoryName === 'node_modules'
    || directoryName === 'wechat-ci-output'
    || directoryName === 'import'
    || directoryName === 'native';
}

/**
 * 判断当前 JSON 文件是否需要格式化。
 * @param {string} filePath 文件路径
 * @returns {boolean}
 */
function shouldFormatJsonFile(filePath) {
  return /\.json$/i.test(path.basename(filePath));
}

/**
 * 格式化单个 JSON 文件。
 * @param {string} filePath 文件路径
 * @returns {{updated: boolean, skippedReason: string}}
 */
function formatJsonFile(filePath) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  let parsedJson = null;
  try {
    parsedJson = JSON.parse(originalContent);
  } catch (error) {
    return {
      updated: false,
      skippedReason: '非标准 JSON（可能为 JSONC）'
    };
  }
  const formattedContent = JSON.stringify(parsedJson, null, 2) + '\n';

  if (originalContent === formattedContent) {
    return {
      updated: false,
      skippedReason: ''
    };
  }

  fs.writeFileSync(filePath, formattedContent);
  return {
    updated: true,
    skippedReason: ''
  };
}

formatProjectJsonFiles();
