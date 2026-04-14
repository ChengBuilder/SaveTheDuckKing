'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const SUBPACKAGES_DIR = path.join(PROJECT_ROOT, 'subpackages');
const ROOT_BUNDLE_DIRS = [
  path.join(PROJECT_ROOT, 'assets', 'internal'),
  path.join(PROJECT_ROOT, 'assets', 'start-scene'),
];

function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');

  const targets = collectTargetDirs();
  const summary = {
    scanned: 0,
    removed: 0,
    skippedMissingShard: 0,
    skippedDifferentContent: 0,
  };

  for (const dir of targets) {
    pruneKind(dir, 'import', dryRun, summary);
    pruneKind(dir, 'native', dryRun, summary);
  }

  console.log('[prune-legacy-hash-layout] summary');
  console.log(JSON.stringify(summary, null, 2));
}

function collectTargetDirs() {
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

function pruneKind(bundleDir, kind, dryRun, summary) {
  const kindDir = path.join(bundleDir, kind);
  if (!isDirectory(kindDir)) {
    return;
  }

  for (const entryName of fs.readdirSync(kindDir)) {
    const legacyPath = path.join(kindDir, entryName);
    if (!isFile(legacyPath) || !isLegacyHashFile(entryName)) {
      continue;
    }

    summary.scanned += 1;
    const shardPath = path.join(kindDir, entryName.slice(0, 2).toLowerCase(), entryName);
    if (!isFile(shardPath)) {
      summary.skippedMissingShard += 1;
      continue;
    }

    if (!filesHaveSameContent(legacyPath, shardPath)) {
      summary.skippedDifferentContent += 1;
      continue;
    }

    if (!dryRun) {
      fs.unlinkSync(legacyPath);
    }
    summary.removed += 1;
  }
}

function filesHaveSameContent(fileA, fileB) {
  const a = fs.readFileSync(fileA);
  const b = fs.readFileSync(fileB);
  return a.equals(b);
}

function isLegacyHashFile(fileName) {
  return /^[0-9a-fA-F]{2}[^/]+\.[^/]+$/.test(fileName);
}

function isDirectory(directoryPath) {
  return fs.existsSync(directoryPath) && fs.statSync(directoryPath).isDirectory();
}

function isFile(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

main();
