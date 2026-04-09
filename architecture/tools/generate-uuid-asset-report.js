'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace,
  normalizePath
} = require('./project-paths');

const UUID_REPORT_MARKDOWN_PATH = 'architecture/docs/uuid-asset-report.md';
const UUID_REPORT_JSON_PATH = 'architecture/docs/uuid-asset-report.json';
const UUID_TEMPLATE = [
  '', '', '', '', '', '', '', '', '-', '', '', '', '', '-', '', '', '', '', '-', '', '', '', '', '-',
  '', '', '', '', '', '', '', '', '', '', '', ''
];
const BASE64_KEY_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const HEX_CHARS = '0123456789abcdef';
const BASE64_VALUES = createBase64ValueMap();
const INCLUDE_FULL_RECORDS =
  process.argv.includes('--full-records') || process.env.DUCK_UUID_AUDIT_FULL === '1';
const UNMATCHED_SAMPLE_LIMIT = 40;

/**
 * 生成 UUID 编译资产审计报告。
 * 目标：回答“这些长 UUID JSON 到底有没有用、属于什么类型、映射到哪个语义资产”。
 */
function generateUuidAssetReport() {
  const layout = resolveProjectLayout(__dirname);
  const bundleConfigPaths = collectBundleConfigPaths(layout);
  const bundleReports = bundleConfigPaths.map(function mapConfig(configPath) {
    return createBundleReport(layout, configPath);
  });
  const reportPayload = buildUuidReportPayload(bundleReports);
  const markdownLines = buildUuidReportMarkdownLines(layout, reportPayload);

  writeReportFiles(layout, reportPayload, markdownLines);

  console.log('[UUID资产审计] 已生成 Markdown:', formatProjectPathFromWorkspace(layout, UUID_REPORT_MARKDOWN_PATH));
  console.log('[UUID资产审计] 已生成 JSON:', formatProjectPathFromWorkspace(layout, UUID_REPORT_JSON_PATH));
}

/**
 * 收集全部 canonical bundle 配置。
 * @param {{projectRoot: string}} layout 项目布局
 * @returns {string[]}
 */
function collectBundleConfigPaths(layout) {
  const configPaths = [];
  configPaths.push.apply(configPaths, collectConfigFiles(resolveProjectFilePath(layout, 'assets')));
  configPaths.push.apply(configPaths, collectConfigFiles(resolveProjectFilePath(layout, 'subpackages')));
  return configPaths.sort();
}

/**
 * 递归收集语义化 bundle 配置文件。
 * @param {string} directoryPath 起始目录
 * @returns {string[]}
 */
function collectConfigFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const collectedFilePaths = [];
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

  for (const entry of entries) {
    const targetPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'import' || entry.name === 'native') {
        continue;
      }
      collectedFilePaths.push.apply(collectedFilePaths, collectConfigFiles(targetPath));
      continue;
    }

    if (entry.isFile() && /^config\.[a-z0-9-]+\.json$/i.test(entry.name)) {
      collectedFilePaths.push(targetPath);
    }
  }

  return collectedFilePaths;
}

/**
 * 基于单个 bundle 配置生成审计结果。
 * @param {{projectRoot: string}} layout 项目布局
 * @param {string} configFilePath 配置路径
 * @returns {Record<string, any>}
 */
function createBundleReport(layout, configFilePath) {
  const configJson = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
  const bundleDirectoryPath = path.dirname(configFilePath);
  const importDirectoryPath = path.join(bundleDirectoryPath, 'import');
  const nativeDirectoryPath = path.join(bundleDirectoryPath, 'native');
  const importFilePaths = collectCompiledFiles(importDirectoryPath);
  const nativeFilePaths = collectCompiledFiles(nativeDirectoryPath);
  const importFileIndex = createCompiledFileIndex(importFilePaths, bundleDirectoryPath);
  const nativeFileIndex = createCompiledFileIndex(nativeFilePaths, bundleDirectoryPath);
  const packMembership = buildPackMembership(configJson.packs);
  const assetRecords = createAssetRecords(
    layout,
    bundleDirectoryPath,
    configJson,
    importFileIndex,
    nativeFileIndex,
    packMembership
  );
  const matchedImportFiles = collectMatchedFiles(assetRecords, 'importContainerRelativePath');
  const matchedNativeFiles = collectMatchedFiles(assetRecords, 'nativeFileRelativePath');
  const packRecords = createPackRecords(importFileIndex, packMembership);
  const typeSummary = summarizeAssetTypes(assetRecords);
  const unmatchedImportFiles = collectUnmatchedCompiledFiles(importFileIndex, matchedImportFiles);
  const unmatchedNativeFiles = collectUnmatchedCompiledFiles(nativeFileIndex, matchedNativeFiles);

  const bundleReport = {
    bundleName: String(configJson.name || path.basename(bundleDirectoryPath)),
    bundleDirectory: normalizePath(path.relative(layout.projectRoot, bundleDirectoryPath)),
    configPath: normalizePath(path.relative(layout.projectRoot, configFilePath)),
    assetRecordCount: assetRecords.length,
    uuidCount: Array.isArray(configJson.uuids) ? configJson.uuids.length : 0,
    directImportFileCount: assetRecords.filter(function filterDirect(record) {
      return record.importContainerKind === 'direct-import-json';
    }).length,
    packedImportAssetCount: assetRecords.filter(function filterPacked(record) {
      return record.importContainerKind === 'packed-import-json';
    }).length,
    missingImportAssetCount: assetRecords.filter(function filterMissing(record) {
      return record.importContainerKind === 'missing-import-json';
    }).length,
    nativeFileLinkedCount: assetRecords.filter(function filterNative(record) {
      return typeof record.nativeFileRelativePath === 'string' && record.nativeFileRelativePath.length > 0;
    }).length,
    importFileCount: importFilePaths.length,
    nativeFileCount: nativeFilePaths.length,
    packFileCount: packRecords.filter(function filterPack(packRecord) {
      return typeof packRecord.importFileRelativePath === 'string' && packRecord.importFileRelativePath.length > 0;
    }).length,
    unmatchedImportFileCount: unmatchedImportFiles.length,
    unmatchedNativeFileCount: unmatchedNativeFiles.length,
    typeSummary: typeSummary,
    packRecords: packRecords,
    sampleAssetRecords: assetRecords.slice(0, 20),
    unmatchedImportFiles: unmatchedImportFiles.slice(0, UNMATCHED_SAMPLE_LIMIT),
    unmatchedNativeFiles: unmatchedNativeFiles.slice(0, UNMATCHED_SAMPLE_LIMIT),
    unmatchedImportFilesOmittedCount: Math.max(0, unmatchedImportFiles.length - UNMATCHED_SAMPLE_LIMIT),
    unmatchedNativeFilesOmittedCount: Math.max(0, unmatchedNativeFiles.length - UNMATCHED_SAMPLE_LIMIT)
  };

  if (INCLUDE_FULL_RECORDS) {
    bundleReport.assetRecords = assetRecords;
    bundleReport.unmatchedImportFilesFull = unmatchedImportFiles;
    bundleReport.unmatchedNativeFilesFull = unmatchedNativeFiles;
  }

  return bundleReport;
}

/**
 * 递归收集编译产物文件。
 * @param {string} directoryPath 目录路径
 * @returns {string[]}
 */
function collectCompiledFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const collectedFilePaths = [];
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

  for (const entry of entries) {
    const targetPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      collectedFilePaths.push.apply(collectedFilePaths, collectCompiledFiles(targetPath));
      continue;
    }
    if (entry.isFile()) {
      collectedFilePaths.push(targetPath);
    }
  }

  return collectedFilePaths.sort();
}

/**
 * 建立“编译文件前缀 -> 相对路径列表”的索引。
 * @param {string[]} filePaths 文件路径列表
 * @param {string} bundleDirectoryPath bundle 根目录
 * @returns {Map<string, string[]>}
 */
function createCompiledFileIndex(filePaths, bundleDirectoryPath) {
  const fileIndex = new Map();

  for (const filePath of filePaths) {
    const relativePath = normalizePath(path.relative(bundleDirectoryPath, filePath));
    const prefix = resolveCompiledFilePrefix(filePath);
    if (!fileIndex.has(prefix)) {
      fileIndex.set(prefix, []);
    }
    fileIndex.get(prefix).push(relativePath);
  }

  return fileIndex;
}

/**
 * 提取编译文件的匹配前缀。
 * 例如 `uuid.hash.json` -> `uuid`。
 * @param {string} filePath 文件路径
 * @returns {string}
 */
function resolveCompiledFilePrefix(filePath) {
  const fileName = path.basename(filePath);
  const firstDotIndex = fileName.indexOf('.');
  return firstDotIndex === -1 ? fileName : fileName.slice(0, firstDotIndex);
}

/**
 * 构建 pack 关系映射。
 * @param {Record<string, any>} rawPacks 原始 packs 配置
 * @returns {{packIds: string[], assetToPackIds: Map<number, string[]>}}
 */
function buildPackMembership(rawPacks) {
  const packIds = [];
  const assetToPackIds = new Map();
  const packs = rawPacks && typeof rawPacks === 'object' ? rawPacks : {};

  for (const [packId, assetIndexList] of Object.entries(packs)) {
    packIds.push(packId);
    if (!Array.isArray(assetIndexList)) {
      continue;
    }

    for (const assetIndex of assetIndexList) {
      if (!assetToPackIds.has(assetIndex)) {
        assetToPackIds.set(assetIndex, []);
      }
      assetToPackIds.get(assetIndex).push(packId);
    }
  }

  return {
    packIds: packIds.sort(),
    assetToPackIds: assetToPackIds
  };
}

/**
 * 生成单个 bundle 的资产记录。
 * @param {{projectRoot: string}} layout 项目布局
 * @param {string} bundleDirectoryPath bundle 根目录
 * @param {Record<string, any>} configJson bundle 配置
 * @param {Map<string, string[]>} importFileIndex import 文件索引
 * @param {Map<string, string[]>} nativeFileIndex native 文件索引
 * @param {{assetToPackIds: Map<number, string[]>}} packMembership pack 关系
 * @returns {Record<string, any>[]}
 */
function createAssetRecords(layout, bundleDirectoryPath, configJson, importFileIndex, nativeFileIndex, packMembership) {
  const assetRecords = [];
  const paths = configJson.paths && typeof configJson.paths === 'object' ? configJson.paths : {};
  const sortedAssetIndices = Object.keys(paths)
    .filter(function filterNumericKey(key) {
      return /^\d+$/.test(key);
    })
    .map(function mapKey(key) {
      return Number(key);
    })
    .sort(function sortIndex(left, right) {
      return left - right;
    });

  for (const assetIndex of sortedAssetIndices) {
    const pathEntry = paths[String(assetIndex)];
    if (!Array.isArray(pathEntry) || typeof pathEntry[0] !== 'string') {
      continue;
    }

    const canonicalPath = pathEntry[0];
    const typeIndex = typeof pathEntry[1] === 'number' ? pathEntry[1] : -1;
    const assetType = resolveAssetType(configJson.types, typeIndex);
    const compressedUuid = Array.isArray(configJson.uuids) ? String(configJson.uuids[assetIndex] || '') : '';
    const uuid = decodeCompressedUuid(compressedUuid);
    const directImportFileRelativePath = resolveCompiledFileByPrefix(importFileIndex, uuid);
    const packIdList = packMembership.assetToPackIds.get(assetIndex) || [];
    const packImportFileRelativePath = resolveFirstPackImportFile(importFileIndex, packIdList);
    const importContainerRelativePath = directImportFileRelativePath || packImportFileRelativePath;
    const importContainerKind = directImportFileRelativePath
      ? 'direct-import-json'
      : packImportFileRelativePath
        ? 'packed-import-json'
        : 'missing-import-json';
    const nativeFileRelativePath = resolveCompiledFileByPrefix(nativeFileIndex, uuid);
    const importDisplayName = directImportFileRelativePath
      ? extractImportDisplayName(path.join(bundleDirectoryPath, directImportFileRelativePath))
      : '';

    assetRecords.push({
      assetIndex: assetIndex,
      canonicalPath: canonicalPath,
      assetType: assetType,
      compressedUuid: compressedUuid,
      uuid: uuid,
      importContainerKind: importContainerKind,
      importContainerRelativePath: importContainerRelativePath,
      importDisplayName: importDisplayName,
      nativeFileRelativePath: nativeFileRelativePath,
      packIds: packIdList.slice(),
      bundleDirectory: normalizePath(path.relative(layout.projectRoot, bundleDirectoryPath))
    });
  }

  return assetRecords;
}

/**
 * 解析资产类型名称。
 * @param {any[]} types 类型数组
 * @param {number} typeIndex 类型索引
 * @returns {string}
 */
function resolveAssetType(types, typeIndex) {
  if (!Array.isArray(types) || typeIndex < 0 || typeof types[typeIndex] !== 'string') {
    return '(unknown)';
  }
  return types[typeIndex];
}

/**
 * 根据前缀查找首个编译文件。
 * @param {Map<string, string[]>} fileIndex 文件索引
 * @param {string} prefix 前缀
 * @returns {string}
 */
function resolveCompiledFileByPrefix(fileIndex, prefix) {
  if (typeof prefix !== 'string' || prefix.length === 0) {
    return '';
  }
  const fileList = fileIndex.get(prefix);
  return Array.isArray(fileList) && fileList.length > 0 ? fileList[0] : '';
}

/**
 * 根据 pack id 列表查找首个 pack 文件。
 * @param {Map<string, string[]>} importFileIndex import 文件索引
 * @param {string[]} packIds pack id 列表
 * @returns {string}
 */
function resolveFirstPackImportFile(importFileIndex, packIds) {
  if (!Array.isArray(packIds)) {
    return '';
  }

  for (const packId of packIds) {
    const filePath = resolveCompiledFileByPrefix(importFileIndex, packId);
    if (filePath) {
      return filePath;
    }
  }

  return '';
}

/**
 * 提取 import 文件中的首个 name 字段。
 * @param {string} filePath import 文件路径
 * @returns {string}
 */
function extractImportDisplayName(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/"name":"([^"]+)"/);
    return match ? match[1] : '';
  } catch (error) {
    return '';
  }
}

/**
 * 汇总 pack 记录。
 * @param {Map<string, string[]>} importFileIndex import 文件索引
 * @param {{packIds: string[], assetToPackIds: Map<number, string[]>}} packMembership pack 关系
 * @returns {Record<string, any>[]}
 */
function createPackRecords(importFileIndex, packMembership) {
  const assetCountByPackId = new Map();
  for (const packIdList of packMembership.assetToPackIds.values()) {
    for (const packId of packIdList) {
      assetCountByPackId.set(packId, (assetCountByPackId.get(packId) || 0) + 1);
    }
  }

  return packMembership.packIds.map(function mapPackId(packId) {
    return {
      packId: packId,
      assetCount: assetCountByPackId.get(packId) || 0,
      importFileRelativePath: resolveCompiledFileByPrefix(importFileIndex, packId)
    };
  });
}

/**
 * 统计已匹配文件集合。
 * @param {Record<string, any>[]} assetRecords 资产记录
 * @param {string} keyName 目标字段名
 * @returns {Set<string>}
 */
function collectMatchedFiles(assetRecords, keyName) {
  const fileSet = new Set();

  for (const assetRecord of assetRecords) {
    const filePath = assetRecord[keyName];
    if (typeof filePath === 'string' && filePath.length > 0) {
      fileSet.add(filePath);
    }
  }

  return fileSet;
}

/**
 * 收集未被路径或 pack 命中的编译文件。
 * @param {Map<string, string[]>} fileIndex 文件索引
 * @param {Set<string>} matchedFiles 已匹配文件集合
 * @returns {string[]}
 */
function collectUnmatchedCompiledFiles(fileIndex, matchedFiles) {
  const unmatchedFiles = [];

  for (const fileList of fileIndex.values()) {
    for (const filePath of fileList) {
      if (!matchedFiles.has(filePath)) {
        unmatchedFiles.push(filePath);
      }
    }
  }

  return unmatchedFiles.sort();
}

/**
 * 汇总资产类型数量。
 * @param {Record<string, any>[]} assetRecords 资产记录
 * @returns {{assetType: string, count: number}[]}
 */
function summarizeAssetTypes(assetRecords) {
  const counter = new Map();

  for (const assetRecord of assetRecords) {
    const nextCount = (counter.get(assetRecord.assetType) || 0) + 1;
    counter.set(assetRecord.assetType, nextCount);
  }

  return Array.from(counter.entries())
    .map(function mapEntry(entry) {
      return {
        assetType: entry[0],
        count: entry[1]
      };
    })
    .sort(function sortEntry(left, right) {
      if (left.count !== right.count) {
        return right.count - left.count;
      }
      return left.assetType.localeCompare(right.assetType, 'zh-Hans-CN');
    });
}

/**
 * 组装全量报告载荷。
 * @param {Record<string, any>[]} bundleReports 分 bundle 报告
 * @returns {Record<string, any>}
 */
function buildUuidReportPayload(bundleReports) {
  const summary = {
    generatedAt: new Date().toISOString(),
    bundleCount: bundleReports.length,
    assetRecordCount: 0,
    uuidCount: 0,
    importFileCount: 0,
    nativeFileCount: 0,
    directImportFileCount: 0,
    packedImportAssetCount: 0,
    missingImportAssetCount: 0,
    nativeFileLinkedCount: 0,
    unmatchedImportFileCount: 0,
    unmatchedNativeFileCount: 0
  };

  for (const bundleReport of bundleReports) {
    summary.assetRecordCount += bundleReport.assetRecordCount;
    summary.uuidCount += bundleReport.uuidCount;
    summary.importFileCount += bundleReport.importFileCount;
    summary.nativeFileCount += bundleReport.nativeFileCount;
    summary.directImportFileCount += bundleReport.directImportFileCount;
    summary.packedImportAssetCount += bundleReport.packedImportAssetCount;
    summary.missingImportAssetCount += bundleReport.missingImportAssetCount;
    summary.nativeFileLinkedCount += bundleReport.nativeFileLinkedCount;
    summary.unmatchedImportFileCount += bundleReport.unmatchedImportFileCount;
    summary.unmatchedNativeFileCount += bundleReport.unmatchedNativeFileCount;
  }

  return {
    reportMode: {
      includeFullRecords: INCLUDE_FULL_RECORDS
    },
    summary: summary,
    bundles: bundleReports
  };
}

/**
 * 构建 Markdown 报告。
 * @param {{projectRoot: string}} layout 项目布局
 * @param {{summary: Record<string, any>, bundles: Record<string, any>[]}} reportPayload 报告载荷
 * @returns {string[]}
 */
function buildUuidReportMarkdownLines(layout, reportPayload) {
  const lines = [];
  const summary = reportPayload.summary;

  lines.push('# UUID 资产审计报告（自动生成）');
  lines.push('');
  lines.push('> 本文件由 `architecture/tools/generate-uuid-asset-report.js` 生成。');
  lines.push('');
  lines.push('## 总览');
  lines.push('- JSON 输出模式：`' + (reportPayload.reportMode.includeFullRecords ? 'full-records' : 'summary') + '`');
  lines.push('- 生成时间：' + summary.generatedAt);
  lines.push('- Bundle 数：' + summary.bundleCount);
  lines.push('- canonical 资产记录数：' + summary.assetRecordCount);
  lines.push('- config UUID 记录数：' + summary.uuidCount);
  lines.push('- import 编译文件数：' + summary.importFileCount);
  lines.push('- native 编译文件数：' + summary.nativeFileCount);
  lines.push('- 直连 import JSON：' + summary.directImportFileCount);
  lines.push('- pack 承载资产数：' + summary.packedImportAssetCount);
  lines.push('- 缺失 import JSON 映射：' + summary.missingImportAssetCount);
  lines.push('- 已命中 native 文件：' + summary.nativeFileLinkedCount);
  lines.push('- 未命中 import 文件：' + summary.unmatchedImportFileCount);
  lines.push('- 未命中 native 文件：' + summary.unmatchedNativeFileCount);
  lines.push('');
  lines.push('## 判读规则');
  lines.push('- `direct-import-json`：该 UUID 资产有独立 import 元数据文件，可直接映射到语义路径。');
  lines.push('- `packed-import-json`：该 UUID 资产被 pack 文件承载，没有独立 import JSON；这是 Cocos 的正常打包结果。');
  lines.push('- `missing-import-json`：配置路径存在，但未在当前 bundle import 目录里找到对应直连文件或 pack 文件，需要人工复核。');
  lines.push('- UUID 文件默认都视为运行时编译产物；在没有完整重建链路前，不直接改这些文件名。');
  lines.push('');
  lines.push('## 分 Bundle 摘要');
  lines.push('| Bundle | 资产数 | UUID 数 | import 文件 | native 文件 | pack 文件 | 缺失 import | 未命中 import | 未命中 native |');
  lines.push('| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');

  for (const bundleReport of reportPayload.bundles) {
    lines.push(
      '| `' + bundleReport.bundleName + '` | ' +
      bundleReport.assetRecordCount + ' | ' +
      bundleReport.uuidCount + ' | ' +
      bundleReport.importFileCount + ' | ' +
      bundleReport.nativeFileCount + ' | ' +
      bundleReport.packFileCount + ' | ' +
      bundleReport.missingImportAssetCount + ' | ' +
      bundleReport.unmatchedImportFileCount + ' | ' +
      bundleReport.unmatchedNativeFileCount + ' |'
    );
  }

  lines.push('');

  for (const bundleReport of reportPayload.bundles) {
    lines.push('## ' + bundleReport.bundleName);
    lines.push('- 配置：`' + formatProjectPathFromWorkspace(layout, bundleReport.configPath) + '`');
    lines.push('- 目录：`' + formatProjectPathFromWorkspace(layout, bundleReport.bundleDirectory) + '`');
    lines.push('- 资产记录：' + bundleReport.assetRecordCount);
    lines.push('- UUID 记录：' + bundleReport.uuidCount);
    lines.push('- 直连 import JSON：' + bundleReport.directImportFileCount);
    lines.push('- pack 承载资产：' + bundleReport.packedImportAssetCount);
    lines.push('- 缺失 import JSON：' + bundleReport.missingImportAssetCount);
    lines.push('- native 命中：' + bundleReport.nativeFileLinkedCount);

    if (bundleReport.typeSummary.length > 0) {
      lines.push('- 主要资产类型：' + bundleReport.typeSummary.slice(0, 8).map(function mapType(typeRecord) {
        return typeRecord.assetType + ' x ' + typeRecord.count;
      }).join('，'));
    }

    if (bundleReport.sampleAssetRecords.length > 0) {
      lines.push('- 样例资产映射：');
      for (const assetRecord of bundleReport.sampleAssetRecords.slice(0, 8)) {
        const detailParts = [
          '`' + assetRecord.canonicalPath + '`',
          assetRecord.assetType,
          assetRecord.importContainerKind
        ];
        if (assetRecord.importContainerRelativePath) {
          detailParts.push('import -> `' + assetRecord.importContainerRelativePath + '`');
        }
        if (assetRecord.nativeFileRelativePath) {
          detailParts.push('native -> `' + assetRecord.nativeFileRelativePath + '`');
        }
        if (assetRecord.importDisplayName) {
          detailParts.push('name -> `' + assetRecord.importDisplayName + '`');
        }
        lines.push('  - ' + detailParts.join(' / '));
      }
    }

    const packSamples = bundleReport.packRecords.filter(function filterPack(packRecord) {
      return typeof packRecord.importFileRelativePath === 'string' && packRecord.importFileRelativePath.length > 0;
    });
    if (packSamples.length > 0) {
      lines.push('- pack 文件样例：');
      for (const packRecord of packSamples.slice(0, 5)) {
        lines.push('  - `' + packRecord.packId + '` -> `' + packRecord.importFileRelativePath + '` / 资产数 ' + packRecord.assetCount);
      }
    }

    if (bundleReport.unmatchedImportFiles.length > 0) {
      lines.push('- 未命中 import 文件样例：' + bundleReport.unmatchedImportFiles.slice(0, 8).map(function mapFile(filePath) {
        return '`' + filePath + '`';
      }).join('，'));
      if (bundleReport.unmatchedImportFilesOmittedCount > 0) {
        lines.push('- 其余未命中 import 文件：' + bundleReport.unmatchedImportFilesOmittedCount + ' 项（仅在 full-records 模式写入 JSON）。');
      }
    }

    if (bundleReport.unmatchedNativeFiles.length > 0) {
      lines.push('- 未命中 native 文件样例：' + bundleReport.unmatchedNativeFiles.slice(0, 8).map(function mapFile(filePath) {
        return '`' + filePath + '`';
      }).join('，'));
      if (bundleReport.unmatchedNativeFilesOmittedCount > 0) {
        lines.push('- 其余未命中 native 文件：' + bundleReport.unmatchedNativeFilesOmittedCount + ' 项（仅在 full-records 模式写入 JSON）。');
      }
    }

    lines.push('');
  }

  lines.push('## 结果文件');
  lines.push('- Markdown：`' + formatProjectPathFromWorkspace(layout, UUID_REPORT_MARKDOWN_PATH) + '`');
  lines.push('- JSON：`' + formatProjectPathFromWorkspace(layout, UUID_REPORT_JSON_PATH) + '`');
  lines.push('');

  return lines;
}

/**
 * 输出报告文件。
 * @param {{projectRoot: string}} layout 项目布局
 * @param {Record<string, any>} reportPayload JSON 报告
 * @param {string[]} markdownLines Markdown 报告行
 */
function writeReportFiles(layout, reportPayload, markdownLines) {
  const markdownPath = resolveProjectFilePath(layout, UUID_REPORT_MARKDOWN_PATH);
  const jsonPath = resolveProjectFilePath(layout, UUID_REPORT_JSON_PATH);
  fs.writeFileSync(markdownPath, markdownLines.join('\n') + '\n');
  fs.writeFileSync(jsonPath, JSON.stringify(reportPayload, null, 2) + '\n');
}

/**
 * 解压 Cocos 压缩 UUID。
 * 若输入不是 22 位压缩串，则原样返回。
 * @param {string} compressedUuid 压缩 UUID
 * @returns {string}
 */
function decodeCompressedUuid(compressedUuid) {
  if (typeof compressedUuid !== 'string' || compressedUuid.length !== 22) {
    return compressedUuid;
  }

  UUID_TEMPLATE[0] = compressedUuid[0];
  UUID_TEMPLATE[1] = compressedUuid[1];

  for (let sourceIndex = 2, targetIndex = 2; sourceIndex < 22; sourceIndex += 2) {
    const leftValue = BASE64_VALUES[compressedUuid.charCodeAt(sourceIndex)];
    const rightValue = BASE64_VALUES[compressedUuid.charCodeAt(sourceIndex + 1)];

    UUID_TEMPLATE[++targetIndex] = HEX_CHARS[leftValue >> 2];
    UUID_TEMPLATE[++targetIndex] = HEX_CHARS[((leftValue & 3) << 2) | (rightValue >> 4)];
    UUID_TEMPLATE[++targetIndex] = HEX_CHARS[rightValue & 15];

    if (targetIndex === 8 || targetIndex === 13 || targetIndex === 18 || targetIndex === 23) {
      targetIndex += 1;
    }
  }

  return UUID_TEMPLATE.join('');
}

/**
 * 建立 Base64 字符值映射。
 * @returns {number[]}
 */
function createBase64ValueMap() {
  const valueMap = [];

  for (let index = 0; index < BASE64_KEY_CHARS.length; index += 1) {
    valueMap[BASE64_KEY_CHARS.charCodeAt(index)] = index;
  }

  return valueMap;
}

generateUuidAssetReport();
