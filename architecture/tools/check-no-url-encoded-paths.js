'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const TARGET_PATHS = Object.freeze([
  'assets',
  'subpackages'
]);

/**
 * 校验资源目录中不存在 URL 编码风格的路径段（如 `%E7%89%88`）。
 * 目标：防止解包残留乱码路径再次进入主干并导致运行时读文件失败。
 */
function checkNoUrlEncodedPaths() {
  const layout = resolveProjectLayout(__dirname);
  const encodedPathMatches = [];

  for (let index = 0; index < TARGET_PATHS.length; index += 1) {
    const relativeRoot = TARGET_PATHS[index];
    const absoluteRoot = resolveProjectFilePath(layout, relativeRoot);
    if (!fs.existsSync(absoluteRoot)) {
      continue;
    }
    collectUrlEncodedPathMatches(absoluteRoot, relativeRoot, encodedPathMatches);
  }

  if (encodedPathMatches.length > 0) {
    console.error('[check-no-url-encoded-paths] 失败：发现 URL 编码路径段。');
    const preview = encodedPathMatches.slice(0, 30);
    for (let index = 0; index < preview.length; index += 1) {
      console.error('- ' + formatProjectPathFromWorkspace(layout, preview[index]));
    }
    if (encodedPathMatches.length > preview.length) {
      console.error('- ... 其余 ' + (encodedPathMatches.length - preview.length) + ' 条已省略');
    }
    process.exitCode = 1;
    return;
  }

  console.log('[check-no-url-encoded-paths] 通过');
}

/**
 * 递归收集 URL 编码路径段命中。
 * @param {string} absoluteDir 绝对目录路径
 * @param {string} relativeDir 相对项目目录路径
 * @param {string[]} output 命中收集器
 */
function collectUrlEncodedPathMatches(absoluteDir, relativeDir, output) {
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const entryRelativePath = relativeDir + '/' + entry.name;
    if (containsUrlEncodedSegment(entry.name)) {
      output.push(entryRelativePath);
    }

    if (!entry.isDirectory()) {
      continue;
    }

    collectUrlEncodedPathMatches(
      path.join(absoluteDir, entry.name),
      entryRelativePath,
      output
    );
  }
}

/**
 * 判断单个路径段是否包含 URL 编码片段（`%` + 两位十六进制）。
 * @param {string} pathSegment 路径段
 * @returns {boolean}
 */
function containsUrlEncodedSegment(pathSegment) {
  return typeof pathSegment === 'string' && /%[0-9A-Fa-f]{2}/.test(pathSegment);
}

checkNoUrlEncodedPaths();
