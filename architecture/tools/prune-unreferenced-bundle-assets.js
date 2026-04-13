'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const SUBPACKAGES_DIR = path.join(PROJECT_ROOT, 'subpackages');
const BASE64_MAP = Object.fromEntries(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    .split('')
    .map((char, index) => [char, index])
);
const HEX_CHARS = '0123456789abcdef';

function main() {
  const args = parseArgs(process.argv.slice(2));
  const bundleName = args.bundle;
  const dryRun = args['dry-run'] !== 'false';

  if (!bundleName) {
    throw new Error('缺少 --bundle 参数，例如：--bundle main');
  }

  const bundleDir = path.join(SUBPACKAGES_DIR, bundleName);
  if (!isDirectory(bundleDir)) {
    throw new Error('未找到 bundle 目录: ' + relativeProjectPath(bundleDir));
  }

  const configPath = findConfigPath(bundleDir);
  if (!configPath) {
    throw new Error('未找到配置文件 config.*.json: ' + relativeProjectPath(bundleDir));
  }

  const config = readJson(configPath);
  const keepFiles = new Set();
  const unresolved = [];

  collectReferencedFiles(bundleDir, config, 'import', keepFiles, unresolved);
  collectReferencedFiles(bundleDir, config, 'native', keepFiles, unresolved);

  if (unresolved.length > 0) {
    console.error('[prune-unreferenced-bundle-assets] 引用文件缺失，已停止删除。');
    for (const item of unresolved.slice(0, 30)) {
      console.error('-', item);
    }
    if (unresolved.length > 30) {
      console.error('- ...共 ' + unresolved.length + ' 条');
    }
    process.exitCode = 1;
    return;
  }

  const candidateFiles = listFilesRecursively(path.join(bundleDir, 'import'))
    .concat(listFilesRecursively(path.join(bundleDir, 'native')));
  const removeFiles = [];
  let removeBytes = 0;

  for (const filePath of candidateFiles) {
    if (keepFiles.has(filePath)) {
      continue;
    }
    const stat = fs.statSync(filePath);
    removeFiles.push({
      path: filePath,
      size: stat.size,
    });
    removeBytes += stat.size;
  }

  removeFiles.sort((a, b) => b.size - a.size);

  if (!dryRun) {
    for (const file of removeFiles) {
      fs.unlinkSync(file.path);
    }
  }

  console.log('[prune-unreferenced-bundle-assets] summary');
  console.log(
    JSON.stringify(
      {
        bundle: bundleName,
        dryRun,
        config: relativeProjectPath(configPath),
        keepCount: keepFiles.size,
        scannedCount: candidateFiles.length,
        removeCount: removeFiles.length,
        removeBytes,
      },
      null,
      2
    )
  );

  console.log('[prune-unreferenced-bundle-assets] top removed files');
  for (const file of removeFiles.slice(0, 30)) {
    console.log('-', relativeProjectPath(file.path), formatBytes(file.size));
  }
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) {
      continue;
    }
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      result[key] = 'true';
      continue;
    }
    result[key] = next;
    index += 1;
  }
  return result;
}

function collectReferencedFiles(bundleDir, config, kind, keepFiles, unresolved) {
  const versions = ((config.versions || {})[kind] || []).slice();
  const uuids = config.uuids || [];

  for (let index = 0; index < versions.length; index += 2) {
    const id = versions[index];
    const version = versions[index + 1];
    const rawUuid = typeof id === 'number' ? uuids[id] : id;
    if (rawUuid == null) {
      continue;
    }
    const decodedUuid = decodeUuidLike(rawUuid);
    const shardPrefix = decodedUuid.slice(0, 2).toLowerCase();
    const shardDir = path.join(bundleDir, kind, shardPrefix);
    const filePrefix = decodedUuid + '.' + version + '.';

    const matched = findFilesByPrefix(shardDir, filePrefix);
    if (matched.length === 0) {
      unresolved.push(relativeProjectPath(path.join(shardDir, filePrefix + '*')));
      continue;
    }
    for (const filePath of matched) {
      keepFiles.add(filePath);
    }
  }
}

function findFilesByPrefix(directoryPath, filePrefix) {
  if (!isDirectory(directoryPath)) {
    return [];
  }
  const results = [];
  for (const entryName of fs.readdirSync(directoryPath)) {
    if (!entryName.startsWith(filePrefix)) {
      continue;
    }
    const entryPath = path.join(directoryPath, entryName);
    if (isFile(entryPath)) {
      results.push(entryPath);
    }
  }
  return results;
}

function findConfigPath(bundleDir) {
  const entries = fs.readdirSync(bundleDir).filter((name) => /^config\..+\.json$/.test(name));
  if (entries.length === 0) {
    return null;
  }
  return path.join(bundleDir, entries[0]);
}

function listFilesRecursively(directoryPath) {
  if (!isDirectory(directoryPath)) {
    return [];
  }
  const results = [];
  const stack = [directoryPath];
  while (stack.length > 0) {
    const currentPath = stack.pop();
    for (const entryName of fs.readdirSync(currentPath)) {
      const entryPath = path.join(currentPath, entryName);
      if (isDirectory(entryPath)) {
        stack.push(entryPath);
      } else if (isFile(entryPath)) {
        results.push(entryPath);
      }
    }
  }
  return results;
}

function decodeUuidLike(rawValue) {
  const raw = String(rawValue);
  const core = raw.split('@')[0];
  if (core.length !== 22) {
    return raw;
  }

  let hex = core[0] + core[1];
  for (let index = 2; index < 22; index += 2) {
    const a = BASE64_MAP[core[index]];
    const b = BASE64_MAP[core[index + 1]];
    if (a == null || b == null) {
      return raw;
    }
    hex += HEX_CHARS[a >> 2];
    hex += HEX_CHARS[((a & 3) << 2) | (b >> 4)];
    hex += HEX_CHARS[b & 15];
  }

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-') + raw.slice(core.length);
}

function formatBytes(value) {
  if (value < 1024) {
    return String(value) + 'B';
  }
  if (value < 1024 * 1024) {
    return (value / 1024).toFixed(1) + 'KB';
  }
  return (value / (1024 * 1024)).toFixed(2) + 'MB';
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function relativeProjectPath(targetPath) {
  return path.relative(PROJECT_ROOT, targetPath).replace(/\\/g, '/');
}

function isDirectory(targetPath) {
  return fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory();
}

function isFile(targetPath) {
  return fs.existsSync(targetPath) && fs.statSync(targetPath).isFile();
}

main();
