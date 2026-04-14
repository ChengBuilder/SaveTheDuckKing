'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const SUBPACKAGES_DIR = path.join(PROJECT_ROOT, 'subpackages');
const ROOT_BUNDLE_DIRS = [
  path.join(PROJECT_ROOT, 'assets', 'internal'),
  path.join(PROJECT_ROOT, 'assets', 'start-scene'),
];

const BASE64_MAP = Object.fromEntries(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    .split('')
    .map((char, index) => [char, index])
);
const HEX_CHARS = '0123456789abcdef';

function main() {
  const args = new Set(process.argv.slice(2));
  const strictShard = args.has('--strict-shard');

  const bundleDirs = collectBundleDirs();
  const results = [];
  let totalMissingImport = 0;
  let totalMissingNative = 0;
  let totalLegacyTopLevel = 0;

  for (const bundleDir of bundleDirs) {
    const configPath = findConfigPath(bundleDir);
    if (!configPath) {
      continue;
    }

    const config = readJson(configPath);
    const bundleName = config.name || path.basename(bundleDir);
    const importStats = checkKind(bundleDir, config, 'import', strictShard);
    const nativeStats = checkKind(bundleDir, config, 'native', strictShard);
    const legacyTopLevel = countLegacyTopLevelHashedFiles(bundleDir);

    totalMissingImport += importStats.missing.length;
    totalMissingNative += nativeStats.missing.length;
    totalLegacyTopLevel += legacyTopLevel;

    results.push({
      bundleName,
      importTotal: importStats.total,
      importMissing: importStats.missing.length,
      nativeTotal: nativeStats.total,
      nativeMissing: nativeStats.missing.length,
      legacyTopLevel,
      importMissingSamples: importStats.missing.slice(0, 5),
      nativeMissingSamples: nativeStats.missing.slice(0, 5),
    });
  }

  console.log('[check-config-version-asset-integrity] summary');
  console.log(JSON.stringify(results, null, 2));
  console.log(
    JSON.stringify(
      {
        bundles: results.length,
        totalMissingImport,
        totalMissingNative,
        totalLegacyTopLevel,
        strictShard,
      },
      null,
      2
    )
  );

  if (totalMissingImport > 0 || totalMissingNative > 0) {
    process.exitCode = 1;
  }
}

function collectBundleDirs() {
  const dirs = [];
  for (const rootDir of ROOT_BUNDLE_DIRS) {
    if (isDirectory(rootDir)) {
      dirs.push(rootDir);
    }
  }
  if (isDirectory(SUBPACKAGES_DIR)) {
    for (const bundleName of fs.readdirSync(SUBPACKAGES_DIR)) {
      const bundleDir = path.join(SUBPACKAGES_DIR, bundleName);
      if (isDirectory(bundleDir)) {
        dirs.push(bundleDir);
      }
    }
  }
  return dirs;
}

function findConfigPath(bundleDir) {
  const entries = fs.readdirSync(bundleDir).filter((name) => /^config\..+\.json$/.test(name));
  if (entries.length === 0) {
    return null;
  }
  return path.join(bundleDir, entries[0]);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function checkKind(bundleDir, config, kind, strictShard) {
  const versions = ((config.versions || {})[kind] || []).slice();
  const uuids = config.uuids || [];
  const missing = [];

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
    const legacyDir = path.join(bundleDir, kind);
    const entryPrefix = `${decodedUuid}.${version}.`;

    const shardHit = findFileByPrefix(shardDir, entryPrefix);
    const legacyHit = strictShard ? null : findFileByPrefix(legacyDir, entryPrefix);
    if (!shardHit && !legacyHit) {
      const expectedPath = kind === 'import'
        ? path.join(shardDir, `${decodedUuid}.${version}.json`)
        : path.join(shardDir, `${entryPrefix}*`);
      missing.push(relativeProjectPath(expectedPath));
    }
  }

  return {
    total: Math.floor(versions.length / 2),
    missing,
  };
}

function findFileByPrefix(directoryPath, filePrefix) {
  if (!isDirectory(directoryPath)) {
    return null;
  }
  for (const entryName of fs.readdirSync(directoryPath)) {
    const entryPath = path.join(directoryPath, entryName);
    if (!isFile(entryPath)) {
      continue;
    }
    if (entryName.startsWith(filePrefix)) {
      return entryPath;
    }
  }
  return null;
}

function countLegacyTopLevelHashedFiles(bundleDir) {
  let count = 0;
  for (const kind of ['import', 'native']) {
    const kindDir = path.join(bundleDir, kind);
    if (!isDirectory(kindDir)) {
      continue;
    }
    for (const entryName of fs.readdirSync(kindDir)) {
      const entryPath = path.join(kindDir, entryName);
      if (isFile(entryPath) && /^[0-9a-fA-F]{2}[^/]+\.[^/]+$/.test(entryName)) {
        count += 1;
      }
    }
  }
  return count;
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
