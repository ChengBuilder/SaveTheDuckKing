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
const BUNDLE_CONFIG_PARENT_RELATIVE_PATH = 'subpackages';
const BUNDLE_CONFIG_FILE_PATTERN = /^config\..+\.json$/;

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

  const configCanonicalPathMatches = collectBundleConfigCanonicalPathMatches(layout);

  if (encodedPathMatches.length > 0 || configCanonicalPathMatches.length > 0) {
    console.error('[check-no-url-encoded-paths] 失败：发现 URL 编码路径段。');

    if (encodedPathMatches.length > 0) {
      console.error('[check-no-url-encoded-paths] 文件系统路径命中：');
      const preview = encodedPathMatches.slice(0, 30);
      for (let index = 0; index < preview.length; index += 1) {
        console.error('- ' + formatProjectPathFromWorkspace(layout, preview[index]));
      }
      if (encodedPathMatches.length > preview.length) {
        console.error('- ... 其余 ' + (encodedPathMatches.length - preview.length) + ' 条已省略');
      }
    }

    if (configCanonicalPathMatches.length > 0) {
      console.error('[check-no-url-encoded-paths] Bundle config canonical path 命中：');
      const preview = configCanonicalPathMatches.slice(0, 30);
      for (let index = 0; index < preview.length; index += 1) {
        const match = preview[index];
        console.error(
          '- ' +
          formatProjectPathFromWorkspace(layout, match.fileRelativePath) +
          ' paths[' +
          match.pathKey +
          ']: ' +
          match.canonicalPath
        );
      }
      if (configCanonicalPathMatches.length > preview.length) {
        console.error('- ... 其余 ' + (configCanonicalPathMatches.length - preview.length) + ' 条已省略');
      }
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
 * 扫描 `subpackages/<bundle>/config.*.json` 的 canonical path 条目。
 * 仅检查 paths[*][0]（canonical path）的路径段，避免误报其他普通 `%` 文本。
 * @param {{projectRoot: string}} layout 项目布局
 * @returns {{fileRelativePath: string, pathKey: string, canonicalPath: string}[]}
 */
function collectBundleConfigCanonicalPathMatches(layout) {
  const subpackagesAbsolutePath = resolveProjectFilePath(layout, BUNDLE_CONFIG_PARENT_RELATIVE_PATH);
  if (!fs.existsSync(subpackagesAbsolutePath)) {
    return [];
  }

  const matches = [];
  const bundleEntries = fs.readdirSync(subpackagesAbsolutePath, { withFileTypes: true });
  for (let index = 0; index < bundleEntries.length; index += 1) {
    const bundleEntry = bundleEntries[index];
    if (!bundleEntry.isDirectory()) {
      continue;
    }

    const bundleRelativePath = BUNDLE_CONFIG_PARENT_RELATIVE_PATH + '/' + bundleEntry.name;
    const bundleAbsolutePath = path.join(subpackagesAbsolutePath, bundleEntry.name);
    const files = fs.readdirSync(bundleAbsolutePath, { withFileTypes: true });

    for (let fileIndex = 0; fileIndex < files.length; fileIndex += 1) {
      const fileEntry = files[fileIndex];
      if (!fileEntry.isFile() || !BUNDLE_CONFIG_FILE_PATTERN.test(fileEntry.name)) {
        continue;
      }

      const fileRelativePath = bundleRelativePath + '/' + fileEntry.name;
      const fileAbsolutePath = path.join(bundleAbsolutePath, fileEntry.name);
      collectConfigCanonicalPathMatches(fileAbsolutePath, fileRelativePath, matches);
    }
  }

  return matches;
}

/**
 * 解析单个 bundle config 并检查 canonical path。
 * @param {string} fileAbsolutePath 文件绝对路径
 * @param {string} fileRelativePath 文件相对路径
 * @param {{fileRelativePath: string, pathKey: string, canonicalPath: string}[]} output 命中收集器
 */
function collectConfigCanonicalPathMatches(fileAbsolutePath, fileRelativePath, output) {
  const content = fs.readFileSync(fileAbsolutePath, 'utf8');
  const parsedJson = JSON.parse(content);
  const paths = parsedJson && parsedJson.paths;
  if (!paths || typeof paths !== 'object') {
    return;
  }

  for (const [pathKey, pathEntry] of Object.entries(paths)) {
    if (!Array.isArray(pathEntry) || typeof pathEntry[0] !== 'string') {
      continue;
    }

    const canonicalPath = pathEntry[0];
    if (!containsUrlEncodedCanonicalPath(canonicalPath)) {
      continue;
    }

    output.push({
      fileRelativePath: fileRelativePath,
      pathKey: String(pathKey),
      canonicalPath: canonicalPath
    });
  }
}

/**
 * 仅检查 canonical path 的路径段是否存在 URL 编码片段。
 * @param {string} canonicalPath canonical path 字符串
 * @returns {boolean}
 */
function containsUrlEncodedCanonicalPath(canonicalPath) {
  const segments = String(canonicalPath || '').split('/');
  for (let index = 0; index < segments.length; index += 1) {
    if (containsUrlEncodedSegment(segments[index])) {
      return true;
    }
  }
  return false;
}

/**
 * 判断单个路径段是否包含 URL 编码片段（`%` + 一到两位十六进制）。
 * @param {string} pathSegment 路径段
 * @returns {boolean}
 */
function containsUrlEncodedSegment(pathSegment) {
  return typeof pathSegment === 'string' && /%(?:[0-9A-Fa-f]{2}|[0-9A-Fa-f](?![0-9A-Fa-f]))/.test(pathSegment);
}

checkNoUrlEncodedPaths();
