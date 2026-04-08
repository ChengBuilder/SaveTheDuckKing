'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace,
  normalizePath
} = require('./project-paths');

const CATALOG_MARKDOWN_PATH = 'architecture/docs/bundle-asset-catalog.md';
const CATALOG_JSON_PATH = 'architecture/docs/bundle-asset-catalog.json';
const NOISE_SEGMENT_ALLOWLIST = new Set([
  'db',
  'tex',
  'ui',
  'bgm',
  'fx',
  'audio',
  'prefab',
  'scene',
  'spriteframe',
  'skeleton',
  'texture'
]);

/**
 * 生成 bundle 资产目录。
 * 目标：把运行时依赖的 UUID 编译产物重新折叠为“人能读懂”的 bundle 视图，
 * 便于后续继续做语义化目录、素材命名和配置治理。
 */
function generateBundleAssetCatalog() {
  const layout = resolveProjectLayout(__dirname);
  const bundleRecords = collectBundleRecords(layout);
  const catalogPayload = buildCatalogPayload(bundleRecords);
  const markdownLines = buildCatalogMarkdownLines(layout, catalogPayload);

  writeCatalogFiles(layout, catalogPayload, markdownLines);

  console.log('[Bundle资产目录] 已生成 Markdown:', formatProjectPathFromWorkspace(layout, CATALOG_MARKDOWN_PATH));
  console.log('[Bundle资产目录] 已生成 JSON:', formatProjectPathFromWorkspace(layout, CATALOG_JSON_PATH));
}

/**
 * 收集所有 canonical bundle 配置。
 * 仅收集语义化配置文件，忽略兼容目录中的 `config.json` 副本。
 * @param {{projectRoot: string}} layout 项目布局
 * @returns {ReturnType<typeof createBundleRecord>[]}
 */
function collectBundleRecords(layout) {
  const configFilePaths = [];
  configFilePaths.push.apply(configFilePaths, collectConfigFiles(resolveProjectFilePath(layout, 'assets')));
  configFilePaths.push.apply(configFilePaths, collectConfigFiles(resolveProjectFilePath(layout, 'subpackages')));

  return configFilePaths
    .sort()
    .map(function mapConfigFilePath(configFilePath) {
      return createBundleRecord(layout, configFilePath);
    });
}

/**
 * 递归收集语义化 bundle 配置文件。
 * @param {string} startDirectoryPath 起始目录
 * @returns {string[]}
 */
function collectConfigFiles(startDirectoryPath) {
  if (!fs.existsSync(startDirectoryPath)) {
    return [];
  }

  const collectedFilePaths = [];
  const directoryEntries = fs.readdirSync(startDirectoryPath, { withFileTypes: true });

  for (const directoryEntry of directoryEntries) {
    const targetPath = path.join(startDirectoryPath, directoryEntry.name);

    if (directoryEntry.isDirectory()) {
      if (directoryEntry.name === 'import' || directoryEntry.name === 'native') {
        continue;
      }
      collectedFilePaths.push.apply(collectedFilePaths, collectConfigFiles(targetPath));
      continue;
    }

    if (!directoryEntry.isFile()) {
      continue;
    }

    if (/^config\.[a-z0-9-]+\.json$/i.test(directoryEntry.name)) {
      collectedFilePaths.push(targetPath);
    }
  }

  return collectedFilePaths;
}

/**
 * 基于 bundle 配置生成可读记录。
 * @param {{projectRoot: string}} layout 项目布局
 * @param {string} configFilePath 配置文件路径
 * @returns {{
 *  bundleId: string,
 *  semanticLabel: string,
 *  bundleType: string,
 *  directoryPath: string,
 *  configPath: string,
 *  dependencies: string[],
 *  assetCount: number,
 *  sceneCount: number,
 *  scenePaths: string[],
 *  topLevelGroups: {name: string, count: number}[],
 *  topSemanticPaths: {name: string, count: number}[],
 *  samplePaths: string[],
 *  uuidCount: number,
 *  compiledImportFileCount: number,
 *  compiledNativeFileCount: number,
 *  compiledUuidLikeFileCount: number
 * }}
 */
function createBundleRecord(layout, configFilePath) {
  const configJson = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
  const directoryPath = path.dirname(configFilePath);
  const bundleType = resolveBundleType(layout, directoryPath);
  const assetPaths = extractAssetPaths(configJson.paths);
  const scenePaths = Object.keys(configJson.scenes || {});
  const compiledImportFilePaths = collectCompiledFiles(path.join(directoryPath, 'import'));
  const compiledNativeFilePaths = collectCompiledFiles(path.join(directoryPath, 'native'));
  const compiledFilePaths = compiledImportFilePaths.concat(compiledNativeFilePaths);
  const namingNoise = collectNamingNoise(assetPaths);

  return {
    bundleId: String(configJson.name || path.basename(directoryPath)),
    semanticLabel: resolveSemanticLabel(String(configJson.name || ''), assetPaths, scenePaths, bundleType),
    bundleType: bundleType,
    directoryPath: normalizePath(path.relative(layout.projectRoot, directoryPath)),
    configPath: normalizePath(path.relative(layout.projectRoot, configFilePath)),
    dependencies: Array.isArray(configJson.deps) ? configJson.deps.slice() : [],
    assetCount: assetPaths.length,
    sceneCount: scenePaths.length,
    scenePaths: scenePaths,
    topLevelGroups: summarizePathGroups(assetPaths, 1),
    topSemanticPaths: summarizePathGroups(assetPaths, 2),
    samplePaths: assetPaths.slice(0, 16),
    namingNoisePaths: namingNoise.paths,
    namingNoiseTokens: namingNoise.tokens,
    uuidCount: Array.isArray(configJson.uuids) ? configJson.uuids.length : 0,
    compiledImportFileCount: compiledImportFilePaths.length,
    compiledNativeFileCount: compiledNativeFilePaths.length,
    compiledUuidLikeFileCount: countUuidLikeCompiledFiles(compiledFilePaths)
  };
}

/**
 * 判定 bundle 属于 root bundle 还是 subpackage bundle。
 * @param {{projectRoot: string}} layout 项目布局
 * @param {string} directoryPath bundle 目录
 * @returns {string}
 */
function resolveBundleType(layout, directoryPath) {
  const relativeDirectoryPath = normalizePath(path.relative(layout.projectRoot, directoryPath));
  return relativeDirectoryPath.startsWith('subpackages/') ? 'subpackage-bundle' : 'root-bundle';
}

/**
 * 从配置中的 `paths` 字段提取资产路径。
 * @param {Record<string, any>} rawPaths 原始 paths 配置
 * @returns {string[]}
 */
function extractAssetPaths(rawPaths) {
  if (!rawPaths || typeof rawPaths !== 'object') {
    return [];
  }

  const assetPaths = [];
  for (const pathValue of Object.values(rawPaths)) {
    if (!Array.isArray(pathValue) || typeof pathValue[0] !== 'string') {
      continue;
    }
    assetPaths.push(pathValue[0]);
  }

  return assetPaths;
}

/**
 * 递归收集 import/native 内的编译产物文件。
 * @param {string} directoryPath 目录路径
 * @returns {string[]}
 */
function collectCompiledFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const collectedFilePaths = [];
  const directoryEntries = fs.readdirSync(directoryPath, { withFileTypes: true });

  for (const directoryEntry of directoryEntries) {
    const targetPath = path.join(directoryPath, directoryEntry.name);

    if (directoryEntry.isDirectory()) {
      collectedFilePaths.push.apply(collectedFilePaths, collectCompiledFiles(targetPath));
      continue;
    }

    if (directoryEntry.isFile()) {
      collectedFilePaths.push(targetPath);
    }
  }

  return collectedFilePaths;
}

/**
 * 统计资产路径前缀分布。
 * @param {string[]} assetPaths 资产路径列表
 * @param {number} segmentCount 使用的层级数
 * @returns {{name: string, count: number}[]}
 */
function summarizePathGroups(assetPaths, segmentCount) {
  const groupCounter = new Map();

  for (const assetPath of assetPaths) {
    const pathSegments = assetPath.split('/').filter(Boolean);
    const groupName = pathSegments.slice(0, segmentCount).join('/') || '(root)';
    const nextCount = (groupCounter.get(groupName) || 0) + 1;
    groupCounter.set(groupName, nextCount);
  }

  return Array.from(groupCounter.entries())
    .map(function mapEntry(entry) {
      return {
        name: entry[0],
        count: entry[1]
      };
    })
    .sort(function sortGroups(left, right) {
      if (left.count !== right.count) {
        return right.count - left.count;
      }
      return left.name.localeCompare(right.name, 'zh-Hans-CN');
    })
    .slice(0, 12);
}

/**
 * 统计 UUID 风格编译文件数量。
 * @param {string[]} filePaths 文件路径列表
 * @returns {number}
 */
function countUuidLikeCompiledFiles(filePaths) {
  let uuidLikeFileCount = 0;

  for (const filePath of filePaths) {
    if (isUuidLikeCompiledFile(filePath)) {
      uuidLikeFileCount += 1;
    }
  }

  return uuidLikeFileCount;
}

/**
 * 收集低可读命名候选。
 * 目标：优先标出短缩写、序号式和符号化路径，为下一批真实 rename 提供名单。
 * @param {string[]} assetPaths 资产路径列表
 * @returns {{paths: string[], tokens: {name: string, count: number}[]}}
 */
function collectNamingNoise(assetPaths) {
  const noisePathSet = new Set();
  const noiseTokenCounter = new Map();

  for (const assetPath of assetPaths) {
    const pathSegments = assetPath.split('/').filter(Boolean);
    let hasNoiseSegment = false;

    for (const pathSegment of pathSegments) {
      if (!isNamingNoiseSegment(pathSegment)) {
        continue;
      }

      hasNoiseSegment = true;
      noiseTokenCounter.set(pathSegment, (noiseTokenCounter.get(pathSegment) || 0) + 1);
    }

    if (hasNoiseSegment) {
      noisePathSet.add(assetPath);
    }
  }

  return {
    paths: Array.from(noisePathSet).slice(0, 16),
    tokens: Array.from(noiseTokenCounter.entries())
      .map(function mapEntry(entry) {
        return {
          name: entry[0],
          count: entry[1]
        };
      })
      .sort(function sortNoiseTokens(left, right) {
        if (left.count !== right.count) {
          return right.count - left.count;
        }
        return left.name.localeCompare(right.name, 'zh-Hans-CN');
      })
      .slice(0, 12)
  };
}

/**
 * 判断路径片段是否属于低可读命名。
 * @param {string} pathSegment 路径片段
 * @returns {boolean}
 */
function isNamingNoiseSegment(pathSegment) {
  const normalizedSegment = String(pathSegment || '').toLowerCase();

  if (normalizedSegment.length === 0 || NOISE_SEGMENT_ALLOWLIST.has(normalizedSegment)) {
    return false;
  }

  if (/%/.test(normalizedSegment)) {
    return true;
  }

  if (/^(?:[a-z]{1,2}\d+|[a-z]\d{0,2}|[mfblp]\d+|xg\d+|cd\d+|skeleton\d+)$/i.test(normalizedSegment)) {
    return true;
  }

  return /^[a-z]{1,3}$/i.test(normalizedSegment);
}

/**
 * 判断编译产物文件名是否为 UUID 风格。
 * @param {string} filePath 文件路径
 * @returns {boolean}
 */
function isUuidLikeCompiledFile(filePath) {
  const fileName = path.basename(filePath);
  const headToken = fileName.split('.')[0].split('@')[0];
  return /^[0-9a-f-]{8,}$/i.test(headToken);
}

/**
 * 解析 bundle 的治理标签。
 * 该标签只用于维护文档与治理报告，不参与运行时映射。
 * @param {string} bundleId 当前 bundle 名
 * @param {string[]} assetPaths 资产路径
 * @param {string[]} scenePaths 场景路径
 * @param {string} bundleType bundle 类型
 * @returns {string}
 */
function resolveSemanticLabel(bundleId, assetPaths, scenePaths, bundleType) {
  const normalizedBundleId = bundleId.toLowerCase();
  const joinedAssetPaths = assetPaths.join('\n');
  const joinedScenePaths = scenePaths.join('\n');

  if (bundleType === 'root-bundle' && normalizedBundleId === 'internal') {
    return 'engine-internal';
  }
  if (normalizedBundleId === 'start-scene') {
    return 'start-scene';
  }
  if (normalizedBundleId === 'resources') {
    return 'shared-effects';
  }
  if (normalizedBundleId === 'main') {
    return 'main-scenes';
  }
  if (normalizedBundleId.includes('ani')) {
    return 'animation-assets';
  }
  if (normalizedBundleId.includes('audio')) {
    return 'audio-assets';
  }
  if (normalizedBundleId.includes('ui')) {
    return 'ui-assets';
  }
  if (normalizedBundleId.includes('duck') || /duck|wood|nail/i.test(joinedAssetPaths)) {
    return 'duck-game';
  }
  if (normalizedBundleId.includes('game2') || /fruit/i.test(joinedAssetPaths) || /Fruit/i.test(joinedScenePaths)) {
    return 'fruit-game';
  }
  if (normalizedBundleId.includes('home') || /HomeScene|主页|BgThings/.test(joinedAssetPaths + '\n' + joinedScenePaths)) {
    return 'home-hall';
  }

  return toKebabCase(bundleId);
}

/**
 * 将 bundle 名转换为 kebab-case 治理标签。
 * @param {string} targetText 原始文本
 * @returns {string}
 */
function toKebabCase(targetText) {
  return String(targetText || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

/**
 * 构建目录数据载荷。
 * @param {ReturnType<typeof createBundleRecord>[]} bundleRecords bundle 记录
 * @returns {{
 *  generatedAt: string,
 *  summary: {
 *    totalBundles: number,
 *    rootBundles: number,
 *    subpackageBundles: number,
 *    totalAssetPaths: number,
 *    totalScenes: number,
 *    totalImportFiles: number,
 *    totalNativeFiles: number,
 *    totalUuidLikeCompiledFiles: number,
 *    bundlesWithNamingNoise: number
 *  },
 *  bundles: ReturnType<typeof createBundleRecord>[]
 * }}
 */
function buildCatalogPayload(bundleRecords) {
  const summary = {
    totalBundles: bundleRecords.length,
    rootBundles: 0,
    subpackageBundles: 0,
    totalAssetPaths: 0,
    totalScenes: 0,
    totalImportFiles: 0,
    totalNativeFiles: 0,
    totalUuidLikeCompiledFiles: 0,
    bundlesWithNamingNoise: 0
  };

  for (const bundleRecord of bundleRecords) {
    if (bundleRecord.bundleType === 'root-bundle') {
      summary.rootBundles += 1;
    } else {
      summary.subpackageBundles += 1;
    }

    summary.totalAssetPaths += bundleRecord.assetCount;
    summary.totalScenes += bundleRecord.sceneCount;
    summary.totalImportFiles += bundleRecord.compiledImportFileCount;
    summary.totalNativeFiles += bundleRecord.compiledNativeFileCount;
    summary.totalUuidLikeCompiledFiles += bundleRecord.compiledUuidLikeFileCount;
    if (bundleRecord.namingNoisePaths.length > 0) {
      summary.bundlesWithNamingNoise += 1;
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    summary: summary,
    bundles: bundleRecords
  };
}

/**
 * 构建 Markdown 目录。
 * @param {{projectRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {{
 *  generatedAt: string,
 *  summary: {
 *    totalBundles: number,
 *    rootBundles: number,
 *    subpackageBundles: number,
 *    totalAssetPaths: number,
 *    totalScenes: number,
 *    totalImportFiles: number,
 *    totalNativeFiles: number,
 *    totalUuidLikeCompiledFiles: number,
 *    bundlesWithNamingNoise: number
 *  },
 *  bundles: ReturnType<typeof createBundleRecord>[]
 * }} catalogPayload 目录数据
 * @returns {string[]}
 */
function buildCatalogMarkdownLines(layout, catalogPayload) {
  const lines = [];
  lines.push('# Bundle 资产目录（自动生成）');
  lines.push('');
  lines.push('> 本文件由 `architecture/tools/generate-bundle-asset-catalog.js` 生成。');
  lines.push('');
  lines.push('## 总览');
  lines.push('- 生成时间：' + catalogPayload.generatedAt);
  lines.push('- Bundle 总数：' + catalogPayload.summary.totalBundles);
  lines.push('- Root bundle 数：' + catalogPayload.summary.rootBundles);
  lines.push('- Subpackage bundle 数：' + catalogPayload.summary.subpackageBundles);
  lines.push('- 资产路径记录数：' + catalogPayload.summary.totalAssetPaths);
  lines.push('- 场景路径数：' + catalogPayload.summary.totalScenes);
  lines.push('- 编译产物文件数：import ' + catalogPayload.summary.totalImportFiles + ' / native ' + catalogPayload.summary.totalNativeFiles);
  lines.push('- UUID 风格编译文件数：' + catalogPayload.summary.totalUuidLikeCompiledFiles);
  lines.push('- 存在低可读命名候选的 bundle 数：' + catalogPayload.summary.bundlesWithNamingNoise);
  lines.push('');
  lines.push('## Bundle 一览');
  lines.push('| Bundle ID | 治理标签 | 类型 | 依赖 | 资产数 | 场景数 | 主要路径前缀 |');
  lines.push('| --- | --- | --- | --- | ---: | ---: | --- |');

  for (const bundleRecord of catalogPayload.bundles) {
    const primaryGroups = bundleRecord.topLevelGroups
      .slice(0, 3)
      .map(function mapGroup(group) {
        return group.name;
      })
      .join(' / ');

    lines.push(
      '| `' + bundleRecord.bundleId + '`'
      + ' | `' + bundleRecord.semanticLabel + '`'
      + ' | ' + bundleRecord.bundleType
      + ' | ' + formatDependencies(bundleRecord.dependencies)
      + ' | ' + bundleRecord.assetCount
      + ' | ' + bundleRecord.sceneCount
      + ' | ' + escapeMarkdownCell(primaryGroups)
      + ' |'
    );
  }

  lines.push('');
  lines.push('## 分 Bundle 明细');

  for (const bundleRecord of catalogPayload.bundles) {
    lines.push('');
    lines.push('### ' + bundleRecord.bundleId);
    lines.push('- 治理标签：`' + bundleRecord.semanticLabel + '`');
    lines.push('- 类型：`' + bundleRecord.bundleType + '`');
    lines.push('- 目录：`' + formatProjectPathFromWorkspace(layout, bundleRecord.directoryPath) + '`');
    lines.push('- 配置：`' + formatProjectPathFromWorkspace(layout, bundleRecord.configPath) + '`');
    lines.push('- 依赖：' + formatDependencies(bundleRecord.dependencies));
    lines.push('- 资产路径数：' + bundleRecord.assetCount);
    lines.push('- 场景路径数：' + bundleRecord.sceneCount);
    lines.push('- UUID 记录数：' + bundleRecord.uuidCount);
    lines.push('- 编译产物文件：import ' + bundleRecord.compiledImportFileCount + ' / native ' + bundleRecord.compiledNativeFileCount);
    lines.push('- UUID 风格编译文件：' + bundleRecord.compiledUuidLikeFileCount);
    lines.push('- 命名噪声高频片段：');
    appendNamedCountLines(lines, bundleRecord.namingNoiseTokens);
    lines.push('- 命名噪声样例路径：');
    appendSampleLines(lines, bundleRecord.namingNoisePaths);
    lines.push('- 主要路径前缀：');
    appendNamedCountLines(lines, bundleRecord.topLevelGroups);
    lines.push('- 主要语义路径：');
    appendNamedCountLines(lines, bundleRecord.topSemanticPaths);
    lines.push('- 样例路径：');
    appendSampleLines(lines, bundleRecord.samplePaths);
    lines.push('- 场景路径：');
    appendSampleLines(lines, bundleRecord.scenePaths);
  }

  lines.push('');
  return lines;
}

/**
 * 追加“名称 + 数量”列表。
 * @param {string[]} lines 输出行
 * @param {{name: string, count: number}[]} namedCounts 统计列表
 */
function appendNamedCountLines(lines, namedCounts) {
  if (!Array.isArray(namedCounts) || namedCounts.length === 0) {
    lines.push('  - 无');
    return;
  }

  for (const namedCount of namedCounts) {
    lines.push('  - `' + namedCount.name + '`：' + namedCount.count);
  }
}

/**
 * 追加样例路径列表。
 * @param {string[]} lines 输出行
 * @param {string[]} samplePaths 样例路径
 */
function appendSampleLines(lines, samplePaths) {
  if (!Array.isArray(samplePaths) || samplePaths.length === 0) {
    lines.push('  - 无');
    return;
  }

  for (const samplePath of samplePaths) {
    lines.push('  - `' + samplePath + '`');
  }
}

/**
 * 将依赖列表转换为展示文本。
 * @param {string[]} dependencies 依赖列表
 * @returns {string}
 */
function formatDependencies(dependencies) {
  if (!Array.isArray(dependencies) || dependencies.length === 0) {
    return '无';
  }

  return dependencies.map(function mapDependency(dependency) {
    return '`' + dependency + '`';
  }).join('、');
}

/**
 * 转义 Markdown 表格中的竖线。
 * @param {string} cellText 单元格文本
 * @returns {string}
 */
function escapeMarkdownCell(cellText) {
  return String(cellText || '').replace(/\|/g, '\\|');
}

/**
 * 写出目录文件。
 * @param {{projectRoot: string}} layout 项目布局
 * @param {object} catalogPayload 目录 JSON 数据
 * @param {string[]} markdownLines Markdown 内容
 */
function writeCatalogFiles(layout, catalogPayload, markdownLines) {
  const markdownOutputPath = resolveProjectFilePath(layout, CATALOG_MARKDOWN_PATH);
  const jsonOutputPath = resolveProjectFilePath(layout, CATALOG_JSON_PATH);

  fs.writeFileSync(markdownOutputPath, markdownLines.join('\n') + '\n');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(catalogPayload, null, 2) + '\n');
}

generateBundleAssetCatalog();
