'use strict';

const fs = require('fs');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const AUDIO_BUNDLE_CONFIG_PATH = 'subpackages/audioBundle/config.audio-bundle.json';
const AUDIO_BUNDLE_IMPORT_DIR = 'subpackages/audioBundle/import';
const AUDIO_BUNDLE_SEMANTIC_ALIAS_PATH = 'architecture/generated/subpackage-semantic-aliases/audioBundle.json';
const AUDIO_USAGE_AUDIT_MARKDOWN_PATH = 'architecture/docs/audio-usage-audit.md';
const AUDIO_USAGE_AUDIT_JSON_PATH = 'architecture/docs/audio-usage-audit.json';
const LOW_READABILITY_ALLOWLIST = new Set([
  'bgm',
  'ui',
  'fx',
  'win',
  'fly',
  'eat',
  'pop'
]);

/**
 * 生成 audioBundle 使用审计。
 * 目标：自动识别直接引用、前缀动态引用和未引用候选，支撑后续音频语义化治理。
 */
function generateAudioUsageAudit() {
  const layout = resolveProjectLayout(__dirname);
  const gameJsText = fs.readFileSync(resolveProjectFilePath(layout, 'game.js'), 'utf8');
  const audioBundleConfig = JSON.parse(
    fs.readFileSync(resolveProjectFilePath(layout, AUDIO_BUNDLE_CONFIG_PATH), 'utf8')
  );
  const audioBundleImportDirPath = resolveProjectFilePath(layout, AUDIO_BUNDLE_IMPORT_DIR);
  const semanticAliasManifest = readJsonIfExists(
    resolveProjectFilePath(layout, AUDIO_BUNDLE_SEMANTIC_ALIAS_PATH)
  );
  const auditPayload = buildAudioUsageAuditPayload(
    gameJsText,
    audioBundleConfig,
    semanticAliasManifest,
    audioBundleImportDirPath
  );
  const markdownLines = buildAudioUsageAuditMarkdownLines(layout, auditPayload);

  fs.writeFileSync(
    resolveProjectFilePath(layout, AUDIO_USAGE_AUDIT_JSON_PATH),
    JSON.stringify(auditPayload, null, 2) + '\n'
  );
  fs.writeFileSync(
    resolveProjectFilePath(layout, AUDIO_USAGE_AUDIT_MARKDOWN_PATH),
    markdownLines.join('\n') + '\n'
  );

  console.log(
    '[音频使用审计] 已生成 Markdown:',
    formatProjectPathFromWorkspace(layout, AUDIO_USAGE_AUDIT_MARKDOWN_PATH)
  );
  console.log(
    '[音频使用审计] 已生成 JSON:',
    formatProjectPathFromWorkspace(layout, AUDIO_USAGE_AUDIT_JSON_PATH)
  );
}

/**
 * 构建音频使用审计载荷。
 * @param {string} gameJsText 主入口产物文本
 * @param {{paths?: Record<string, any>}} audioBundleConfig 音频 bundle 配置
 * @param {{importAliases?: {detail?: {canonicalPath?: string}}[]}|null} semanticAliasManifest 当前语义化别名清单
 * @param {string} audioBundleImportDirPath 当前 audioBundle import 目录绝对路径
 * @returns {{
 *  bundleName: string,
 *  totalAudioPaths: number,
 *  directReferenceCount: number,
 *  dynamicPrefixReferenceCount: number,
 *  directMatchCount: number,
 *  dynamicPrefixMatchCount: number,
 *  unreferencedCount: number,
 *  rootLevelCandidateCount: number,
 *  exactReferences: {method: string, value: string, count: number}[],
 *  prefixReferences: {method: string, value: string, count: number}[],
 *  unresolvedCandidates: {path: string, usageStatus: string, matchedBy: string[]}[],
 *  rootLevelCandidates: {path: string, usageStatus: string, matchedBy: string[], lowReadability: boolean}[],
 *  unreferencedPaths: string[],
 *  records: {path: string, usageStatus: string, matchedBy: string[], lowReadability: boolean}[]
 * }}
 */
function buildAudioUsageAuditPayload(
  gameJsText,
  audioBundleConfig,
  semanticAliasManifest,
  audioBundleImportDirPath
) {
  const collectedReferences = collectAudioReferences(gameJsText);
  const audioPaths = extractAudioPaths(
    audioBundleConfig.paths,
    semanticAliasManifest,
    audioBundleImportDirPath
  );
  const records = audioPaths.map(function mapAudioPath(audioPath) {
    return createAudioUsageRecord(audioPath, collectedReferences);
  });
  const unresolvedCandidates = records
    .filter(function filterCandidate(record) {
      return record.lowReadability;
    })
    .map(function mapCandidate(record) {
      return {
        path: record.path,
        usageStatus: record.usageStatus,
        matchedBy: record.matchedBy
      };
    });
  const rootLevelCandidates = records
    .filter(function filterRootLevel(record) {
      return isRootLevelAudioPath(record.path);
    })
    .map(function mapRootLevel(record) {
      return {
        path: record.path,
        usageStatus: record.usageStatus,
        matchedBy: record.matchedBy,
        lowReadability: record.lowReadability
      };
    });

  return {
    bundleName: String(audioBundleConfig.name || 'audioBundle'),
    totalAudioPaths: records.length,
    directReferenceCount: collectedReferences.exactReferences.length,
    dynamicPrefixReferenceCount: collectedReferences.prefixReferences.length,
    directMatchCount: records.filter(function filterDirect(record) {
      return record.usageStatus === 'direct';
    }).length,
    dynamicPrefixMatchCount: records.filter(function filterPrefix(record) {
      return record.usageStatus === 'dynamic-prefix';
    }).length,
    unreferencedCount: records.filter(function filterUnused(record) {
      return record.usageStatus === 'unreferenced';
    }).length,
    rootLevelCandidateCount: rootLevelCandidates.length,
    exactReferences: collectedReferences.exactReferences,
    prefixReferences: collectedReferences.prefixReferences,
    unresolvedCandidates: unresolvedCandidates,
    rootLevelCandidates: rootLevelCandidates,
    unreferencedPaths: records
      .filter(function filterUnused(record) {
        return record.usageStatus === 'unreferenced';
      })
      .map(function mapUnused(record) {
        return record.path;
      }),
    records: records
  };
}

/**
 * 提取 audioBundle 中的所有 canonical 路径。
 * @param {Record<string, any>} rawPaths bundle paths 字段
 * @param {{importAliases?: {detail?: {canonicalPath?: string}}[]}|null} semanticAliasManifest 当前语义化别名清单
 * @param {string} audioBundleImportDirPath 当前 audioBundle import 目录绝对路径
 * @returns {string[]}
 */
function extractAudioPaths(rawPaths, semanticAliasManifest, audioBundleImportDirPath) {
  const importDirectoryPaths = extractAudioPathsFromImportDirectory(audioBundleImportDirPath);
  if (importDirectoryPaths.length > 0) {
    return importDirectoryPaths;
  }

  const aliasPaths = extractAudioPathsFromSemanticAliases(semanticAliasManifest);
  if (aliasPaths.length > 0) {
    return aliasPaths;
  }

  if (!rawPaths || typeof rawPaths !== 'object') {
    return [];
  }

  return Object.keys(rawPaths)
    .sort(function sortKeys(left, right) {
      return Number(left) - Number(right);
    })
    .map(function mapKey(key) {
      const pathEntry = rawPaths[key];
      return Array.isArray(pathEntry) ? String(pathEntry[0]) : '';
    })
    .filter(Boolean);
}

/**
 * 从当前 import 目录提取真实音频路径。
 * @param {string} importDirPath 当前 audioBundle import 目录绝对路径
 * @returns {string[]}
 */
function extractAudioPathsFromImportDirectory(importDirPath) {
  if (!importDirPath || !fs.existsSync(importDirPath)) {
    return [];
  }

  const collectedPaths = [];
  walkDirectory(importDirPath, function visitFile(absolutePath) {
    if (!absolutePath.endsWith('.json')) {
      return;
    }

    const relativePath = absolutePath.slice(importDirPath.length + 1).replace(/\\/g, '/');
    if (!relativePath || relativePath.startsWith('__semantic__/')) {
      return;
    }

    collectedPaths.push(relativePath.slice(0, -'.json'.length));
  });

  return collectedPaths.sort(function sortPath(left, right) {
    return left.localeCompare(right);
  });
}

/**
 * 从语义化别名清单提取当前有效 canonical 路径。
 * @param {{importAliases?: {detail?: {canonicalPath?: string}}[]}|null} semanticAliasManifest 当前语义化别名清单
 * @returns {string[]}
 */
function extractAudioPathsFromSemanticAliases(semanticAliasManifest) {
  if (!semanticAliasManifest || !Array.isArray(semanticAliasManifest.importAliases)) {
    return [];
  }

  const uniqueAudioPaths = new Set();

  for (const aliasEntry of semanticAliasManifest.importAliases) {
    const canonicalPath = aliasEntry
      && aliasEntry.detail
      && typeof aliasEntry.detail.canonicalPath === 'string'
      ? aliasEntry.detail.canonicalPath
      : '';
    if (canonicalPath) {
      uniqueAudioPaths.add(canonicalPath);
    }
  }

  return Array.from(uniqueAudioPaths).sort(function sortPath(left, right) {
    return left.localeCompare(right);
  });
}

/**
 * 若 JSON 文件存在则读取。
 * @param {string} filePath 文件绝对路径
 * @returns {any|null}
 */
function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * 递归遍历目录中的文件。
 * @param {string} directoryPath 目录绝对路径
 * @param {(filePath: string) => void} visitor 文件访问器
 */
function walkDirectory(directoryPath, visitor) {
  const childNames = fs.readdirSync(directoryPath);

  for (const childName of childNames) {
    const childPath = directoryPath + '/' + childName;
    const childStat = fs.statSync(childPath);
    if (childStat.isDirectory()) {
      walkDirectory(childPath, visitor);
      continue;
    }

    visitor(childPath);
  }
}

/**
 * 收集 `playSound/playMusic/playLongSound` 的字符串引用。
 * @param {string} gameJsText 主入口产物文本
 * @returns {{
 *  exactReferences: {method: string, value: string, count: number}[],
 *  prefixReferences: {method: string, value: string, count: number}[],
 *  exactReferenceMap: Map<string, string[]>,
 *  prefixReferenceMap: Map<string, string[]>
 * }}
 */
function collectAudioReferences(gameJsText) {
  const methodNames = ['playSound', 'playMusic', 'playLongSound'];
  const exactReferenceCounter = new Map();
  const prefixReferenceCounter = new Map();
  const exactReferenceMap = new Map();
  const prefixReferenceMap = new Map();

  for (const methodName of methodNames) {
    const referencePattern = new RegExp(methodName + '\\("([^"]+)"', 'g');
    let matchedReference = referencePattern.exec(gameJsText);

    while (matchedReference) {
      const referenceValue = matchedReference[1];
      const isPrefixReference = referenceValue.endsWith('/') || referenceValue.endsWith('_');

      if (isPrefixReference) {
        increaseReferenceCounter(prefixReferenceCounter, prefixReferenceMap, referenceValue, methodName);
      } else {
        increaseReferenceCounter(exactReferenceCounter, exactReferenceMap, referenceValue, methodName);
      }

      matchedReference = referencePattern.exec(gameJsText);
    }
  }

  return {
    exactReferences: mapReferenceCounter(exactReferenceCounter, exactReferenceMap),
    prefixReferences: mapReferenceCounter(prefixReferenceCounter, prefixReferenceMap),
    exactReferenceMap: exactReferenceMap,
    prefixReferenceMap: prefixReferenceMap
  };
}

/**
 * 增加引用计数。
 * @param {Map<string, number>} counter 引用计数器
 * @param {Map<string, string[]>} methodMap 引用方法映射
 * @param {string} referenceValue 引用值
 * @param {string} methodName 方法名
 */
function increaseReferenceCounter(counter, methodMap, referenceValue, methodName) {
  counter.set(referenceValue, (counter.get(referenceValue) || 0) + 1);

  const methodList = methodMap.get(referenceValue) || [];
  if (methodList.indexOf(methodName) < 0) {
    methodList.push(methodName);
  }
  methodMap.set(referenceValue, methodList);
}

/**
 * 将引用计数器映射为稳定数组。
 * @param {Map<string, number>} counter 引用计数器
 * @param {Map<string, string[]>} methodMap 引用方法映射
 * @returns {{method: string, value: string, count: number}[]}
 */
function mapReferenceCounter(counter, methodMap) {
  return Array.from(counter.entries())
    .map(function mapEntry(entry) {
      return {
        method: (methodMap.get(entry[0]) || []).join('/'),
        value: entry[0],
        count: entry[1]
      };
    })
    .sort(function sortEntry(left, right) {
      if (left.value !== right.value) {
        return left.value.localeCompare(right.value);
      }
      return left.method.localeCompare(right.method);
    });
}

/**
 * 生成单条音频路径使用记录。
 * @param {string} audioPath 音频 canonical 路径
 * @param {{
 *  exactReferenceMap: Map<string, string[]>,
 *  prefixReferenceMap: Map<string, string[]>
 * }} collectedReferences 已收集引用
 * @returns {{path: string, usageStatus: string, matchedBy: string[], lowReadability: boolean}}
 */
function createAudioUsageRecord(audioPath, collectedReferences) {
  const directMatchedMethods = collectedReferences.exactReferenceMap.get(audioPath) || [];
  const prefixMatchedBy = [];

  for (const entry of collectedReferences.prefixReferenceMap.entries()) {
    const prefixValue = entry[0];
    const methodNames = entry[1];
    if (audioPath.startsWith(prefixValue)) {
      prefixMatchedBy.push(prefixValue + ' <- ' + methodNames.join('/'));
    }
  }

  let usageStatus = 'unreferenced';
  let matchedBy = [];

  if (directMatchedMethods.length > 0) {
    usageStatus = 'direct';
    matchedBy = directMatchedMethods.map(function mapMethodName(methodName) {
      return audioPath + ' <- ' + methodName;
    });
  } else if (prefixMatchedBy.length > 0) {
    usageStatus = 'dynamic-prefix';
    matchedBy = prefixMatchedBy;
  }

  return {
    path: audioPath,
    usageStatus: usageStatus,
    matchedBy: matchedBy,
    lowReadability: isLowReadabilityAudioPath(audioPath)
  };
}

/**
 * 判断音频路径是否仍存在低可读命名。
 * @param {string} audioPath 音频路径
 * @returns {boolean}
 */
function isLowReadabilityAudioPath(audioPath) {
  return audioPath
    .split('/')
    .filter(Boolean)
    .some(function someSegment(pathSegment) {
      const normalizedSegment = pathSegment.toLowerCase();
      if (LOW_READABILITY_ALLOWLIST.has(normalizedSegment)) {
        return false;
      }
      return /^[a-z]{1,3}\d?$/i.test(pathSegment);
    });
}

/**
 * 判断音频路径是否仍停留在 bundle 根层。
 * @param {string} audioPath 音频路径
 * @returns {boolean}
 */
function isRootLevelAudioPath(audioPath) {
  return audioPath.indexOf('/') < 0;
}

/**
 * 构建 Markdown 审计报告。
 * @param {{projectPathFromWorkspace: string}} layout 项目布局
 * @param {ReturnType<typeof buildAudioUsageAuditPayload>} auditPayload 审计载荷
 * @returns {string[]}
 */
function buildAudioUsageAuditMarkdownLines(layout, auditPayload) {
  const lines = [];
  lines.push('# 音频使用审计（自动生成）');
  lines.push('');
  lines.push('> 本文件由 `architecture/tools/generate-audio-usage-audit.js` 生成。');
  lines.push('');
  lines.push('## 总览');
  lines.push('- Bundle：`' + auditPayload.bundleName + '`');
  lines.push('- 音频 canonical 路径数：' + auditPayload.totalAudioPaths);
  lines.push('- 直接引用条目数：' + auditPayload.directMatchCount);
  lines.push('- 动态前缀匹配条目数：' + auditPayload.dynamicPrefixMatchCount);
  lines.push('- 未引用候选数：' + auditPayload.unreferencedCount);
  lines.push('- 低可读命名候选数：' + auditPayload.unresolvedCandidates.length);
  lines.push('- 根层路径候选数：' + auditPayload.rootLevelCandidateCount);
  lines.push('');
  lines.push('## 直接引用');
  appendReferenceLines(lines, auditPayload.exactReferences);
  lines.push('');
  lines.push('## 动态前缀引用');
  appendReferenceLines(lines, auditPayload.prefixReferences);
  lines.push('');
  lines.push('## 根层路径候选');
  appendRootLevelLines(lines, auditPayload.rootLevelCandidates);
  lines.push('');
  lines.push('## 低可读命名候选');
  appendRecordLines(lines, auditPayload.unresolvedCandidates);
  lines.push('');
  lines.push('## 未引用候选');
  if (auditPayload.unreferencedPaths.length === 0) {
    lines.push('- 无');
  } else {
    for (const unreferencedPath of auditPayload.unreferencedPaths) {
      lines.push('- `' + unreferencedPath + '`');
    }
  }
  lines.push('');
  lines.push('## 结果文件');
  lines.push('- Markdown：`' + formatProjectPathFromWorkspace(layout, AUDIO_USAGE_AUDIT_MARKDOWN_PATH) + '`');
  lines.push('- JSON：`' + formatProjectPathFromWorkspace(layout, AUDIO_USAGE_AUDIT_JSON_PATH) + '`');
  lines.push('');

  return lines;
}

/**
 * 追加引用条目。
 * @param {string[]} lines 输出行
 * @param {{method: string, value: string, count: number}[]} references 引用条目
 */
function appendReferenceLines(lines, references) {
  if (!Array.isArray(references) || references.length === 0) {
    lines.push('- 无');
    return;
  }

  for (const reference of references) {
    lines.push('- `' + reference.value + '`：`' + reference.method + '` x ' + reference.count);
  }
}

/**
 * 追加记录条目。
 * @param {string[]} lines 输出行
 * @param {{path: string, usageStatus: string, matchedBy: string[]}[]} records 记录条目
 */
function appendRecordLines(lines, records) {
  if (!Array.isArray(records) || records.length === 0) {
    lines.push('- 无');
    return;
  }

  for (const record of records) {
    const matchedByText = record.matchedBy.length > 0 ? record.matchedBy.join('；') : '无';
    lines.push('- `' + record.path + '`：`' + record.usageStatus + '`，命中：' + matchedByText);
  }
}

/**
 * 追加根层候选条目。
 * @param {string[]} lines 输出行
 * @param {{path: string, usageStatus: string, matchedBy: string[], lowReadability: boolean}[]} records 记录条目
 */
function appendRootLevelLines(lines, records) {
  if (!Array.isArray(records) || records.length === 0) {
    lines.push('- 无');
    return;
  }

  for (const record of records) {
    const matchedByText = record.matchedBy.length > 0 ? record.matchedBy.join('；') : '无';
    const readabilityFlag = record.lowReadability ? '低可读' : '待分层';
    lines.push(
      '- `' +
        record.path +
        '`：`' +
        record.usageStatus +
        '` / `' +
        readabilityFlag +
        '`，命中：' +
        matchedByText
    );
  }
}

generateAudioUsageAudit();
