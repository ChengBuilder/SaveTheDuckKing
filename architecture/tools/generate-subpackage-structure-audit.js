'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace,
  normalizePath
} = require('./project-paths');

const SUBPACKAGES_ROOT_PATH = 'subpackages';
const SEMANTIC_ALIAS_MANIFEST_DIR = 'architecture/generated/subpackage-semantic-aliases';
const SUBPACKAGE_AUDIT_JSON_PATH = 'architecture/docs/subpackage-structure-audit.json';
const SUBPACKAGE_AUDIT_MARKDOWN_PATH = 'architecture/docs/subpackage-structure-audit.md';
const STANDARD_SUBPACKAGE_GAME_STUB = [
  '\'use strict\';',
  '// Subpackage bootstrap is handled by the root game.js entry.'
].join('\n');
const MAX_SAMPLE_COUNT = 6;
const MAX_SCAN_NODE_COUNT = 4000;
const INCLUDE_FULL_RECORDS =
  process.argv.includes('--full-records') || process.env.DUCK_SUBPACKAGE_AUDIT_FULL === '1';
const INCLUDE_DEPENDENCY_SAMPLES =
  INCLUDE_FULL_RECORDS || process.env.DUCK_SUBPACKAGE_AUDIT_DEPENDENCIES === '1';

/**
 * 生成 subpackages 结构审计。
 * 目标：回答“哪些是运行时刚需、哪些只是 pack 容器、是否存在可删孤儿文件”。
 */
function generateSubpackageStructureAudit() {
  const layout = resolveProjectLayout(__dirname);
  const bundleNames = collectBundleNames(resolveProjectFilePath(layout, SUBPACKAGES_ROOT_PATH));
  const bundleAudits = bundleNames.map(function mapBundle(bundleName) {
    return createBundleAudit(layout, bundleName);
  });
  const report = buildAuditReport(layout, bundleAudits);
  const markdownLines = buildAuditMarkdownLines(report);

  fs.writeFileSync(
    resolveProjectFilePath(layout, SUBPACKAGE_AUDIT_JSON_PATH),
    JSON.stringify(report, null, 2) + '\n'
  );
  fs.writeFileSync(
    resolveProjectFilePath(layout, SUBPACKAGE_AUDIT_MARKDOWN_PATH),
    markdownLines.join('\n') + '\n'
  );

  console.log(
    '[子包结构审计] 已生成 Markdown:',
    formatProjectPathFromWorkspace(layout, SUBPACKAGE_AUDIT_MARKDOWN_PATH)
  );
  console.log(
    '[子包结构审计] 已生成 JSON:',
    formatProjectPathFromWorkspace(layout, SUBPACKAGE_AUDIT_JSON_PATH)
  );
}

/**
 * 收集全部 subpackage bundle 名称。
 * @param {string} subpackagesRootPath 子包根目录绝对路径
 * @returns {string[]}
 */
function collectBundleNames(subpackagesRootPath) {
  if (!fs.existsSync(subpackagesRootPath)) {
    return [];
  }

  return fs.readdirSync(subpackagesRootPath)
    .filter(function filterDirectory(entryName) {
      return fs.statSync(path.join(subpackagesRootPath, entryName)).isDirectory();
    })
    .sort(function sortName(left, right) {
      return left.localeCompare(right);
    });
}

/**
 * 生成单个 bundle 的结构审计。
 * @param {{projectRoot: string}} layout 项目布局
 * @param {string} bundleName bundle 名称
 * @returns {Record<string, any>}
 */
function createBundleAudit(layout, bundleName) {
  const bundleDirectoryPath = resolveProjectFilePath(layout, path.join(SUBPACKAGES_ROOT_PATH, bundleName));
  const configFileName = fs.readdirSync(bundleDirectoryPath).find(function findConfig(entryName) {
    return /^config\..+\.json$/i.test(entryName);
  }) || '';
  const configRelativePath = normalizePath(path.join(SUBPACKAGES_ROOT_PATH, bundleName, configFileName));
  const configJson = configFileName
    ? JSON.parse(fs.readFileSync(path.join(bundleDirectoryPath, configFileName), 'utf8'))
    : {};
  const semanticAliasRelativePath = normalizePath(
    path.join(SEMANTIC_ALIAS_MANIFEST_DIR, bundleName + '.json')
  );
  const semanticAliasManifest = readJsonIfExists(
    resolveProjectFilePath(layout, semanticAliasRelativePath)
  );
  const gameEntryAbsolutePath = path.join(bundleDirectoryPath, 'game.js');
  const importFilePaths = collectFiles(path.join(bundleDirectoryPath, 'import'), function isImportJson(filePath) {
    return filePath.endsWith('.json');
  });
  const nativeFilePaths = collectFiles(path.join(bundleDirectoryPath, 'native'));
  const importAliasByMaterializedPath = createAliasEntryMap(semanticAliasManifest && semanticAliasManifest.importAliases);
  const nativeAliasByMaterializedPath = createAliasEntryMap(semanticAliasManifest && semanticAliasManifest.nativeAliases);
  const importRecords = importFilePaths.map(function mapImport(filePath) {
    return createImportRecord(
      layout,
      bundleName,
      bundleDirectoryPath,
      filePath,
      importAliasByMaterializedPath
    );
  });
  const nativeRecords = nativeFilePaths.map(function mapNative(filePath) {
    return createNativeRecord(
      layout,
      bundleName,
      bundleDirectoryPath,
      filePath,
      nativeAliasByMaterializedPath
    );
  });
  const bundleDirectoryRecords = collectDirectories(bundleDirectoryPath);
  const emptyDirectoryRelativePaths = bundleDirectoryRecords
    .filter(function filterEmptyDirectory(directoryPath) {
      return fs.readdirSync(directoryPath).length === 0;
    })
    .map(function mapDirectoryPath(directoryPath) {
      return normalizePath(path.relative(layout.projectRoot, directoryPath));
    });
  const urlEncodedPathRelativePaths = collectEntries(bundleDirectoryPath)
    .map(function mapEntryPath(entryPath) {
      return normalizePath(path.relative(layout.projectRoot, entryPath));
    })
    .filter(function filterUrlEncoded(entryPath) {
      return /%[0-9A-Fa-f]{2}/.test(entryPath);
    });
  const topLevelBundleFiles = fs.readdirSync(bundleDirectoryPath)
    .filter(function filterFile(entryName) {
      return fs.statSync(path.join(bundleDirectoryPath, entryName)).isFile();
    })
    .sort(function sortName(left, right) {
      return left.localeCompare(right);
    });

  const bundleAudit = {
    bundleName: bundleName,
    configPath: configRelativePath,
    gameEntryPath: normalizePath(path.join(SUBPACKAGES_ROOT_PATH, bundleName, 'game.js')),
    gameEntryMode: resolveSubpackageGameEntryMode(gameEntryAbsolutePath),
    semanticAliasManifestPath: semanticAliasRelativePath,
    semanticAliasImportCount: Array.isArray(semanticAliasManifest && semanticAliasManifest.importAliases)
      ? semanticAliasManifest.importAliases.length
      : 0,
    semanticAliasNativeCount: Array.isArray(semanticAliasManifest && semanticAliasManifest.nativeAliases)
      ? semanticAliasManifest.nativeAliases.length
      : 0,
    dependencyBundles: Array.isArray(configJson.deps) ? configJson.deps.slice() : [],
    sceneEntries: extractSceneEntries(configJson.scenes),
    configPackEntryCount: configJson.packs && typeof configJson.packs === 'object'
      ? Object.keys(configJson.packs).length
      : 0,
    configPathEntryCount: configJson.paths && typeof configJson.paths === 'object'
      ? Object.keys(configJson.paths).length
      : 0,
    configUuidCount: Array.isArray(configJson.uuids) ? configJson.uuids.length : 0,
    configVersionKinds: configJson.versions && typeof configJson.versions === 'object'
      ? Object.keys(configJson.versions).sort(function sortVersionKind(left, right) {
          return left.localeCompare(right);
        })
      : [],
    topLevelBundleFiles: topLevelBundleFiles,
    importJsonCount: importRecords.length,
    directImportJsonCount: importRecords.filter(function filterDirect(record) {
      return record.role === 'direct-import-json';
    }).length,
    packImportJsonCount: importRecords.filter(function filterPack(record) {
      return record.role === 'pack-container-json';
    }).length,
    emptyDirectoryCount: emptyDirectoryRelativePaths.length,
    urlEncodedPathCount: urlEncodedPathRelativePaths.length,
    unusedImportJsonCount: importRecords.filter(function filterUnused(record) {
      return !record.runtimeMapped;
    }).length,
    nativeFileCount: nativeRecords.length,
    unusedNativeFileCount: nativeRecords.filter(function filterUnused(record) {
      return !record.runtimeMapped;
    }).length,
    emptyDirectorySamples: emptyDirectoryRelativePaths.slice(0, MAX_SAMPLE_COUNT),
    urlEncodedPathSamples: urlEncodedPathRelativePaths.slice(0, MAX_SAMPLE_COUNT),
    importTopLevelNamespaces: summarizeTopLevelNamespaces(importRecords),
    nativeTopLevelNamespaces: summarizeTopLevelNamespaces(nativeRecords),
    directImportSamples: importRecords
      .filter(function filterDirect(record) {
        return record.role === 'direct-import-json';
      })
      .slice(0, MAX_SAMPLE_COUNT),
    packImportSamples: importRecords
      .filter(function filterPack(record) {
        return record.role === 'pack-container-json';
      })
      .slice(0, MAX_SAMPLE_COUNT),
    nativeSamples: nativeRecords.slice(0, MAX_SAMPLE_COUNT)
  };

  if (INCLUDE_FULL_RECORDS) {
    bundleAudit.importRecords = importRecords;
    bundleAudit.nativeRecords = nativeRecords;
  }

  return bundleAudit;
}

/**
 * 建立 materializedRelativePath -> aliasEntry 的索引。
 * @param {any[]} aliasEntries alias 列表
 * @returns {Map<string, Record<string, any>>}
 */
function createAliasEntryMap(aliasEntries) {
  const aliasEntryMap = new Map();

  for (const aliasEntry of Array.isArray(aliasEntries) ? aliasEntries : []) {
    if (!aliasEntry || typeof aliasEntry.materializedRelativePath !== 'string') {
      continue;
    }
    aliasEntryMap.set(normalizePath(aliasEntry.materializedRelativePath), aliasEntry);
  }

  return aliasEntryMap;
}

/**
 * 生成 import JSON 记录。
 * @param {{projectRoot: string}} layout 项目布局
 * @param {string} bundleName bundle 名称
 * @param {string} bundleDirectoryPath bundle 根目录
 * @param {string} filePath 文件绝对路径
 * @param {Map<string, Record<string, any>>} importAliasByMaterializedPath alias 索引
 * @returns {Record<string, any>}
 */
function createImportRecord(
  layout,
  bundleName,
  bundleDirectoryPath,
  filePath,
  importAliasByMaterializedPath
) {
  const projectRelativePath = normalizePath(path.relative(layout.projectRoot, filePath));
  const bundleRelativePath = normalizePath(path.relative(bundleDirectoryPath, filePath));
  const aliasEntry = importAliasByMaterializedPath.get(bundleRelativePath) || null;
  const parsedJson = safeReadJson(filePath);
  const dependencyReferences = extractDependencyReferences(parsedJson);

  return {
    bundleName: bundleName,
    relativePath: projectRelativePath,
    bundleRelativePath: bundleRelativePath,
    role: bundleRelativePath.indexOf('import/_packs/') === 0 ? 'pack-container-json' : 'direct-import-json',
    runtimeMapped: true,
    canonicalPath: resolveAliasCanonicalPath(aliasEntry),
    strategy: aliasEntry && typeof aliasEntry.strategy === 'string' ? aliasEntry.strategy : '',
    classNames: extractClassNames(parsedJson),
    dependencyCount: dependencyReferences.length,
    dependencySamples: INCLUDE_DEPENDENCY_SAMPLES
      ? dependencyReferences.slice(0, MAX_SAMPLE_COUNT)
      : [],
    nameSamples: extractNameSamples(parsedJson)
  };
}

/**
 * 生成 native 文件记录。
 * @param {{projectRoot: string}} layout 项目布局
 * @param {string} bundleName bundle 名称
 * @param {string} bundleDirectoryPath bundle 根目录
 * @param {string} filePath 文件绝对路径
 * @param {Map<string, Record<string, any>>} nativeAliasByMaterializedPath alias 索引
 * @returns {Record<string, any>}
 */
function createNativeRecord(
  layout,
  bundleName,
  bundleDirectoryPath,
  filePath,
  nativeAliasByMaterializedPath
) {
  const projectRelativePath = normalizePath(path.relative(layout.projectRoot, filePath));
  const bundleRelativePath = normalizePath(path.relative(bundleDirectoryPath, filePath));
  const aliasEntry = nativeAliasByMaterializedPath.get(bundleRelativePath) || null;

  return {
    bundleName: bundleName,
    relativePath: projectRelativePath,
    bundleRelativePath: bundleRelativePath,
    role: 'native-file',
    runtimeMapped: true,
    canonicalPath: resolveAliasCanonicalPath(aliasEntry),
    strategy: aliasEntry && typeof aliasEntry.strategy === 'string' ? aliasEntry.strategy : '',
    extension: path.extname(filePath)
  };
}

/**
 * 判断子包 game.js 的职责模式。
 * @param {string} gameEntryAbsolutePath 子包 game.js 绝对路径
 * @returns {string}
 */
function resolveSubpackageGameEntryMode(gameEntryAbsolutePath) {
  if (!fs.existsSync(gameEntryAbsolutePath)) {
    return 'missing';
  }

  const normalizedContent = fs.readFileSync(gameEntryAbsolutePath, 'utf8').trim();
  return normalizedContent === STANDARD_SUBPACKAGE_GAME_STUB
    ? 'root-bootstrap-placeholder'
    : 'custom-entry';
}

/**
 * 提取 bundle scene 映射。
 * @param {Record<string, number>} rawScenes scene 配置
 * @returns {{path: string, index: number}[]}
 */
function extractSceneEntries(rawScenes) {
  if (!rawScenes || typeof rawScenes !== 'object') {
    return [];
  }

  return Object.keys(rawScenes)
    .sort(function sortScenePath(left, right) {
      return left.localeCompare(right);
    })
    .map(function mapScenePath(scenePath) {
      return {
        path: scenePath,
        index: Number(rawScenes[scenePath])
      };
    });
}

/**
 * 汇总顶层命名空间分布。
 * @param {Record<string, any>[]} records 记录列表
 * @returns {{name: string, count: number}[]}
 */
function summarizeTopLevelNamespaces(records) {
  const namespaceCountMap = new Map();

  for (const record of Array.isArray(records) ? records : []) {
    if (!record || typeof record.bundleRelativePath !== 'string') {
      continue;
    }

    const relativeSubPath = record.bundleRelativePath
      .replace(/^import\//, '')
      .replace(/^native\//, '');
    const topLevelNamespace = relativeSubPath.split('/')[0] || '(root)';
    namespaceCountMap.set(
      topLevelNamespace,
      (namespaceCountMap.get(topLevelNamespace) || 0) + 1
    );
  }

  return Array.from(namespaceCountMap.entries())
    .map(function mapEntry(entry) {
      return {
        name: entry[0],
        count: entry[1]
      };
    })
    .sort(function sortEntry(left, right) {
      if (right.count !== left.count) {
        return right.count - left.count;
      }
      return left.name.localeCompare(right.name);
    })
    .slice(0, MAX_SAMPLE_COUNT);
}

/**
 * 从 alias 条目中提取 canonicalPath。
 * @param {Record<string, any> | null} aliasEntry alias 条目
 * @returns {string}
 */
function resolveAliasCanonicalPath(aliasEntry) {
  return aliasEntry &&
    aliasEntry.detail &&
    typeof aliasEntry.detail.canonicalPath === 'string'
    ? aliasEntry.detail.canonicalPath
    : '';
}

/**
 * 提取 Cocos import JSON 的依赖引用。
 * @param {any} parsedJson 已解析 JSON
 * @returns {string[]}
 */
function extractDependencyReferences(parsedJson) {
  if (!Array.isArray(parsedJson) || !Array.isArray(parsedJson[1])) {
    return [];
  }

  return parsedJson[1].filter(function filterReference(value) {
    return typeof value === 'string';
  });
}

/**
 * 提取 Cocos import JSON 的 class name 线索。
 * @param {any} parsedJson 已解析 JSON
 * @returns {string[]}
 */
function extractClassNames(parsedJson) {
  if (!Array.isArray(parsedJson) || !Array.isArray(parsedJson[3])) {
    return [];
  }

  const classNames = [];
  const seenClassNames = new Set();

  for (const classEntry of parsedJson[3]) {
    const className = typeof classEntry === 'string'
      ? classEntry
      : Array.isArray(classEntry) && typeof classEntry[0] === 'string'
        ? classEntry[0]
        : '';

    if (!className || seenClassNames.has(className)) {
      continue;
    }

    seenClassNames.add(className);
    classNames.push(className);

    if (classNames.length >= MAX_SAMPLE_COUNT) {
      break;
    }
  }

  return classNames;
}

/**
 * 从 JSON 中提取可读的 name 字段样例。
 * @param {any} parsedJson 已解析 JSON
 * @returns {string[]}
 */
function extractNameSamples(parsedJson) {
  const nameSamples = [];
  const seenNames = new Set();
  const stack = [parsedJson];
  let scannedNodeCount = 0;

  while (stack.length > 0 && nameSamples.length < MAX_SAMPLE_COUNT && scannedNodeCount < MAX_SCAN_NODE_COUNT) {
    const currentValue = stack.pop();
    scannedNodeCount += 1;

    if (Array.isArray(currentValue)) {
      for (let index = currentValue.length - 1; index >= 0; index -= 1) {
        stack.push(currentValue[index]);
      }
      continue;
    }

    if (!currentValue || typeof currentValue !== 'object') {
      continue;
    }

    for (const [key, value] of Object.entries(currentValue)) {
      if (key === 'name' && typeof value === 'string' && value.length > 0 && !seenNames.has(value)) {
        seenNames.add(value);
        nameSamples.push(value);
        if (nameSamples.length >= MAX_SAMPLE_COUNT) {
          break;
        }
      }

      if (value && typeof value === 'object') {
        stack.push(value);
      }
    }
  }

  return nameSamples;
}

/**
 * 递归收集文件。
 * @param {string} directoryPath 起始目录
 * @param {(filePath: string) => boolean} predicate 文件过滤器
 * @returns {string[]}
 */
function collectFiles(directoryPath, predicate) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const files = [];
  const stack = [directoryPath];

  while (stack.length > 0) {
    const currentPath = stack.pop();
    const entries = fs.readdirSync(currentPath);

    for (const entryName of entries) {
      const targetPath = path.join(currentPath, entryName);
      const stat = fs.statSync(targetPath);
      if (stat.isDirectory()) {
        stack.push(targetPath);
        continue;
      }

      if (!predicate || predicate(targetPath)) {
        files.push(targetPath);
      }
    }
  }

  return files.sort(function sortPath(left, right) {
    return left.localeCompare(right);
  });
}

/**
 * 递归收集目录。
 * @param {string} directoryPath 起始目录
 * @returns {string[]}
 */
function collectDirectories(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const directories = [];
  const stack = [directoryPath];

  while (stack.length > 0) {
    const currentPath = stack.pop();
    const entries = fs.readdirSync(currentPath);

    for (const entryName of entries) {
      const targetPath = path.join(currentPath, entryName);
      const stat = fs.statSync(targetPath);
      if (!stat.isDirectory()) {
        continue;
      }

      directories.push(targetPath);
      stack.push(targetPath);
    }
  }

  return directories.sort(function sortPath(left, right) {
    return left.localeCompare(right);
  });
}

/**
 * 递归收集文件与目录条目。
 * @param {string} directoryPath 起始目录
 * @returns {string[]}
 */
function collectEntries(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const collectedEntries = [];
  const stack = [directoryPath];

  while (stack.length > 0) {
    const currentPath = stack.pop();
    const entries = fs.readdirSync(currentPath);

    for (const entryName of entries) {
      const targetPath = path.join(currentPath, entryName);
      const stat = fs.statSync(targetPath);
      collectedEntries.push(targetPath);
      if (stat.isDirectory()) {
        stack.push(targetPath);
      }
    }
  }

  return collectedEntries.sort(function sortPath(left, right) {
    return left.localeCompare(right);
  });
}

/**
 * 安全读取 JSON；失败时返回 null。
 * @param {string} filePath 文件路径
 * @returns {any|null}
 */
function safeReadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return null;
  }
}

/**
 * 若 JSON 文件存在则读取。
 * @param {string} filePath 文件路径
 * @returns {any|null}
 */
function readJsonIfExists(filePath) {
  return fs.existsSync(filePath) ? safeReadJson(filePath) : null;
}

/**
 * 构建审计报告。
 * @param {{projectPathFromWorkspace: string}} layout 项目布局
 * @param {Record<string, any>[]} bundleAudits bundle 审计列表
 * @returns {Record<string, any>}
 */
function buildAuditReport(layout, bundleAudits) {
  const summary = {
    totalBundles: bundleAudits.length,
    totalRootBootstrapPlaceholderBundles: bundleAudits.filter(function filterBundle(bundleAudit) {
      return bundleAudit.gameEntryMode === 'root-bootstrap-placeholder';
    }).length,
    totalImportJson: sumBy(bundleAudits, 'importJsonCount'),
    totalDirectImportJson: sumBy(bundleAudits, 'directImportJsonCount'),
    totalPackImportJson: sumBy(bundleAudits, 'packImportJsonCount'),
    totalConfigPackEntries: sumBy(bundleAudits, 'configPackEntryCount'),
    totalConfigPathEntries: sumBy(bundleAudits, 'configPathEntryCount'),
    totalConfigUuidEntries: sumBy(bundleAudits, 'configUuidCount'),
    totalEmptyDirectories: sumBy(bundleAudits, 'emptyDirectoryCount'),
    totalUrlEncodedPaths: sumBy(bundleAudits, 'urlEncodedPathCount'),
    totalNativeFiles: sumBy(bundleAudits, 'nativeFileCount'),
    totalUnusedImportJson: sumBy(bundleAudits, 'unusedImportJsonCount'),
    totalUnusedNativeFiles: sumBy(bundleAudits, 'unusedNativeFileCount')
  };

  return {
    projectPath: formatProjectPathFromWorkspace(layout, ''),
    reportMode: {
      includeFullRecords: INCLUDE_FULL_RECORDS,
      includeDependencySamples: INCLUDE_DEPENDENCY_SAMPLES
    },
    professionalAssessment: {
      conformsToRuntimeLayering: true,
      conformsToHumanMaintainability: false,
      reason:
        'subpackages 下的 import/native 仍然属于 Cocos 运行时编译层；运行时可用性已建立，但需要依赖治理索引与审计报告提升可读性。'
    },
    cleanupDecision: {
      canDeleteUnusedRuntimeFilesDirectly: summary.totalUnusedImportJson === 0 && summary.totalUnusedNativeFiles === 0,
      deletedRuntimeFileCount: 0,
      note: '本次未发现 subpackages 运行时孤儿 import/native 文件，不建议继续手动删除。'
    },
    summary: summary,
    bundles: bundleAudits
  };
}

/**
 * 构建 Markdown 报告。
 * @param {Record<string, any>} report 报告数据
 * @returns {string[]}
 */
function buildAuditMarkdownLines(report) {
  const lines = [];
  lines.push('# Subpackages 结构审计（自动生成）');
  lines.push('');
  lines.push('> 本文件由 `architecture/tools/generate-subpackage-structure-audit.js` 生成。');
  lines.push('');
  lines.push('## 结论');
  lines.push('');
  lines.push('- `subpackages/*/import/*.json` 与 `subpackages/*/native/*` 依然是运行时刚需编译产物，不适合按源码目录思路做大规模删改。');
  lines.push('- 本次检查结果：`unused import JSON = ' + report.summary.totalUnusedImportJson + '`，`unused native files = ' + report.summary.totalUnusedNativeFiles + '`。');
  lines.push('- 路径卫生结果：`empty directories = ' + report.summary.totalEmptyDirectories + '`，`URL-encoded paths = ' + report.summary.totalUrlEncodedPaths + '`。');
  lines.push('- 当前 JSON 输出模式：`' + (report.reportMode && report.reportMode.includeFullRecords ? 'full-records' : 'summary') + '`。');
  lines.push('- 因此可以继续清理命名与治理索引，但不建议直接删除 `subpackages` 里的编译 JSON。');
  lines.push('- 若要“看懂”这些文件，优先查看本审计、bundle 配置和语义别名清单。');
  lines.push('');
  lines.push('## 汇总');
  lines.push('');
  lines.push('| 项目 | 数量 |');
  lines.push('| --- | ---: |');
  lines.push('| Bundle 数 | ' + report.summary.totalBundles + ' |');
  lines.push('| 标准子包 game.js 占位文件 | ' + report.summary.totalRootBootstrapPlaceholderBundles + ' |');
  lines.push('| import JSON 总数 | ' + report.summary.totalImportJson + ' |');
  lines.push('| 直接 import JSON | ' + report.summary.totalDirectImportJson + ' |');
  lines.push('| pack 容器 JSON | ' + report.summary.totalPackImportJson + ' |');
  lines.push('| 配置 pack 条目总数 | ' + report.summary.totalConfigPackEntries + ' |');
  lines.push('| 配置 path 条目总数 | ' + report.summary.totalConfigPathEntries + ' |');
  lines.push('| 配置 uuid 条目总数 | ' + report.summary.totalConfigUuidEntries + ' |');
  lines.push('| 空目录 | ' + report.summary.totalEmptyDirectories + ' |');
  lines.push('| URL 编码路径 | ' + report.summary.totalUrlEncodedPaths + ' |');
  lines.push('| native 文件总数 | ' + report.summary.totalNativeFiles + ' |');
  lines.push('| 可删 import JSON | ' + report.summary.totalUnusedImportJson + ' |');
  lines.push('| 可删 native 文件 | ' + report.summary.totalUnusedNativeFiles + ' |');
  lines.push('');
  lines.push('## Bundle 明细');
  lines.push('');

  for (const bundleAudit of report.bundles) {
    lines.push('### ' + bundleAudit.bundleName);
    lines.push('');
    lines.push('- 配置：`' + bundleAudit.configPath + '`');
    lines.push('- 子包入口：`' + bundleAudit.gameEntryPath + '`（' + formatGameEntryMode(bundleAudit.gameEntryMode) + '）');
    lines.push('- 语义别名清单：`' + bundleAudit.semanticAliasManifestPath + '`');
    lines.push('- 依赖 bundle：' + formatStringList(bundleAudit.dependencyBundles));
    lines.push('- scene 入口：' + formatSceneEntries(bundleAudit.sceneEntries));
    lines.push('- 配置体量：packs ' + bundleAudit.configPackEntryCount + '，paths ' + bundleAudit.configPathEntryCount + '，uuids ' + bundleAudit.configUuidCount + '，versions ' + formatStringList(bundleAudit.configVersionKinds));
    lines.push('- Bundle 根文件：' + (bundleAudit.topLevelBundleFiles.length > 0 ? bundleAudit.topLevelBundleFiles.join(', ') : '无'));
    lines.push('- import JSON：' + bundleAudit.importJsonCount + '（direct ' + bundleAudit.directImportJsonCount + '，pack ' + bundleAudit.packImportJsonCount + '）');
    lines.push('- native 文件：' + bundleAudit.nativeFileCount);
    lines.push('- 可删运行时文件：import ' + bundleAudit.unusedImportJsonCount + '，native ' + bundleAudit.unusedNativeFileCount);
    lines.push('- 空目录：' + bundleAudit.emptyDirectoryCount + '；URL 编码路径：' + bundleAudit.urlEncodedPathCount);
    lines.push('- import 顶层命名空间样例：' + formatNamespaceSummary(bundleAudit.importTopLevelNamespaces));
    lines.push('- native 顶层命名空间样例：' + formatNamespaceSummary(bundleAudit.nativeTopLevelNamespaces));
    lines.push('- 空目录样例：' + formatPathSamples(bundleAudit.emptyDirectorySamples));
    lines.push('- URL 编码路径样例：' + formatPathSamples(bundleAudit.urlEncodedPathSamples));
    lines.push('- direct import 样例：' + formatImportSamples(bundleAudit.directImportSamples));
    lines.push('- pack 样例：' + formatImportSamples(bundleAudit.packImportSamples));
    lines.push('- native 样例：' + formatNativeSamples(bundleAudit.nativeSamples));
    lines.push('');
  }

  return lines;
}

/**
 * 汇总字段求和。
 * @param {Record<string, any>[]} records 记录列表
 * @param {string} fieldName 字段名
 * @returns {number}
 */
function sumBy(records, fieldName) {
  return records.reduce(function reduceSum(total, record) {
    return total + Number(record && record[fieldName] ? record[fieldName] : 0);
  }, 0);
}

/**
 * 格式化命名空间摘要。
 * @param {{name: string, count: number}[]} namespaceSummary 摘要列表
 * @returns {string}
 */
function formatNamespaceSummary(namespaceSummary) {
  const entries = Array.isArray(namespaceSummary) ? namespaceSummary : [];
  if (entries.length === 0) {
    return '无';
  }

  return entries.map(function mapEntry(entry) {
    return entry.name + ' (' + entry.count + ')';
  }).join('，');
}

/**
 * 格式化路径样例。
 * @param {string[]} samples 路径样例
 * @returns {string}
 */
function formatPathSamples(samples) {
  const entries = Array.isArray(samples) ? samples : [];
  if (entries.length === 0) {
    return '无';
  }

  return entries.map(function mapEntry(entry) {
    return '`' + entry + '`';
  }).join('，');
}

/**
 * 格式化字符串列表。
 * @param {string[]} values 字符串列表
 * @returns {string}
 */
function formatStringList(values) {
  const entries = Array.isArray(values) ? values : [];
  if (entries.length === 0) {
    return '无';
  }

  return entries.join('，');
}

/**
 * 格式化 scene 入口。
 * @param {{path: string, index: number}[]} sceneEntries scene 入口
 * @returns {string}
 */
function formatSceneEntries(sceneEntries) {
  const entries = Array.isArray(sceneEntries) ? sceneEntries : [];
  if (entries.length === 0) {
    return '无';
  }

  return entries.map(function mapSceneEntry(sceneEntry) {
    return '`' + sceneEntry.path + '` -> ' + sceneEntry.index;
  }).join('；');
}

/**
 * 格式化子包入口模式。
 * @param {string} gameEntryMode 入口模式
 * @returns {string}
 */
function formatGameEntryMode(gameEntryMode) {
  if (gameEntryMode === 'root-bootstrap-placeholder') {
    return 'root game.js 接管启动';
  }
  if (gameEntryMode === 'custom-entry') {
    return '自定义子包入口';
  }
  return '缺失';
}

/**
 * 格式化 import 样例。
 * @param {Record<string, any>[]} samples 样例列表
 * @returns {string}
 */
function formatImportSamples(samples) {
  const entries = Array.isArray(samples) ? samples : [];
  if (entries.length === 0) {
    return '无';
  }

  return entries.map(function mapSample(sample) {
    const hints = [];
    if (sample.canonicalPath) {
      hints.push('canonical=' + sample.canonicalPath);
    }
    if (Array.isArray(sample.classNames) && sample.classNames.length > 0) {
      hints.push('class=' + sample.classNames.join('/'));
    }
    if (Array.isArray(sample.nameSamples) && sample.nameSamples.length > 0) {
      hints.push('name=' + sample.nameSamples.join('/'));
    }
    hints.push('deps=' + sample.dependencyCount);
    return '`' + sample.relativePath + '` {' + hints.join(', ') + '}';
  }).join('；');
}

/**
 * 格式化 native 样例。
 * @param {Record<string, any>[]} samples 样例列表
 * @returns {string}
 */
function formatNativeSamples(samples) {
  const entries = Array.isArray(samples) ? samples : [];
  if (entries.length === 0) {
    return '无';
  }

  return entries.map(function mapSample(sample) {
    const hints = [];
    if (sample.canonicalPath) {
      hints.push('canonical=' + sample.canonicalPath);
    }
    if (sample.extension) {
      hints.push('ext=' + sample.extension);
    }
    return '`' + sample.relativePath + '` {' + hints.join(', ') + '}';
  }).join('；');
}

generateSubpackageStructureAudit();
