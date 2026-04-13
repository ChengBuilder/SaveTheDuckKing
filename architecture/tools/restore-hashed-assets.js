'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_OUTPUT_RELATIVE = 'restored-assets';
const HASHED_FILE_PATTERN = /^[0-9a-fA-F-@]+\.[0-9a-fA-F]+\.[^.]+$/;

const BASE64_MAP = Object.fromEntries(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    .split('')
    .map(function mapChar(char, index) {
      return [char, index];
    })
);
const HEX_CHARS = '0123456789abcdef';

function main() {
  const args = parseArgs(process.argv.slice(2));
  const mode = args.mode === 'move' ? 'move' : 'copy';
  const dryRun = args['dry-run'] === 'true' || args['dry-run'] === true;
  const cleanOutput = args.clean === 'true' || args.clean === true;
  const outputRelativePath = String(args.output || DEFAULT_OUTPUT_RELATIVE).trim();
  const outputAbsolutePath = path.resolve(PROJECT_ROOT, outputRelativePath);

  const mappingFilePath = resolveMappingInput(args);
  const externalUuidPathMap = mappingFilePath ? loadUuidPathMapFromFile(mappingFilePath) : new Map();
  const bundleConfigs = collectBundleConfigs();
  if (bundleConfigs.length === 0) {
    throw new Error('未找到任何 bundle 配置文件（config.*.json）');
  }

  const restorePlan = buildRestorePlan(bundleConfigs, externalUuidPathMap);
  const executionPlan = resolveExecutionPlan(restorePlan, outputAbsolutePath);

  if (cleanOutput && !dryRun && fs.existsSync(outputAbsolutePath)) {
    fs.rmSync(outputAbsolutePath, { recursive: true, force: true });
  }

  const summary = executePlan(executionPlan, {
    mode: mode,
    dryRun: dryRun
  });

  printSummary(summary, {
    mode: mode,
    dryRun: dryRun,
    outputRelativePath: path.relative(PROJECT_ROOT, outputAbsolutePath).replace(/\\/g, '/'),
    mappingFilePath: mappingFilePath
  });
}

function resolveMappingInput(args) {
  const explicitPath = args.mapping || args.settings;
  if (explicitPath) {
    return resolveOptionalPath(explicitPath);
  }
  const rootSettingsPath = path.join(PROJECT_ROOT, 'settings.json');
  if (isFile(rootSettingsPath)) {
    return rootSettingsPath;
  }
  return null;
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

function resolveOptionalPath(inputPath) {
  if (!inputPath) {
    return null;
  }
  const absolutePath = path.resolve(PROJECT_ROOT, String(inputPath));
  if (!isFile(absolutePath)) {
    throw new Error('映射文件不存在: ' + relativeProjectPath(absolutePath));
  }
  return absolutePath;
}

function collectBundleConfigs() {
  const candidateRoots = [
    path.join(PROJECT_ROOT, 'assets'),
    path.join(PROJECT_ROOT, 'subpackages')
  ];
  const configPaths = [];

  for (const rootPath of candidateRoots) {
    if (!isDirectory(rootPath)) {
      continue;
    }
    const stack = [rootPath];
    while (stack.length > 0) {
      const currentPath = stack.pop();
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        const entryPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
          stack.push(entryPath);
          continue;
        }
        if (!entry.isFile()) {
          continue;
        }
        if (/^config\..+\.json$/i.test(entry.name) || entry.name === 'config.json') {
          configPaths.push(entryPath);
        }
      }
    }
  }

  configPaths.sort(function sortPaths(leftPath, rightPath) {
    return leftPath.localeCompare(rightPath);
  });

  const configs = [];
  for (const configPath of configPaths) {
    const configJson = readJson(configPath);
    if (!configJson || typeof configJson !== 'object') {
      continue;
    }
    const bundleRoot = path.dirname(configPath);
    configs.push({
      configPath: configPath,
      bundleRoot: bundleRoot,
      bundleName: String(configJson.name || path.basename(bundleRoot)),
      configJson: configJson,
      sourceScore: scoreBundleSource(bundleRoot, configJson)
    });
  }

  const selectedByBundle = new Map();
  for (const candidate of configs) {
    const key = candidate.bundleName;
    if (!selectedByBundle.has(key)) {
      selectedByBundle.set(key, candidate);
      continue;
    }
    const current = selectedByBundle.get(key);
    if (isBetterBundleCandidate(candidate, current)) {
      selectedByBundle.set(key, candidate);
    }
  }

  return Array.from(selectedByBundle.values()).sort(function sortBundle(leftBundle, rightBundle) {
    return leftBundle.bundleRoot.localeCompare(rightBundle.bundleRoot);
  });
}

function scoreBundleSource(bundleRoot, configJson) {
  let score = 0;
  for (const kind of ['import', 'native']) {
    const kindBase = resolveKindBase(configJson, kind);
    const kindPath = path.join(bundleRoot, kindBase);
    if (!isDirectory(kindPath)) {
      continue;
    }
    score += 10;
    const entries = fs.readdirSync(kindPath, { withFileTypes: true });
    const shardDirs = entries.filter(function (entry) {
      return entry.isDirectory() && /^[0-9a-f]{2}$/i.test(entry.name);
    });
    score += shardDirs.length;
    for (const shardDir of shardDirs.slice(0, 20)) {
      const shardPath = path.join(kindPath, shardDir.name);
      const shardFiles = fs.readdirSync(shardPath).filter(function (entryName) {
        return HASHED_FILE_PATTERN.test(entryName);
      });
      score += Math.min(shardFiles.length, 10);
    }
  }
  return score;
}

function isBetterBundleCandidate(leftCandidate, rightCandidate) {
  if (leftCandidate.sourceScore !== rightCandidate.sourceScore) {
    return leftCandidate.sourceScore > rightCandidate.sourceScore;
  }
  const leftIsPlainConfig = path.basename(leftCandidate.configPath) === 'config.json';
  const rightIsPlainConfig = path.basename(rightCandidate.configPath) === 'config.json';
  if (leftIsPlainConfig !== rightIsPlainConfig) {
    return leftIsPlainConfig;
  }
  return leftCandidate.configPath.localeCompare(rightCandidate.configPath) < 0;
}

function loadUuidPathMapFromFile(filePath) {
  const jsonData = readJson(filePath);
  if (!jsonData || typeof jsonData !== 'object') {
    throw new Error('映射文件格式非法: ' + relativeProjectPath(filePath));
  }

  const uuidPathMap = new Map();
  mergeUuidPathMap(uuidPathMap, extractUuidPathMap(jsonData));

  if (uuidPathMap.size === 0) {
    throw new Error(
      '映射文件中未解析到 UUID->路径映射，请确认包含 uuidToPath / mappings / paths + uuids 结构: ' +
      relativeProjectPath(filePath)
    );
  }
  return uuidPathMap;
}

function extractUuidPathMap(jsonData) {
  const uuidPathMap = new Map();

  if (Array.isArray(jsonData)) {
    for (const item of jsonData) {
      if (!item || typeof item !== 'object') {
        continue;
      }
      const uuidValue = String(item.uuid || item.hash || '').trim();
      const pathValue = String(item.path || item.assetPath || '').trim();
      if (uuidValue.length === 0 || pathValue.length === 0) {
        continue;
      }
      uuidPathMap.set(normalizeUuid(uuidValue), normalizeDbPath(pathValue));
    }
    return uuidPathMap;
  }

  if (jsonData.uuidToPath && typeof jsonData.uuidToPath === 'object') {
    mergeUuidPathMap(uuidPathMap, parseObjectMap(jsonData.uuidToPath));
  }
  if (jsonData.mappings && typeof jsonData.mappings === 'object') {
    mergeUuidPathMap(uuidPathMap, parseObjectMap(jsonData.mappings));
  }
  if (jsonData.paths && jsonData.uuids) {
    mergeUuidPathMap(uuidPathMap, parseBundleStylePathMap(jsonData));
  }
  if (jsonData.rawAssets && jsonData.uuids) {
    mergeUuidPathMap(uuidPathMap, parseRawAssetsPathMap(jsonData));
  }

  return uuidPathMap;
}

function parseObjectMap(objectMap) {
  const uuidPathMap = new Map();
  for (const [uuidKey, targetPath] of Object.entries(objectMap)) {
    if (typeof targetPath !== 'string') {
      continue;
    }
    uuidPathMap.set(normalizeUuid(uuidKey), normalizeDbPath(targetPath));
  }
  return uuidPathMap;
}

function parseBundleStylePathMap(bundleConfigJson) {
  const uuidPathMap = new Map();
  const uuids = Array.isArray(bundleConfigJson.uuids) ? bundleConfigJson.uuids : [];
  const pathsMap = bundleConfigJson.paths && typeof bundleConfigJson.paths === 'object'
    ? bundleConfigJson.paths
    : {};

  for (const [pathId, pathValue] of Object.entries(pathsMap)) {
    if (!Array.isArray(pathValue) || typeof pathValue[0] !== 'string') {
      continue;
    }
    const rawPath = pathValue[0];
    let rawUuid = null;
    if (/^\d+$/.test(pathId)) {
      const uuidIndex = Number(pathId);
      rawUuid = uuids[uuidIndex] || null;
    } else {
      rawUuid = pathId;
    }
    if (!rawUuid) {
      continue;
    }
    uuidPathMap.set(normalizeUuid(rawUuid), normalizeDbPath(rawPath));
  }
  return uuidPathMap;
}

function parseRawAssetsPathMap(settingsJson) {
  const uuidPathMap = new Map();
  const uuids = Array.isArray(settingsJson.uuids) ? settingsJson.uuids : [];
  const rawAssets = settingsJson.rawAssets && typeof settingsJson.rawAssets === 'object'
    ? settingsJson.rawAssets
    : {};

  for (const assetsGroup of Object.values(rawAssets)) {
    if (!assetsGroup || typeof assetsGroup !== 'object') {
      continue;
    }
    for (const [assetId, assetValue] of Object.entries(assetsGroup)) {
      if (!Array.isArray(assetValue) || typeof assetValue[0] !== 'string') {
        continue;
      }
      const rawPath = assetValue[0];
      let rawUuid = null;
      if (/^\d+$/.test(assetId)) {
        rawUuid = uuids[Number(assetId)] || null;
      } else {
        rawUuid = assetId;
      }
      if (!rawUuid) {
        continue;
      }
      uuidPathMap.set(normalizeUuid(rawUuid), normalizeDbPath(rawPath));
    }
  }
  return uuidPathMap;
}

function mergeUuidPathMap(targetMap, sourceMap) {
  for (const [uuidValue, assetPath] of sourceMap.entries()) {
    targetMap.set(uuidValue, assetPath);
  }
}

function buildRestorePlan(bundleConfigs, externalUuidPathMap) {
  const restoreItems = [];
  const missingFiles = [];

  for (const bundleConfig of bundleConfigs) {
    const items = buildBundleRestoreItems(bundleConfig, externalUuidPathMap);
    for (const item of items.restoreItems) {
      restoreItems.push(item);
    }
    for (const missingItem of items.missingFiles) {
      missingFiles.push(missingItem);
    }
  }

  return {
    restoreItems: restoreItems,
    missingFiles: missingFiles
  };
}

function buildBundleRestoreItems(bundleConfig, externalUuidPathMap) {
  const restoreItems = [];
  const missingFiles = [];
  const configJson = bundleConfig.configJson;
  const uuids = Array.isArray(configJson.uuids) ? configJson.uuids : [];
  const versions = configJson.versions && typeof configJson.versions === 'object'
    ? configJson.versions
    : {};
  const uuidPathMap = parseBundleStylePathMap(configJson);
  mergeUuidPathMap(uuidPathMap, externalUuidPathMap);

  for (const kind of ['import', 'native']) {
    const versionPairs = Array.isArray(versions[kind]) ? versions[kind] : [];
    const baseDirName = resolveKindBase(configJson, kind);
    for (let index = 0; index < versionPairs.length; index += 2) {
      const assetId = versionPairs[index];
      const assetVersion = versionPairs[index + 1];
      const rawUuid = resolveRawUuid(assetId, uuids);
      if (!rawUuid) {
        continue;
      }

      const normalizedUuid = normalizeUuid(rawUuid);
      const mappedPath = uuidPathMap.get(normalizedUuid) || null;
      const assetShardPrefix = normalizedUuid.slice(0, 2).toLowerCase();
      const sourceDirPath = path.join(bundleConfig.bundleRoot, baseDirName, assetShardPrefix);
      const sourcePrefix = normalizedUuid + '.' + String(assetVersion) + '.';
      const sourceFilePaths = findFilesByPrefix(sourceDirPath, sourcePrefix);

      if (sourceFilePaths.length === 0) {
        missingFiles.push({
          bundleName: bundleConfig.bundleName,
          kind: kind,
          uuid: normalizedUuid,
          expectedPrefix: relativeProjectPath(path.join(sourceDirPath, sourcePrefix + '*'))
        });
        continue;
      }

      for (const sourceFilePath of sourceFilePaths) {
        restoreItems.push({
          sourcePath: sourceFilePath,
          bundleName: bundleConfig.bundleName,
          kind: kind,
          uuid: normalizedUuid,
          version: String(assetVersion),
          mappedPath: mappedPath
        });
      }
    }
  }

  return {
    restoreItems: restoreItems,
    missingFiles: missingFiles
  };
}

function resolveExecutionPlan(restorePlan, outputAbsolutePath) {
  const plannedTargetPaths = new Set();
  const executionItems = [];

  for (const item of restorePlan.restoreItems) {
    const sourceFileName = path.basename(item.sourcePath);
    const sourceExtension = path.extname(sourceFileName);
    const targetRelativePath = resolveTargetRelativePath(item, sourceExtension);
    const targetAbsolutePath = resolveUniqueTargetPath(
      path.join(outputAbsolutePath, targetRelativePath),
      plannedTargetPaths
    );

    plannedTargetPaths.add(targetAbsolutePath);
    executionItems.push({
      sourcePath: item.sourcePath,
      targetPath: targetAbsolutePath,
      mapped: Boolean(item.mappedPath)
    });
  }

  return {
    executionItems: executionItems,
    missingFiles: restorePlan.missingFiles
  };
}

function resolveTargetRelativePath(item, sourceExtension) {
  if (!item.mappedPath) {
    return path.join(
      '_unmapped',
      sanitizePathSegment(item.bundleName),
      item.kind,
      item.uuid + '.' + item.version + sourceExtension
    );
  }

  const normalizedMappedPath = normalizeDbPath(item.mappedPath);
  const mappedPathExtension = path.extname(normalizedMappedPath);
  if (item.kind === 'import') {
    if (mappedPathExtension === '.json') {
      return normalizedMappedPath;
    }
    if (mappedPathExtension.length > 0) {
      return normalizedMappedPath + '.json';
    }
    return normalizedMappedPath + '.json';
  }

  if (mappedPathExtension.length > 0) {
    return normalizedMappedPath;
  }
  return normalizedMappedPath + sourceExtension;
}

function resolveUniqueTargetPath(initialTargetPath, plannedTargetPaths) {
  if (!plannedTargetPaths.has(initialTargetPath) && !fs.existsSync(initialTargetPath)) {
    return initialTargetPath;
  }

  const parsed = path.parse(initialTargetPath);
  let serial = 2;
  while (true) {
    const nextPath = path.join(parsed.dir, parsed.name + '__dup' + serial + parsed.ext);
    if (!plannedTargetPaths.has(nextPath) && !fs.existsSync(nextPath)) {
      return nextPath;
    }
    serial += 1;
  }
}

function executePlan(executionPlan, options) {
  const mode = options.mode;
  const dryRun = options.dryRun;
  const copiedItems = [];

  for (const item of executionPlan.executionItems) {
    copiedItems.push(item);
    if (dryRun) {
      continue;
    }
    fs.mkdirSync(path.dirname(item.targetPath), { recursive: true });
    if (mode === 'move') {
      fs.renameSync(item.sourcePath, item.targetPath);
    } else {
      fs.copyFileSync(item.sourcePath, item.targetPath);
    }
  }

  return {
    processedCount: copiedItems.length,
    mappedCount: copiedItems.filter(function (item) { return item.mapped; }).length,
    unmappedCount: copiedItems.filter(function (item) { return !item.mapped; }).length,
    missingCount: executionPlan.missingFiles.length,
    missingSamples: executionPlan.missingFiles.slice(0, 20),
    outputSamples: copiedItems.slice(0, 20).map(function (item) {
      return {
        source: relativeProjectPath(item.sourcePath),
        target: relativeProjectPath(item.targetPath),
        mapped: item.mapped
      };
    })
  };
}

function printSummary(summary, options) {
  console.log('[restore-hashed-assets] summary');
  console.log(JSON.stringify({
    mode: options.mode,
    dryRun: options.dryRun,
    output: options.outputRelativePath,
    mappingFile: options.mappingFilePath ? relativeProjectPath(options.mappingFilePath) : null,
    processedCount: summary.processedCount,
    mappedCount: summary.mappedCount,
    unmappedCount: summary.unmappedCount,
    missingCount: summary.missingCount
  }, null, 2));

  if (summary.outputSamples.length > 0) {
    console.log('[restore-hashed-assets] samples');
    for (const item of summary.outputSamples) {
      console.log('- ' + item.source + ' -> ' + item.target + (item.mapped ? '' : ' (unmapped)'));
    }
  }

  if (summary.missingSamples.length > 0) {
    console.log('[restore-hashed-assets] missing samples');
    for (const item of summary.missingSamples) {
      console.log(
        '- [' + item.bundleName + '|' + item.kind + '] ' + item.uuid + ' -> ' + item.expectedPrefix
      );
    }
  }
}

function resolveRawUuid(assetId, uuids) {
  if (typeof assetId === 'number') {
    return uuids[assetId] || null;
  }
  if (typeof assetId === 'string' && /^\d+$/.test(assetId)) {
    return uuids[Number(assetId)] || assetId;
  }
  if (typeof assetId === 'string') {
    return assetId;
  }
  return null;
}

function resolveKindBase(configJson, kind) {
  if (kind === 'import') {
    return String(configJson.importBase || 'import');
  }
  return String(configJson.nativeBase || 'native');
}

function findFilesByPrefix(directoryPath, prefix) {
  if (!isDirectory(directoryPath)) {
    return [];
  }
  const matchedPaths = [];
  for (const entryName of fs.readdirSync(directoryPath)) {
    if (!entryName.startsWith(prefix)) {
      continue;
    }
    if (!HASHED_FILE_PATTERN.test(entryName)) {
      continue;
    }
    const entryPath = path.join(directoryPath, entryName);
    if (isFile(entryPath)) {
      matchedPaths.push(entryPath);
    }
  }
  matchedPaths.sort(function sortPath(leftPath, rightPath) {
    return leftPath.localeCompare(rightPath);
  });
  return matchedPaths;
}

function normalizeUuid(rawUuid) {
  const rawValue = String(rawUuid).trim();
  const core = rawValue.split('@')[0];
  if (core.length !== 22) {
    return rawValue;
  }

  let hex = core[0] + core[1];
  for (let index = 2; index < 22; index += 2) {
    const leftValue = BASE64_MAP[core[index]];
    const rightValue = BASE64_MAP[core[index + 1]];
    if (leftValue == null || rightValue == null) {
      return rawValue;
    }
    hex += HEX_CHARS[leftValue >> 2];
    hex += HEX_CHARS[((leftValue & 3) << 2) | (rightValue >> 4)];
    hex += HEX_CHARS[rightValue & 15];
  }

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20)
  ].join('-') + rawValue.slice(core.length);
}

function normalizeDbPath(rawPath) {
  return String(rawPath)
    .replace(/^db:\/*/i, '')
    .replace(/^\/+/, '')
    .replace(/\\/g, '/');
}

function sanitizePathSegment(segment) {
  return String(segment)
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_');
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
