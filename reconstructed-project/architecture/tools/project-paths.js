'use strict';

const fs = require('fs');
const path = require('path');

/**
 * 解析项目布局。
 * 支持“项目就在仓库根目录”与“项目位于仓库子目录”两种形态。
 * @param {string} scriptDirectoryPath 当前脚本目录
 * @returns {{projectRoot: string, workspaceRoot: string, projectPathFromWorkspace: string}}
 */
function resolveProjectLayout(scriptDirectoryPath) {
  const projectRoot = path.resolve(scriptDirectoryPath, '..', '..');
  const workspaceRoot = findWorkspaceRoot(projectRoot);
  const relativeProjectPath = normalizePath(path.relative(workspaceRoot, projectRoot));

  return {
    projectRoot: projectRoot,
    workspaceRoot: workspaceRoot,
    projectPathFromWorkspace: relativeProjectPath
  };
}

/**
 * 向上查找 git 工作区根目录。
 * 若未找到，则退回当前项目根目录。
 * @param {string} startDirectoryPath 起始目录
 * @returns {string}
 */
function findWorkspaceRoot(startDirectoryPath) {
  let currentDirectoryPath = path.resolve(startDirectoryPath);

  while (true) {
    if (fs.existsSync(path.join(currentDirectoryPath, '.git'))) {
      return currentDirectoryPath;
    }

    const parentDirectoryPath = path.dirname(currentDirectoryPath);
    if (parentDirectoryPath === currentDirectoryPath) {
      return startDirectoryPath;
    }

    currentDirectoryPath = parentDirectoryPath;
  }
}

/**
 * 解析项目内文件的绝对路径。
 * @param {{projectRoot: string}} layout 项目布局
 * @param {string} relativeProjectPath 项目内相对路径
 * @returns {string}
 */
function resolveProjectFilePath(layout, relativeProjectPath) {
  return path.join(layout.projectRoot, relativeProjectPath);
}

/**
 * 将项目内路径转换为“相对工作区”的展示路径。
 * @param {{projectPathFromWorkspace: string}} layout 项目布局
 * @param {string} relativeProjectPath 项目内相对路径
 * @returns {string}
 */
function formatProjectPathFromWorkspace(layout, relativeProjectPath) {
  const normalizedRelativePath = normalizePath(relativeProjectPath || '');

  if (layout.projectPathFromWorkspace.length === 0) {
    return normalizedRelativePath.length > 0 ? normalizedRelativePath : './';
  }

  if (normalizedRelativePath.length === 0) {
    return ensureTrailingSlash(layout.projectPathFromWorkspace);
  }

  return layout.projectPathFromWorkspace + '/' + normalizedRelativePath;
}

/**
 * 生成展示用的 node 命令文本。
 * @param {string[]} args node 参数
 * @returns {string}
 */
function formatNodeCommand(args) {
  return ['node'].concat(args).join(' ');
}

/**
 * 规范化路径分隔符。
 * @param {string} targetPath 原始路径
 * @returns {string}
 */
function normalizePath(targetPath) {
  return String(targetPath || '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '');
}

/**
 * 为目录路径补充尾部斜杠。
 * @param {string} targetPath 目录路径
 * @returns {string}
 */
function ensureTrailingSlash(targetPath) {
  return targetPath.endsWith('/') ? targetPath : targetPath + '/';
}

const projectPathsApi = {
  resolveProjectLayout: resolveProjectLayout,
  resolveProjectFilePath: resolveProjectFilePath,
  formatProjectPathFromWorkspace: formatProjectPathFromWorkspace,
  formatNodeCommand: formatNodeCommand,
  normalizePath: normalizePath
};

module.exports = projectPathsApi;
module.exports.default = projectPathsApi;
