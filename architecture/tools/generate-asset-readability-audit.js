'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace,
  normalizePath
} = require('./project-paths');

const AUDIT_MARKDOWN_PATH = 'architecture/docs/asset-readability-audit.md';
const AUDIT_JSON_PATH = 'architecture/docs/asset-readability-audit.json';
const SEGMENT_ALLOWLIST = new Set([
  'db',
  'db:',
  'tex',
  'ui',
  'fx',
  'bgm',
  'audio',
  'prefab',
  'scene',
  'spriteframe',
  'spriteFrame',
  'skeleton',
  'texture',
  'main',
  'duck',
  'fruit',
  'game',
  'home',
  'resources',
  'internal',
  'start-scene',
  'comboMusic',
  'woodDrop',
  'particleEffects',
  'ribbonBurst',
  'multiTexture'
]);

/**
 * 生成全项目素材可读性审计。
 * 目标：持续暴露各 bundle 中“含义不明、缩写过度、中文/符号混杂”的 canonical 路径，
 * 为后续语义化 rename 提供稳定的下一步候选清单。
 */
function generateAssetReadabilityAudit() {
  const layout = resolveProjectLayout(__dirname);
  const bundleRecords = collectBundleRecords(layout);
  const auditPayload = buildAuditPayload(bundleRecords);
  const markdownLines = buildAuditMarkdownLines(auditPayload);

  fs.writeFileSync(
    resolveProjectFilePath(layout, AUDIT_JSON_PATH),
    JSON.stringify(auditPayload, null, 2) + '\n'
  );
  fs.writeFileSync(
    resolveProjectFilePath(layout, AUDIT_MARKDOWN_PATH),
    markdownLines.join('\n') + '\n'
  );

  console.log(
    '[素材可读性审计] 已生成 Markdown:',
    formatProjectPathFromWorkspace(layout, AUDIT_MARKDOWN_PATH)
  );
  console.log(
    '[素材可读性审计] 已生成 JSON:',
    formatProjectPathFromWorkspace(layout, AUDIT_JSON_PATH)
  );
}

/**
 * 收集所有语义化 bundle 配置。
 * @param {{projectRoot: string}} layout 项目布局
 * @returns {{bundleId: string, configPath: string, assetPaths: string[]}[]}
 */
function collectBundleRecords(layout) {
  const configFilePaths = [];
  configFilePaths.push.apply(configFilePaths, collectConfigFiles(resolveProjectFilePath(layout, 'assets')));
  configFilePaths.push.apply(configFilePaths, collectConfigFiles(resolveProjectFilePath(layout, 'subpackages')));

  return configFilePaths
    .sort()
    .map(function mapConfigFilePath(configFilePath) {
      const configJson = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
      return {
        bundleId: String(configJson.name || path.basename(path.dirname(configFilePath))),
        configPath: normalizePath(path.relative(layout.projectRoot, configFilePath)),
        assetPaths: extractAssetPaths(configJson.paths)
      };
    });
}

/**
 * 递归收集语义化配置文件。
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

    if (
      directoryEntry.isFile() &&
      /^config\.[a-z0-9-]+\.json$/i.test(directoryEntry.name)
    ) {
      collectedFilePaths.push(targetPath);
    }
  }

  return collectedFilePaths;
}

/**
 * 提取配置中的 canonical 路径。
 * @param {Record<string, any>} rawPaths 原始 paths 字段
 * @returns {string[]}
 */
function extractAssetPaths(rawPaths) {
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
 * 构建审计载荷。
 * @param {{bundleId: string, configPath: string, assetPaths: string[]}[]} bundleRecords bundle 记录
 * @returns {any}
 */
function buildAuditPayload(bundleRecords) {
  const bundleSummaries = [];
  const globalCandidates = [];
  let totalAssetPaths = 0;

  for (const bundleRecord of bundleRecords) {
    const candidateRecords = bundleRecord.assetPaths
      .map(function mapAssetPath(assetPath) {
        return analyzeAssetPath(bundleRecord.bundleId, assetPath);
      })
      .filter(function filterCandidate(record) {
        return record.score > 0;
      });

    totalAssetPaths += bundleRecord.assetPaths.length;
    globalCandidates.push.apply(globalCandidates, candidateRecords);
    bundleSummaries.push(buildBundleSummary(bundleRecord, candidateRecords));
  }

  const highSeverityCount = globalCandidates.filter(isHighSeverityCandidate).length;
  const mediumSeverityCount = globalCandidates.filter(isMediumSeverityCandidate).length;
  const lowSeverityCount = globalCandidates.filter(isLowSeverityCandidate).length;

  return {
    generatedAt: new Date().toISOString(),
    bundleCount: bundleRecords.length,
    totalAssetPaths: totalAssetPaths,
    candidateCount: globalCandidates.length,
    highSeverityCount: highSeverityCount,
    mediumSeverityCount: mediumSeverityCount,
    lowSeverityCount: lowSeverityCount,
    topCandidates: globalCandidates
      .slice()
      .sort(compareCandidateRecord)
      .slice(0, 80),
    bundles: bundleSummaries.sort(function sortBundleSummary(left, right) {
      if (left.candidateCount !== right.candidateCount) {
        return right.candidateCount - left.candidateCount;
      }
      return left.bundleId.localeCompare(right.bundleId, 'zh-Hans-CN');
    })
  };
}

/**
 * 分析单条资源路径。
 * @param {string} bundleId bundle 名
 * @param {string} assetPath 资源路径
 * @returns {{bundleId: string, path: string, score: number, severity: string, issues: {segment: string, type: string, score: number, reason: string}[]}}
 */
function analyzeAssetPath(bundleId, assetPath) {
  const pathSegments = assetPath.split('/').filter(Boolean);
  const issues = [];

  for (const segment of pathSegments) {
    issues.push.apply(issues, analyzeSegment(segment));
  }

  const totalScore = issues.reduce(function sumScore(result, issue) {
    return result + issue.score;
  }, 0);

  return {
    bundleId: bundleId,
    path: assetPath,
    score: totalScore,
    severity: resolveSeverity(totalScore),
    issues: issues
  };
}

/**
 * 分析单个路径片段。
 * @param {string} segment 路径片段
 * @returns {{segment: string, type: string, score: number, reason: string}[]}
 */
function analyzeSegment(segment) {
  const normalizedSegment = String(segment || '');
  const loweredSegment = normalizedSegment.toLowerCase();
  const issues = [];

  if (SEGMENT_ALLOWLIST.has(normalizedSegment) || SEGMENT_ALLOWLIST.has(loweredSegment)) {
    return issues;
  }

  if (/%[0-9a-f]{1,2}/i.test(normalizedSegment)) {
    issues.push({
      segment: normalizedSegment,
      type: 'encoded-symbol',
      score: 4,
      reason: '片段包含 `%` 编码或符号残留，通常是高优先级清理对象'
    });
  }

  if (/[^\x00-\x7F]/.test(normalizedSegment)) {
    issues.push({
      segment: normalizedSegment,
      type: 'non-ascii',
      score: 1,
      reason: '片段包含非 ASCII 字符，适合后续按规范统一目录语言'
    });
  }

  if (/^[a-z]{1,2}$/i.test(normalizedSegment)) {
    issues.push({
      segment: normalizedSegment,
      type: 'short-opaque-token',
      score: 4,
      reason: '片段过短且缺少语义，通常属于缩写或临时命名'
    });
  }

  if (/^[a-z]{1,2}\d+$/i.test(normalizedSegment)) {
    issues.push({
      segment: normalizedSegment,
      type: 'short-indexed-token',
      score: 3,
      reason: '片段为“短缩写 + 序号”模式，可读性低且难以长期维护'
    });
  }

  if (/^[a-z]{1,3}_[a-z0-9]+$/i.test(normalizedSegment) && normalizedSegment.length <= 8) {
    issues.push({
      segment: normalizedSegment,
      type: 'compact-underscored-token',
      score: 2,
      reason: '片段较短且由压缩缩写拼接，建议结合上下文展开语义'
    });
  }

  return dedupeIssues(issues);
}

/**
 * 去重片段问题列表。
 * @param {{segment: string, type: string, score: number, reason: string}[]} issues 问题列表
 * @returns {{segment: string, type: string, score: number, reason: string}[]}
 */
function dedupeIssues(issues) {
  const issueMap = new Map();

  for (const issue of issues) {
    const issueKey = issue.segment + '::' + issue.type;
    if (!issueMap.has(issueKey)) {
      issueMap.set(issueKey, issue);
    }
  }

  return Array.from(issueMap.values());
}

/**
 * 组装单个 bundle 的摘要。
 * @param {{bundleId: string, configPath: string, assetPaths: string[]}} bundleRecord bundle 记录
 * @param {{bundleId: string, path: string, score: number, severity: string, issues: any[]}[]} candidateRecords 命中候选
 * @returns {any}
 */
function buildBundleSummary(bundleRecord, candidateRecords) {
  const segmentCounter = new Map();

  for (const candidateRecord of candidateRecords) {
    for (const issue of candidateRecord.issues) {
      segmentCounter.set(issue.segment, (segmentCounter.get(issue.segment) || 0) + 1);
    }
  }

  return {
    bundleId: bundleRecord.bundleId,
    configPath: bundleRecord.configPath,
    assetCount: bundleRecord.assetPaths.length,
    candidateCount: candidateRecords.length,
    highSeverityCount: candidateRecords.filter(isHighSeverityCandidate).length,
    mediumSeverityCount: candidateRecords.filter(isMediumSeverityCandidate).length,
    lowSeverityCount: candidateRecords.filter(isLowSeverityCandidate).length,
    noisySegments: Array.from(segmentCounter.entries())
      .map(function mapEntry(entry) {
        return {
          segment: entry[0],
          count: entry[1]
        };
      })
      .sort(function sortEntry(left, right) {
        if (left.count !== right.count) {
          return right.count - left.count;
        }
        return left.segment.localeCompare(right.segment, 'zh-Hans-CN');
      })
      .slice(0, 10),
    sampleCandidates: candidateRecords
      .slice()
      .sort(compareCandidateRecord)
      .slice(0, 12)
  };
}

/**
 * 构建 Markdown 输出。
 * @param {any} auditPayload 审计载荷
 * @returns {string[]}
 */
function buildAuditMarkdownLines(auditPayload) {
  const lines = [];
  lines.push('# 素材可读性审计（自动生成）');
  lines.push('');
  lines.push('> 本文件由 `architecture/tools/generate-asset-readability-audit.js` 生成。');
  lines.push('');
  lines.push('## 总览');
  lines.push('- 生成时间：' + auditPayload.generatedAt);
  lines.push('- Bundle 数：' + auditPayload.bundleCount);
  lines.push('- 扫描 canonical 路径数：' + auditPayload.totalAssetPaths);
  lines.push('- 命中候选数：' + auditPayload.candidateCount);
  lines.push('- 高优先级候选数：' + auditPayload.highSeverityCount);
  lines.push('- 中优先级候选数：' + auditPayload.mediumSeverityCount);
  lines.push('- 低优先级候选数：' + auditPayload.lowSeverityCount);
  lines.push('');
  lines.push('## 全局高优先级候选');

  const highPriorityCandidates = auditPayload.topCandidates.filter(isHighSeverityCandidate);
  if (highPriorityCandidates.length === 0) {
    lines.push('- 无');
  } else {
    for (const candidate of highPriorityCandidates.slice(0, 30)) {
      lines.push(
        '- `[' +
          candidate.bundleId +
          '] ' +
          candidate.path +
          '`：' +
          formatIssueSummary(candidate.issues)
      );
    }
  }

  lines.push('');
  lines.push('## 分 Bundle 摘要');
  lines.push('| Bundle | 资产数 | 命中数 | 高优先级 | 高频问题片段 |');
  lines.push('| --- | ---: | ---: | ---: | --- |');
  for (const bundleSummary of auditPayload.bundles) {
    lines.push(
      '| `' +
        bundleSummary.bundleId +
        '` | ' +
        bundleSummary.assetCount +
        ' | ' +
        bundleSummary.candidateCount +
        ' | ' +
        bundleSummary.highSeverityCount +
        ' | ' +
        formatNoisySegments(bundleSummary.noisySegments) +
        ' |'
    );
  }

  lines.push('');
  lines.push('## 分 Bundle 详情');
  for (const bundleSummary of auditPayload.bundles) {
    lines.push('');
    lines.push('### ' + bundleSummary.bundleId);
    lines.push('- 配置：`' + bundleSummary.configPath + '`');
    lines.push('- 资产路径数：' + bundleSummary.assetCount);
    lines.push('- 命中候选：' + bundleSummary.candidateCount);
    lines.push('- 高/中/低优先级：' + bundleSummary.highSeverityCount + ' / ' + bundleSummary.mediumSeverityCount + ' / ' + bundleSummary.lowSeverityCount);
    lines.push('- 高频问题片段：' + formatNoisySegments(bundleSummary.noisySegments));
    lines.push('- 样例候选：');

    if (bundleSummary.sampleCandidates.length === 0) {
      lines.push('  - 无');
      continue;
    }

    for (const candidate of bundleSummary.sampleCandidates) {
      lines.push('  - `' + candidate.path + '`：' + formatIssueSummary(candidate.issues));
    }
  }

  lines.push('');
  lines.push('## 结果文件');
  lines.push('- Markdown：`' + AUDIT_MARKDOWN_PATH + '`');
  lines.push('- JSON：`' + AUDIT_JSON_PATH + '`');
  lines.push('');

  return lines;
}

/**
 * 比较候选优先级。
 * @param {{score: number, issues: any[], path: string, bundleId: string}} left 左值
 * @param {{score: number, issues: any[], path: string, bundleId: string}} right 右值
 * @returns {number}
 */
function compareCandidateRecord(left, right) {
  if (left.score !== right.score) {
    return right.score - left.score;
  }
  if (left.issues.length !== right.issues.length) {
    return right.issues.length - left.issues.length;
  }
  if (left.bundleId !== right.bundleId) {
    return left.bundleId.localeCompare(right.bundleId, 'zh-Hans-CN');
  }
  return left.path.localeCompare(right.path, 'zh-Hans-CN');
}

/**
 * 判定候选优先级文本。
 * @param {number} score 分数
 * @returns {string}
 */
function resolveSeverity(score) {
  if (score >= 4) {
    return 'high';
  }
  if (score >= 2) {
    return 'medium';
  }
  if (score >= 1) {
    return 'low';
  }
  return 'none';
}

/**
 * 判定是否为高优先级候选。
 * @param {{severity: string}} candidate 候选
 * @returns {boolean}
 */
function isHighSeverityCandidate(candidate) {
  return candidate.severity === 'high';
}

/**
 * 判定是否为中优先级候选。
 * @param {{severity: string}} candidate 候选
 * @returns {boolean}
 */
function isMediumSeverityCandidate(candidate) {
  return candidate.severity === 'medium';
}

/**
 * 判定是否为低优先级候选。
 * @param {{severity: string}} candidate 候选
 * @returns {boolean}
 */
function isLowSeverityCandidate(candidate) {
  return candidate.severity === 'low';
}

/**
 * 格式化问题摘要。
 * @param {{segment: string, type: string}[]} issues 问题列表
 * @returns {string}
 */
function formatIssueSummary(issues) {
  return issues
    .map(function mapIssue(issue) {
      return issue.segment + ' (' + issue.type + ')';
    })
    .join('、');
}

/**
 * 格式化噪声片段摘要。
 * @param {{segment: string, count: number}[]} noisySegments 噪声片段
 * @returns {string}
 */
function formatNoisySegments(noisySegments) {
  if (!Array.isArray(noisySegments) || noisySegments.length === 0) {
    return '无';
  }

  return noisySegments
    .map(function mapEntry(entry) {
      return '`' + entry.segment + '` x ' + entry.count;
    })
    .join('，');
}

generateAssetReadabilityAudit();
