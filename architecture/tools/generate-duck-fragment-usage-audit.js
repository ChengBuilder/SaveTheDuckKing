'use strict';

const fs = require('fs');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const DUCK_BUNDLE_CONFIG_PATH = 'subpackages/DuckBundle/config.duck-bundle.json';
const FRAGMENT_USAGE_AUDIT_MARKDOWN_PATH = 'architecture/docs/duck-fragment-usage-audit.md';
const FRAGMENT_USAGE_AUDIT_JSON_PATH = 'architecture/docs/duck-fragment-usage-audit.json';
const SOURCE_FILE_PATHS = [
  'game.js',
  'restored/start-scene/Util.ts.restored.js',
  'restored/start-scene/Wood.ts.restored.js',
  'restored/start-scene/DuckController.ts.restored.js',
  'restored/start-scene/GameModel2.ts.restored.js'
];
const INFERRED_FRAGMENT_GROUP_BY_WOOD_DIRECTORY = Object.freeze({
  grayWood: 'b',
  lightWood: 'd',
  redWood: 'a',
  brownWood: 'c',
  goldWood: 'e'
});

/**
 * 生成 Duck 碎片使用审计。
 * 目标：把碎片组定义、静态调用、资源分组和木板颜色目录统一沉淀为可复查报告。
 */
function generateDuckFragmentUsageAudit() {
  const layout = resolveProjectLayout(__dirname);
  const duckBundleConfig = JSON.parse(
    fs.readFileSync(resolveProjectFilePath(layout, DUCK_BUNDLE_CONFIG_PATH), 'utf8')
  );
  const sourceFileReports = SOURCE_FILE_PATHS.map(function mapSourceFile(relativePath) {
    return analyzeSourceFile(layout, relativePath);
  });
  const auditPayload = buildAuditPayload(layout, duckBundleConfig, sourceFileReports);
  const markdownLines = buildAuditMarkdownLines(layout, auditPayload);

  fs.writeFileSync(
    resolveProjectFilePath(layout, FRAGMENT_USAGE_AUDIT_JSON_PATH),
    JSON.stringify(auditPayload, null, 2) + '\n'
  );
  fs.writeFileSync(
    resolveProjectFilePath(layout, FRAGMENT_USAGE_AUDIT_MARKDOWN_PATH),
    markdownLines.join('\n') + '\n'
  );

  console.log(
    '[Duck碎片审计] 已生成 Markdown:',
    formatProjectPathFromWorkspace(layout, FRAGMENT_USAGE_AUDIT_MARKDOWN_PATH)
  );
  console.log(
    '[Duck碎片审计] 已生成 JSON:',
    formatProjectPathFromWorkspace(layout, FRAGMENT_USAGE_AUDIT_JSON_PATH)
  );
}

/**
 * 分析单个源码文件中的 fragment 相关证据。
 * @param {{projectRoot: string}} layout 项目布局
 * @param {string} relativePath 项目内路径
 * @returns {{path: string, fragmentIdentifierCount: number, fragmentPathCount: number, definitionRecords: any[], staticCallSiteRecords: any[], woodDestroyRecords: any[], woodColorDirectoryRecords: any[]}}
 */
function analyzeSourceFile(layout, relativePath) {
  const text = fs.readFileSync(resolveProjectFilePath(layout, relativePath), 'utf8');
  const lines = text.split(/\r?\n/);
  const definitionRecords = [];
  const staticCallSiteRecords = [];
  const woodDestroyRecords = [];
  const woodColorDirectoryRecords = [];
  let fragmentIdentifierCount = 0;
  let fragmentPathCount = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const lineText = lines[index];
    const lineNumber = index + 1;

    fragmentIdentifierCount += countOccurrences(lineText, 'fragmentEffect');
    fragmentPathCount += countOccurrences(lineText, 'tex/fragment/');

    if (lineText.indexOf('fragmentEffect') >= 0) {
      const isDefinition = /fragmentEffect\s*=\s*function/.test(lineText) || /t\.fragmentEffect\s*=\s*function/.test(lineText);
      const isCallSite = lineText.indexOf('.fragmentEffect(') >= 0
        || lineText.indexOf('["fragmentEffect"](') >= 0
        || lineText.indexOf("['fragmentEffect'](") >= 0
        || (/fragmentEffect\(/.test(lineText) && !isDefinition);

      if (isDefinition) {
        definitionRecords.push(createOccurrenceRecord(relativePath, lineNumber, lineText));
      }
      if (isCallSite) {
        staticCallSiteRecords.push(createOccurrenceRecord(relativePath, lineNumber, lineText));
      }
    }

    if (relativePath.indexOf('Wood.ts') >= 0) {
      if (lineText.indexOf('this.node.worldPosition.y<=200') >= 0 || lineText.indexOf('this.node.worldPosition.y <= 200') >= 0) {
        woodDestroyRecords.push(createOccurrenceRecord(relativePath, lineNumber, lineText));
      }
      if (lineText.indexOf('node.destroy()') >= 0) {
        woodDestroyRecords.push(createOccurrenceRecord(relativePath, lineNumber, lineText));
      }
    }

    if (lineText.indexOf('woodColorArr=') >= 0 || lineText.indexOf('woodColorArr =') >= 0) {
      woodColorDirectoryRecords.push(createOccurrenceRecord(relativePath, lineNumber, lineText));
    }
  }

  return {
    path: relativePath,
    fragmentIdentifierCount: fragmentIdentifierCount,
    fragmentPathCount: fragmentPathCount,
    definitionRecords: definitionRecords,
    staticCallSiteRecords: staticCallSiteRecords,
    woodDestroyRecords: dedupeOccurrenceRecords(woodDestroyRecords),
    woodColorDirectoryRecords: woodColorDirectoryRecords
  };
}

/**
 * 构建完整审计载荷。
 * @param {{paths?: Record<string, any>}} duckBundleConfig DuckBundle canonical 配置
 * @param {ReturnType<typeof analyzeSourceFile>[]} sourceFileReports 源码报告
 * @returns {Record<string, any>}
 */
function buildAuditPayload(layout, duckBundleConfig, sourceFileReports) {
  const fragmentAssetGroups = collectFragmentAssetGroups(duckBundleConfig.paths);
  const woodTextureDirectories = collectWoodTextureDirectories(duckBundleConfig.paths);
  const woodColorDirectoriesFromRuntime = extractWoodColorDirectoriesFromRuntime(layout, sourceFileReports);
  const allDefinitionRecords = flattenOccurrenceRecords(sourceFileReports, 'definitionRecords');
  const allStaticCallSiteRecords = flattenOccurrenceRecords(sourceFileReports, 'staticCallSiteRecords');
  const allWoodDestroyRecords = flattenOccurrenceRecords(sourceFileReports, 'woodDestroyRecords');
  const conclusion = resolveAuditConclusion(allDefinitionRecords, allStaticCallSiteRecords, allWoodDestroyRecords);

  return {
    generatedAt: new Date().toISOString(),
    bundleName: String(duckBundleConfig.name || 'DuckBundle'),
    scannedSourceFileCount: sourceFileReports.length,
    fragmentDefinitionCount: allDefinitionRecords.length,
    staticCallSiteCount: allStaticCallSiteRecords.length,
    fragmentAssetGroupCount: fragmentAssetGroups.length,
    fragmentAssetPathCount: fragmentAssetGroups.reduce(function countTotal(totalCount, groupRecord) {
      return totalCount + groupRecord.assetPaths.length;
    }, 0),
    woodTextureDirectoryCount: woodTextureDirectories.length,
    woodColorDirectoriesFromRuntimeCount: woodColorDirectoriesFromRuntime.length,
    sourceFileReports: sourceFileReports,
    definitionRecords: allDefinitionRecords,
    staticCallSiteRecords: allStaticCallSiteRecords,
    woodDestroyRecords: allWoodDestroyRecords,
    fragmentAssetGroups: fragmentAssetGroups,
    woodTextureDirectories: woodTextureDirectories,
    woodColorDirectoriesFromRuntime: woodColorDirectoriesFromRuntime,
    inferredFragmentGroupByWoodDirectory: mapFragmentGroupsByWoodDirectory(),
    conclusion: conclusion
  };
}

/**
 * 汇总结论。
 * @param {any[]} definitionRecords 定义记录
 * @param {any[]} staticCallSiteRecords 调用记录
 * @param {any[]} woodDestroyRecords 木板销毁记录
 * @returns {{status: string, likelyDeadCode: boolean, summary: string, nextStep: string}}
 */
function resolveAuditConclusion(definitionRecords, staticCallSiteRecords, woodDestroyRecords) {
  if (definitionRecords.length === 0) {
    return {
      status: 'missing-definition',
      likelyDeadCode: false,
      summary: '未在扫描文件中找到 fragmentEffect 定义，当前证据不足。',
      nextStep: '继续扩大扫描范围，确认是否还有未还原的 bundle 或脚本片段。'
    };
  }

  if (staticCallSiteRecords.length === 0) {
    return {
      status: 'definition-only',
      likelyDeadCode: true,
      summary: '当前仅找到 fragmentEffect 定义，未找到任何静态调用点；同时 Wood 下落分支直接销毁节点，碎片特效高度疑似历史残留工具函数。',
      nextStep: '继续保持 tex/fragment/a..e 只做审计与语义推断，不直接 rename；若未来发现动态调用入口，再补兼容闭环。'
    };
  }

  if (woodDestroyRecords.length > 0) {
    return {
      status: 'callers-found-but-destroy-flow-still-direct',
      likelyDeadCode: false,
      summary: '已找到静态调用点，但木板下落销毁流程仍存在直接 destroy 分支，需要继续确认特效触发时机。',
      nextStep: '顺着静态调用点继续追 groupKey 生成来源，再决定是否做 canonical rename。'
    };
  }

  return {
    status: 'callers-found',
    likelyDeadCode: false,
    summary: '已找到 fragmentEffect 的静态调用点，可以继续追踪 groupKey 与颜色目录映射。',
    nextStep: '补全调用链与 groupKey 生成逻辑后，再推进 rename 与兼容规则。'
  };
}

/**
 * 汇总 occurrence 记录。
 * @param {ReturnType<typeof analyzeSourceFile>[]} sourceFileReports 源码报告
 * @param {'definitionRecords'|'staticCallSiteRecords'|'woodDestroyRecords'} key 记录字段
 * @returns {any[]}
 */
function flattenOccurrenceRecords(sourceFileReports, key) {
  const records = [];

  for (const report of sourceFileReports) {
    records.push.apply(records, report[key] || []);
  }

  return dedupeOccurrenceRecords(records);
}

/**
 * 从 canonical 配置里提取 fragment 资源组。
 * @param {Record<string, any>} rawPaths DuckBundle bundle paths
 * @returns {{groupKey: string, assetPaths: string[]}[]}
 */
function collectFragmentAssetGroups(rawPaths) {
  const groupMap = new Map();

  for (const canonicalPath of extractCanonicalPaths(rawPaths)) {
    const matchedGroup = /^tex\/fragment\/([^/]+)\//.exec(canonicalPath);
    if (!matchedGroup) {
      continue;
    }

    const groupKey = matchedGroup[1];
    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, []);
    }
    groupMap.get(groupKey).push(canonicalPath);
  }

  return Array.from(groupMap.entries())
    .map(function mapEntry(entry) {
      return {
        groupKey: entry[0],
        assetPaths: entry[1].sort()
      };
    })
    .sort(function sortGroup(left, right) {
      return left.groupKey.localeCompare(right.groupKey);
    });
}

/**
 * 从 canonical 配置里提取木板材质目录。
 * @param {Record<string, any>} rawPaths DuckBundle bundle paths
 * @returns {string[]}
 */
function collectWoodTextureDirectories(rawPaths) {
  const directorySet = new Set();

  for (const canonicalPath of extractCanonicalPaths(rawPaths)) {
    const matchedDirectory = /^tex\/wood\/([^/]+)\//.exec(canonicalPath);
    if (matchedDirectory) {
      directorySet.add(matchedDirectory[1]);
    }
  }

  return Array.from(directorySet).sort();
}

/**
 * 从运行时代码文本中提取木板颜色目录数组。
 * @param {ReturnType<typeof analyzeSourceFile>[]} sourceFileReports 源码报告
 * @returns {string[]}
 */
function extractWoodColorDirectoriesFromRuntime(layout, sourceFileReports) {
  const runtimeReport = sourceFileReports.find(function findReport(report) {
    return report.path === 'restored/start-scene/GameModel2.ts.restored.js';
  });

  if (!runtimeReport) {
    return [];
  }

  const runtimeText = fs.readFileSync(resolveProjectFilePath(layout, runtimeReport.path), 'utf8');
  const matchedArray = /woodColorArr\s*=\s*\[([^\]]+)\]/.exec(runtimeText);
  if (!matchedArray) {
    return [];
  }

  return matchedArray[1]
    .split(',')
    .map(function mapEntry(entryText) {
      return entryText.trim().replace(/^['"]|['"]$/g, '');
    })
    .filter(Boolean);
}

/**
 * 展开 canonical 路径列表。
 * @param {Record<string, any>} rawPaths bundle paths 字段
 * @returns {string[]}
 */
function extractCanonicalPaths(rawPaths) {
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
 * 生成 occurrence 记录。
 * @param {string} relativePath 文件路径
 * @param {number} lineNumber 行号
 * @param {string} lineText 行内容
 * @returns {{path: string, lineNumber: number, excerpt: string}}
 */
function createOccurrenceRecord(relativePath, lineNumber, lineText) {
  const excerpt = createFocusedExcerpt(String(lineText || ''));
  return {
    path: relativePath,
    lineNumber: lineNumber,
    excerpt: excerpt
  };
}

/**
 * 生成聚焦命中点的摘要，避免 `game.js` 单行过长时只截到无关片段。
 * @param {string} lineText 原始行文本
 * @returns {string}
 */
function createFocusedExcerpt(lineText) {
  const normalizedLineText = lineText.trim();
  const anchorTokens = [
    'fragmentEffect',
    'tex/fragment/',
    'this.node.worldPosition.y<=200',
    'this.node.worldPosition.y <= 200',
    'node.destroy()',
    'woodColorArr'
  ];

  let anchorIndex = -1;
  for (const anchorToken of anchorTokens) {
    const currentIndex = normalizedLineText.indexOf(anchorToken);
    if (currentIndex >= 0) {
      anchorIndex = currentIndex;
      break;
    }
  }

  if (anchorIndex < 0) {
    return normalizedLineText.slice(0, 220);
  }

  const excerptRadius = 110;
  const startIndex = Math.max(0, anchorIndex - excerptRadius);
  const endIndex = Math.min(normalizedLineText.length, anchorIndex + excerptRadius);
  const prefix = startIndex > 0 ? '...' : '';
  const suffix = endIndex < normalizedLineText.length ? '...' : '';
  return prefix + normalizedLineText.slice(startIndex, endIndex) + suffix;
}

/**
 * occurrence 去重。
 * @param {{path: string, lineNumber: number, excerpt: string}[]} records 原始记录
 * @returns {{path: string, lineNumber: number, excerpt: string}[]}
 */
function dedupeOccurrenceRecords(records) {
  const seenKeys = new Set();
  const dedupedRecords = [];

  for (const record of records) {
    const dedupeKey = record.path + '::' + record.lineNumber + '::' + record.excerpt;
    if (seenKeys.has(dedupeKey)) {
      continue;
    }
    seenKeys.add(dedupeKey);
    dedupedRecords.push(record);
  }

  return dedupedRecords;
}

/**
 * 统计子串出现次数。
 * @param {string} text 文本
 * @param {string} token 子串
 * @returns {number}
 */
function countOccurrences(text, token) {
  if (!text || !token) {
    return 0;
  }

  let count = 0;
  let searchIndex = text.indexOf(token);

  while (searchIndex >= 0) {
    count += 1;
    searchIndex = text.indexOf(token, searchIndex + token.length);
  }

  return count;
}

/**
 * 生成按木板目录反查的碎片组映射。
 * @returns {{woodDirectory: string, fragmentGroup: string, inferredRename: string}[]}
 */
function mapFragmentGroupsByWoodDirectory() {
  return Object.keys(INFERRED_FRAGMENT_GROUP_BY_WOOD_DIRECTORY)
    .sort()
    .map(function mapDirectory(woodDirectory) {
      return {
        woodDirectory: woodDirectory,
        fragmentGroup: INFERRED_FRAGMENT_GROUP_BY_WOOD_DIRECTORY[woodDirectory],
        inferredRename: woodDirectory + 'Fragments'
      };
    });
}

/**
 * 构建 Markdown 报告。
 * @param {{projectPathFromWorkspace: string}} layout 项目布局
 * @param {Record<string, any>} auditPayload 审计载荷
 * @returns {string[]}
 */
function buildAuditMarkdownLines(layout, auditPayload) {
  const lines = [];
  lines.push('# Duck Fragment 使用审计（自动生成）');
  lines.push('');
  lines.push('> 本文件由 `architecture/tools/generate-duck-fragment-usage-audit.js` 生成。');
  lines.push('');
  lines.push('## 总览');
  lines.push('- 生成时间：' + auditPayload.generatedAt);
  lines.push('- Bundle：`' + auditPayload.bundleName + '`');
  lines.push('- 扫描文件数：' + auditPayload.scannedSourceFileCount);
  lines.push('- `fragmentEffect` 定义数：' + auditPayload.fragmentDefinitionCount);
  lines.push('- `fragmentEffect` 静态调用数：' + auditPayload.staticCallSiteCount);
  lines.push('- 碎片组数量：' + auditPayload.fragmentAssetGroupCount);
  lines.push('- 碎片资源路径数：' + auditPayload.fragmentAssetPathCount);
  lines.push('- 木板贴图目录数：' + auditPayload.woodTextureDirectoryCount);
  lines.push('');
  lines.push('## 结论');
  lines.push('- 状态：`' + auditPayload.conclusion.status + '`');
  lines.push('- 高概率死代码：' + (auditPayload.conclusion.likelyDeadCode ? '是' : '否'));
  lines.push('- 结论摘要：' + auditPayload.conclusion.summary);
  lines.push('- 建议下一步：' + auditPayload.conclusion.nextStep);
  lines.push('');
  lines.push('## 定义与调用');
  if (auditPayload.definitionRecords.length === 0) {
    lines.push('- 未找到 `fragmentEffect` 定义。');
  } else {
    lines.push('- 定义位置：');
    for (const record of auditPayload.definitionRecords) {
      lines.push(
        '  - `' + record.path + ':' + record.lineNumber + '` -> `' + record.excerpt + '`'
      );
    }
  }
  if (auditPayload.staticCallSiteRecords.length === 0) {
    lines.push('- 未找到任何静态调用点（含 `game.js` 与已还原模块）。');
  } else {
    lines.push('- 静态调用位置：');
    for (const record of auditPayload.staticCallSiteRecords) {
      lines.push(
        '  - `' + record.path + ':' + record.lineNumber + '` -> `' + record.excerpt + '`'
      );
    }
  }
  lines.push('');
  lines.push('## 木板销毁线索');
  if (auditPayload.woodDestroyRecords.length === 0) {
    lines.push('- 未捕获到木板直接销毁线索。');
  } else {
    for (const record of auditPayload.woodDestroyRecords) {
      lines.push(
        '- `' + record.path + ':' + record.lineNumber + '` -> `' + record.excerpt + '`'
      );
    }
  }
  lines.push('');
  lines.push('## 碎片组清单');
  for (const groupRecord of auditPayload.fragmentAssetGroups) {
    const samplePaths = groupRecord.assetPaths.slice(0, 6).map(function mapPath(assetPath) {
      return '`' + assetPath + '`';
    }).join('、');
    lines.push(
      '- `' + groupRecord.groupKey + '`：共 ' + groupRecord.assetPaths.length + ' 条，样例：' + samplePaths
    );
  }
  lines.push('');
  lines.push('## 木板目录与推断映射');
  lines.push('- runtime `woodColorArr`：' + (auditPayload.woodColorDirectoriesFromRuntime.length > 0
    ? auditPayload.woodColorDirectoriesFromRuntime.map(function mapDir(directory) {
      return '`' + directory + '`';
    }).join('、')
    : '未解析到'));
  lines.push('- canonical `tex/wood/*` 目录：' + auditPayload.woodTextureDirectories.map(function mapDir(directory) {
    return '`' + directory + '`';
  }).join('、'));
  for (const mappingRecord of auditPayload.inferredFragmentGroupByWoodDirectory) {
    lines.push(
      '- `' + mappingRecord.woodDirectory + '` -> `' + mappingRecord.fragmentGroup + '` -> `' + mappingRecord.inferredRename + '`'
    );
  }
  lines.push('');
  lines.push('## 扫描文件');
  for (const report of auditPayload.sourceFileReports) {
    lines.push(
      '- `' + report.path + '`：`fragmentEffect` token ' + report.fragmentIdentifierCount
      + ' 次，`tex/fragment/` token ' + report.fragmentPathCount + ' 次'
    );
  }
  lines.push('');
  lines.push('## 说明');
  lines.push('- 本报告只做静态扫描，不替代真机/DevTools 运行验证。');
  lines.push('- 当前更适合作为 rename 风险判断与 refined 还原的证据底稿。');
  lines.push('');

  return lines;
}

generateDuckFragmentUsageAudit();
