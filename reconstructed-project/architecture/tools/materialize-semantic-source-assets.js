'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_MANIFEST = path.join(PROJECT_ROOT, 'architecture', 'migration', 'creator-source-assets.manifest.json');
const DEFAULT_REPORT = path.join(PROJECT_ROOT, 'architecture', 'reports', 'creator-source-assets-report.json');

const BASE64_MAP = Object.fromEntries(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    .split('')
    .map((char, index) => [char, index])
);
const HEX_CHARS = '0123456789abcdef';

function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = isTruthy(args['dry-run']);
  const clean = isTruthy(args.clean);
  const manifestPath = resolveProjectPath(args.manifest, DEFAULT_MANIFEST);
  const reportPath = resolveProjectPath(args.report, DEFAULT_REPORT);

  if (!isFile(manifestPath)) {
    throw new Error('manifest 不存在: ' + relativeProjectPath(manifestPath));
  }

  const manifest = readJson(manifestPath);
  const bundleRegistry = loadBundleRegistry(manifest.bundles || {});
  const result = materializeAssets(manifest.assets || [], bundleRegistry, {
    dryRun: dryRun,
    clean: clean
  });

  if (!dryRun) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(result, null, 2) + '\n', 'utf8');
  }

  printSummary(result, {
    dryRun: dryRun,
    clean: clean,
    manifestPath: manifestPath,
    reportPath: reportPath
  });

  if (result.failed.length > 0) {
    process.exitCode = 1;
  }
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      result[key] = true;
      continue;
    }
    result[key] = next;
    index += 1;
  }
  return result;
}

function isTruthy(value) {
  return value === true || value === 'true' || value === '1';
}

function resolveProjectPath(inputPath, fallbackPath) {
  if (!inputPath) {
    return fallbackPath;
  }
  return path.resolve(PROJECT_ROOT, String(inputPath));
}

function loadBundleRegistry(bundleDefinitions) {
  const registry = {};
  for (const [bundleName, definition] of Object.entries(bundleDefinitions)) {
    const bundleDir = resolveProjectPath(definition.dir, path.join(PROJECT_ROOT, definition.dir || ''));
    const configPath = findBundleConfigPath(bundleDir);
    registry[bundleName] = {
      bundleName: bundleName,
      bundleDir: bundleDir,
      configPath: configPath,
      config: readJson(configPath)
    };
  }
  return registry;
}

function materializeAssets(assets, bundleRegistry, options) {
  const exported = [];
  const skipped = [];
  const failed = [];

  for (const item of assets) {
    try {
      const bundle = bundleRegistry[item.bundle];
      if (!bundle) {
        throw new Error('未知 bundle: ' + item.bundle);
      }

      const assetRecord = resolveBundleAsset(bundle, item.assetPath);
      const materialized = materializeAsset(item, bundle, assetRecord, options);
      if (materialized.status === 'exported') {
        exported.push(materialized);
      } else {
        skipped.push(materialized);
      }
    } catch (error) {
      failed.push({
        bundle: item.bundle,
        kind: item.kind,
        assetPath: item.assetPath,
        target: item.target,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    exported: exported,
    skipped: skipped,
    failed: failed
  };
}

function resolveBundleAsset(bundle, assetPath) {
  const paths = bundle.config.paths || {};
  for (const [sourceIndexText, pathInfo] of Object.entries(paths)) {
    if (!Array.isArray(pathInfo) || pathInfo[0] !== assetPath) {
      continue;
    }
    const sourceIndex = Number(sourceIndexText);
    const rawUuid = bundle.config.uuids[sourceIndex];
    const decodedUuid = decodeUuidLike(rawUuid);
    return {
      sourceIndex: sourceIndex,
      assetPath: assetPath,
      rawUuid: rawUuid,
      decodedUuid: decodedUuid,
      importArtifact: resolveImportArtifact(bundle, sourceIndex, decodedUuid),
      nativeArtifact: resolveNativeArtifact(bundle, sourceIndex, decodedUuid)
    };
  }
  throw new Error('bundle 中未找到资源路径: ' + bundle.bundleName + ' -> ' + assetPath);
}

function materializeAsset(item, bundle, assetRecord, options) {
  const targetPath = resolveProjectPath(item.target, path.join(PROJECT_ROOT, item.target || ''));
  if (options.clean && !options.dryRun && fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }

  if (item.kind === 'audioClip' || item.kind === 'imageAsset') {
    if (!assetRecord.nativeArtifact || assetRecord.nativeArtifact.mode !== 'direct') {
      throw new Error(item.kind + ' 缺少可复制的 native 文件: ' + item.assetPath);
    }
    copyFile(assetRecord.nativeArtifact.filePath, targetPath, options.dryRun);
    return {
      status: 'exported',
      bundle: bundle.bundleName,
      kind: item.kind,
      assetPath: item.assetPath,
      target: relativeProjectPath(targetPath),
      source: relativeProjectPath(assetRecord.nativeArtifact.filePath)
    };
  }

  if (item.kind === 'prefab') {
    if (!assetRecord.importArtifact) {
      throw new Error('prefab 缺少 import 文件: ' + item.assetPath);
    }

    return {
      status: 'skipped',
      bundle: bundle.bundleName,
      kind: item.kind,
      assetPath: item.assetPath,
      target: relativeProjectPath(targetPath),
      reason: 'legacy-prefab-requires-semantic-rebuild',
      source: relativeProjectPath(assetRecord.importArtifact.filePath)
    };
  }

  throw new Error('暂不支持的资源类型: ' + item.kind);
}

function resolveImportArtifact(bundle, sourceIndex, decodedUuid) {
  const importDir = path.join(bundle.bundleDir, 'import');
  const directVersion = findVersionForIndex(bundle.config.versions && bundle.config.versions.import, sourceIndex);

  if (directVersion) {
    const directFilePath = findArtifactFile(importDir, decodedUuid, directVersion);
    if (!directFilePath) {
      throw new Error('未找到 import 文件: ' + bundle.bundleName + ' -> ' + decodedUuid + '.' + directVersion);
    }
    return {
      mode: 'direct',
      filePath: directFilePath
    };
  }

  const packInfo = findPackContainingIndex(bundle.config.packs || {}, sourceIndex);
  if (!packInfo) {
    return null;
  }

  const packDir = path.join(importDir, packInfo.packId.slice(0, 2).toLowerCase());
  const packFilePath = findFileByPrefix(packDir, packInfo.packId + '.');
  if (!packFilePath) {
    throw new Error('未找到 pack 文件: ' + bundle.bundleName + ' -> ' + packInfo.packId);
  }

  return {
    mode: 'pack',
    packId: packInfo.packId,
    filePath: packFilePath,
    packPosition: packInfo.packPosition
  };
}

function resolveNativeArtifact(bundle, sourceIndex, decodedUuid) {
  const nativeDir = path.join(bundle.bundleDir, 'native');
  const nativeVersion = findVersionForIndex(bundle.config.versions && bundle.config.versions.native, sourceIndex);

  if (!nativeVersion) {
    return null;
  }

  const nativeFilePath = findArtifactFile(nativeDir, decodedUuid, nativeVersion);
  if (!nativeFilePath) {
    throw new Error('未找到 native 文件: ' + bundle.bundleName + ' -> ' + decodedUuid + '.' + nativeVersion);
  }

  return {
    mode: 'direct',
    filePath: nativeFilePath
  };
}

function findVersionForIndex(versionPairs, sourceIndex) {
  if (!Array.isArray(versionPairs)) {
    return null;
  }
  for (let index = 0; index < versionPairs.length; index += 2) {
    if (versionPairs[index] === sourceIndex) {
      return versionPairs[index + 1];
    }
  }
  return null;
}

function findPackContainingIndex(packs, sourceIndex) {
  for (const [packId, sourceIndexes] of Object.entries(packs || {})) {
    if (!Array.isArray(sourceIndexes)) {
      continue;
    }
    const packPosition = sourceIndexes.indexOf(sourceIndex);
    if (packPosition >= 0) {
      return {
        packId: packId,
        packPosition: packPosition
      };
    }
  }
  return null;
}

function findArtifactFile(baseDir, decodedUuid, version) {
  const shardDir = path.join(baseDir, decodedUuid.slice(0, 2).toLowerCase());
  return findFileByPrefix(shardDir, decodedUuid + '.' + version + '.');
}

function findFileByPrefix(directoryPath, filePrefix) {
  if (!isDirectory(directoryPath)) {
    return null;
  }
  const entries = fs.readdirSync(directoryPath).sort();
  for (const entryName of entries) {
    if (entryName.startsWith(filePrefix)) {
      return path.join(directoryPath, entryName);
    }
  }
  return null;
}

function findBundleConfigPath(bundleDir) {
  if (!isDirectory(bundleDir)) {
    throw new Error('bundle 目录不存在: ' + relativeProjectPath(bundleDir));
  }
  const configName = fs.readdirSync(bundleDir).find((entryName) => /^config\..+\.json$/.test(entryName));
  if (!configName) {
    throw new Error('bundle 缺少 config.*.json: ' + relativeProjectPath(bundleDir));
  }
  return path.join(bundleDir, configName);
}

function decodeUuidLike(rawValue) {
  const raw = String(rawValue || '');
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
    hex.slice(20)
  ].join('-') + raw.slice(core.length);
}

function copyFile(sourcePath, targetPath, dryRun) {
  if (dryRun) {
    return;
  }
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
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

function printSummary(result, options) {
  console.log('[materialize-semantic-source-assets] summary');
  console.log(
    JSON.stringify(
      {
        dryRun: options.dryRun,
        clean: options.clean,
        manifest: relativeProjectPath(options.manifestPath),
        report: relativeProjectPath(options.reportPath),
        exportedCount: result.exported.length,
        skippedCount: result.skipped.length,
        failedCount: result.failed.length
      },
      null,
      2
    )
  );

  if (result.exported.length > 0) {
    console.log('[materialize-semantic-source-assets] exported');
    for (const item of result.exported) {
      console.log('- ' + item.assetPath + ' -> ' + item.target);
    }
  }

  if (result.skipped.length > 0) {
    console.log('[materialize-semantic-source-assets] skipped');
    for (const item of result.skipped) {
      console.log('- ' + item.assetPath + ' | reason: ' + item.reason + ' | source: ' + item.source);
    }
  }

  if (result.failed.length > 0) {
    console.log('[materialize-semantic-source-assets] failed');
    for (const item of result.failed) {
      console.log('- ' + item.assetPath + ' | error: ' + item.error);
    }
  }
}

main();
