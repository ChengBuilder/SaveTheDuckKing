'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const SUBPACKAGES_DIR = path.join(PROJECT_ROOT, 'subpackages');
const SEMANTIC_ALIAS_DIR = path.join(
  PROJECT_ROOT,
  'architecture',
  'generated',
  'subpackage-semantic-aliases'
);
const ROOT_BUNDLE_DIRS = [
  path.join(PROJECT_ROOT, 'assets', 'internal'),
  path.join(PROJECT_ROOT, 'assets', 'start-scene'),
];

function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');
  const forceCopy = args.has('--copy');

  if (!fs.existsSync(SEMANTIC_ALIAS_DIR)) {
    throw new Error('缺少语义清单目录: ' + SEMANTIC_ALIAS_DIR);
  }

  const aliasFiles = fs.readdirSync(SEMANTIC_ALIAS_DIR)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort();

  const totals = {
    manifests: 0,
    aliases: 0,
    exists: 0,
    linked: 0,
    copied: 0,
    missingSource: 0,
    skipped: 0,
    shardExists: 0,
    shardLinked: 0,
    shardCopied: 0,
  };
  const missingSourceEntries = [];

  for (const aliasFileName of aliasFiles) {
    const aliasManifestPath = path.join(SEMANTIC_ALIAS_DIR, aliasFileName);
    const aliasManifest = readJson(aliasManifestPath);
    const bundleName = String(aliasManifest.bundleName || aliasFileName.replace(/\.json$/, ''));
    const bundleDir = path.join(SUBPACKAGES_DIR, bundleName);
    const aliasEntries = []
      .concat(aliasManifest.importAliases || [])
      .concat(aliasManifest.nativeAliases || []);

    totals.manifests += 1;
    totals.aliases += aliasEntries.length;

    for (const aliasEntry of aliasEntries) {
      if (!aliasEntry || typeof aliasEntry !== 'object') {
        totals.skipped += 1;
        continue;
      }

      const originalRelativePath = normalizePosixPath(aliasEntry.originalRelativePath || '');
      const materializedRelativePath = normalizePosixPath(aliasEntry.materializedRelativePath || '');
      if (originalRelativePath.length === 0 || materializedRelativePath.length === 0) {
        totals.skipped += 1;
        continue;
      }

      const sourcePath = path.join(bundleDir, materializedRelativePath);
      const targetPath = path.join(bundleDir, originalRelativePath);

      if (fs.existsSync(targetPath)) {
        totals.exists += 1;
        continue;
      }

      if (!fs.existsSync(sourcePath)) {
        totals.missingSource += 1;
        if (missingSourceEntries.length < 50) {
          missingSourceEntries.push({
            bundleName,
            sourcePath,
            targetPath,
          });
        }
        continue;
      }

      ensureDirectory(path.dirname(targetPath), dryRun);

      if (dryRun) {
        totals.linked += 1;
        continue;
      }

      if (!forceCopy && linkFileSafely(sourcePath, targetPath)) {
        totals.linked += 1;
        continue;
      }

      fs.copyFileSync(sourcePath, targetPath);
      totals.copied += 1;
    }
  }

  console.log('[backfill-original-asset-layout] summary');
  console.log(JSON.stringify(totals, null, 2));

  if (missingSourceEntries.length > 0) {
    console.log('[backfill-original-asset-layout] missing source samples');
    for (const entry of missingSourceEntries) {
      console.log('- ' + entry.bundleName + ': ' + entry.sourcePath + ' -> ' + entry.targetPath);
    }
  }

  materializeShardMirrors({
    dryRun,
    forceCopy,
    totals,
  });

  console.log('[backfill-original-asset-layout] shard summary');
  console.log(JSON.stringify({
    shardExists: totals.shardExists,
    shardLinked: totals.shardLinked,
    shardCopied: totals.shardCopied,
  }, null, 2));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDirectory(directoryPath, dryRun) {
  if (dryRun) {
    return;
  }
  fs.mkdirSync(directoryPath, { recursive: true });
}

function linkFileSafely(sourcePath, targetPath) {
  try {
    fs.linkSync(sourcePath, targetPath);
    return true;
  } catch (error) {
    if (
      error &&
      (error.code === 'EXDEV' ||
        error.code === 'EPERM' ||
        error.code === 'EACCES' ||
        error.code === 'EMLINK')
    ) {
      return false;
    }
    throw error;
  }
}

function normalizePosixPath(relativePath) {
  return String(relativePath || '').replace(/\\/g, '/').replace(/^\/+/, '');
}

function materializeShardMirrors(options) {
  const bundleDirs = []
    .concat(ROOT_BUNDLE_DIRS)
    .concat(
      fs.readdirSync(SUBPACKAGES_DIR)
        .map((bundleName) => path.join(SUBPACKAGES_DIR, bundleName))
        .filter((bundleDir) => fs.existsSync(bundleDir) && fs.statSync(bundleDir).isDirectory())
    );

  for (const bundleDir of bundleDirs) {
    materializeShardMirrorForKind(bundleDir, 'import', options);
    materializeShardMirrorForKind(bundleDir, 'native', options);
  }
}

function materializeShardMirrorForKind(bundleDir, kind, options) {
  const kindDir = path.join(bundleDir, kind);
  if (!fs.existsSync(kindDir) || !fs.statSync(kindDir).isDirectory()) {
    return;
  }

  const topLevelEntries = fs.readdirSync(kindDir);
  for (const entryName of topLevelEntries) {
    const sourcePath = path.join(kindDir, entryName);
    if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
      continue;
    }
    if (!shouldShardFileName(entryName)) {
      continue;
    }

    const shardDirName = entryName.slice(0, 2).toLowerCase();
    const shardDirPath = path.join(kindDir, shardDirName);
    const shardPath = path.join(shardDirPath, entryName);

    if (fs.existsSync(shardPath)) {
      options.totals.shardExists += 1;
      continue;
    }

    ensureDirectory(shardDirPath, options.dryRun);
    if (options.dryRun) {
      options.totals.shardLinked += 1;
      continue;
    }

    if (!options.forceCopy && linkFileSafely(sourcePath, shardPath)) {
      options.totals.shardLinked += 1;
      continue;
    }

    fs.copyFileSync(sourcePath, shardPath);
    options.totals.shardCopied += 1;
  }
}

function shouldShardFileName(fileName) {
  const normalizedName = String(fileName || '');
  if (normalizedName.length < 4) {
    return false;
  }
  return /^[0-9a-fA-F]{2}/.test(normalizedName);
}

main();
