'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace,
  formatNodeCommand,
  normalizePath
} = require('./project-paths');
const { resolveBootConfigSnapshot } = require('../boot/config');
const { resolvePlatformStrategySnapshot } = require('../boot/platform-strategy');
const { resolveBootSafetySnapshot } = require('../boot/boot-safety');
const { resolvePerformanceStrategySnapshot } = require('../boot/performance-strategy');
const { resolveBootObservationSnapshot } = require('../boot/boot-observer');
const { resolveRecoveryStrategySnapshot } = require('../boot/recovery-strategy');

const GUARDRAIL_REPORT_JSON_PATH = 'architecture/docs/guardrail-report.json';
const MAX_CHANGED_FILES_FOR_FULL_LIST = 80;
const MAX_HIGHLIGHT_CHANGED_FILES = 40;

/**
 * 生成“本轮优化迭代报告”并更新索引。
 * 报告目标：让维护者只看文档即可理解架构、入口、启动流程、常用命令和本次改动。
 */
function generateIterationReport() {
  const layout = resolveProjectLayout(__dirname);
  const reportDirectoryPath = resolveProjectFilePath(layout, 'architecture/docs/iterations');
  const indexPath = path.join(reportDirectoryPath, 'README.md');

  ensureDirectory(reportDirectoryPath);

  const currentDate = new Date();
  const reportFileName = 'iteration-' + formatTimestampForFileName(currentDate) + '.md';
  const reportPath = path.join(reportDirectoryPath, reportFileName);
  const gitBranchName = safeRunGitCommand('git branch --show-current', layout.workspaceRoot, 'unknown');
  const gitHeadCommit = safeRunGitCommand('git rev-parse --short HEAD', layout.workspaceRoot, 'unknown');
  const changedFiles = resolveChangedFiles(layout);
  const bootModulePaths = collectBootModulePaths(layout);
  const guardrailReport = readGuardrailReport(layout);
  const bootConfigSnapshot = resolveBootConfigSnapshot();
  const platformStrategySnapshot = resolvePlatformStrategySnapshot();
  const bootSafetySnapshot = resolveBootSafetySnapshot();
  const performanceStrategySnapshot = resolvePerformanceStrategySnapshot(bootConfigSnapshot);
  const bootObservationSnapshot = resolveBootObservationSnapshot();
  const recoveryStrategySnapshot = resolveRecoveryStrategySnapshot();
  const reportLines = buildReportLines({
    layout: layout,
    generatedAtText: formatTimestampForText(currentDate),
    gitBranchName: gitBranchName,
    gitHeadCommit: gitHeadCommit,
    changedFiles: changedFiles,
    bootModulePaths: bootModulePaths,
    guardrailReport: guardrailReport,
    bootConfigSnapshot: bootConfigSnapshot,
    platformStrategySnapshot: platformStrategySnapshot,
    bootSafetySnapshot: bootSafetySnapshot,
    performanceStrategySnapshot: performanceStrategySnapshot,
    bootObservationSnapshot: bootObservationSnapshot,
    recoveryStrategySnapshot: recoveryStrategySnapshot
  });

  fs.writeFileSync(reportPath, reportLines.join('\n') + '\n');
  updateIterationIndex(reportDirectoryPath, indexPath);

  console.log('[迭代报告] 已生成:', reportPath);
  console.log('[迭代报告] 已更新索引:', indexPath);
}

/**
 * 构建报告正文。
 * @param {{
 *  layout: {projectRoot: string, workspaceRoot: string, projectPathFromWorkspace: string},
 *  generatedAtText: string,
 *  gitBranchName: string,
 *  gitHeadCommit: string,
 *  changedFiles: string[],
 *  bootModulePaths: string[],
 *  guardrailReport: any,
 *  bootConfigSnapshot: any,
 *  platformStrategySnapshot: any,
 *  bootSafetySnapshot: any,
 *  performanceStrategySnapshot: any,
 *  bootObservationSnapshot: any,
 *  recoveryStrategySnapshot: any
 * }} input 报告输入
 * @returns {string[]}
 */
function buildReportLines(input) {
  const projectRootDisplay = formatProjectRootDisplay(input.layout);
  const architectureDisplay = formatProjectPathFromWorkspace(input.layout, 'architecture/');
  const bootDisplay = formatProjectPathFromWorkspace(input.layout, 'architecture/boot/');
  const docsDisplay = formatProjectPathFromWorkspace(input.layout, 'architecture/docs/');
  const toolsDisplay = formatProjectPathFromWorkspace(input.layout, 'architecture/tools/');
  const lines = [];
  lines.push('# 优化迭代报告');
  lines.push('');
  lines.push('## 基本信息');
  lines.push('- 生成时间：' + input.generatedAtText);
  lines.push('- 当前分支：`' + input.gitBranchName + '`');
  lines.push('- 基准提交：`' + input.gitHeadCommit + '`');
  lines.push('');
  lines.push('## 项目架构（当前）');
  lines.push('- 可运行目录：' + projectRootDisplay);
  lines.push('- 可维护层：`' + architectureDisplay + '`');
  lines.push('- 启动编排层：`' + bootDisplay + '`');
  lines.push('- 规范文档层：`' + docsDisplay + '`');
  lines.push('- 自动化工具层：`' + toolsDisplay + '`');
  lines.push('');
  lines.push('## 入口与启动链路');
  lines.push('1. 入口文件：`' + formatProjectPathFromWorkspace(input.layout, 'game.js') + '`');
  lines.push('2. 桥接入口：`' + formatProjectPathFromWorkspace(input.layout, 'architecture/boot/game-bootstrap.js') + '`');
  lines.push('3. 启动主流程：`bootGameRuntime -> runBootSequence -> startApplicationLifecycle`');
  lines.push('4. 关键启动模块：');
  for (const bootModulePath of input.bootModulePaths) {
    lines.push('- `' + bootModulePath + '`');
  }
  lines.push('');
  lines.push('## 本轮改动文件（工作区）');
  appendChangedFileLines(lines, input.changedFiles);
  lines.push('');
  lines.push('## 启动配置快照');
  appendBootConfigSnapshotLines(lines, input.bootConfigSnapshot);
  lines.push('');
  lines.push('## 平台、安全与恢复策略快照');
  appendPlatformStrategyLines(lines, input.platformStrategySnapshot);
  appendBootSafetyLines(lines, input.bootSafetySnapshot);
  appendRecoveryStrategyLines(lines, input.recoveryStrategySnapshot);
  lines.push('');
  lines.push('## 性能与运行时观测快照');
  appendPerformanceStrategyLines(lines, input.performanceStrategySnapshot);
  appendBootObservationLines(lines, input.bootObservationSnapshot);
  lines.push('');
  lines.push('## 护栏结果');
  appendGuardrailLines(lines, input.layout, input.guardrailReport);
  lines.push('');
  lines.push('## 常用命令');
  lines.push('```bash');
  lines.push(formatNodeCommand([formatProjectPathFromWorkspace(input.layout, 'architecture/tools/run-guardrails.js')]));
  lines.push(formatNodeCommand([formatProjectPathFromWorkspace(input.layout, 'architecture/tools/check-asset-code-separation.js')]));
  lines.push(formatNodeCommand([formatProjectPathFromWorkspace(input.layout, 'architecture/tools/generate-asset-code-report.js')]));
  lines.push(formatNodeCommand([formatProjectPathFromWorkspace(input.layout, 'architecture/tools/format-project-json.js')]));
  lines.push(formatNodeCommand([formatProjectPathFromWorkspace(input.layout, 'architecture/tools/generate-bundle-asset-catalog.js')]));
  lines.push(formatNodeCommand([formatProjectPathFromWorkspace(input.layout, 'architecture/tools/generate-uuid-asset-report.js')]));
  lines.push(formatNodeCommand([formatProjectPathFromWorkspace(input.layout, 'architecture/tools/generate-duck-fragment-usage-audit.js')]));
  lines.push(formatNodeCommand([formatProjectPathFromWorkspace(input.layout, 'architecture/tools/generate-audio-usage-audit.js')]));
  lines.push(formatNodeCommand([formatProjectPathFromWorkspace(input.layout, 'architecture/tools/verify-wechat-minigame-structure.js')]));
  lines.push(formatNodeCommand([formatProjectPathFromWorkspace(input.layout, 'architecture/tools/generate-iteration-report.js')]));
  lines.push(formatNodeCommand([formatProjectPathFromWorkspace(input.layout, 'architecture/tools/run-iteration-cycle.js')]));
  lines.push('```');
  lines.push('');
  lines.push('## 备注');
  lines.push('- 本报告由脚本自动生成，建议每轮优化结束后执行一次。');
  lines.push('- 若需追踪历史，请查看 `architecture/docs/iterations/README.md`。');
  lines.push('- 若需查看最近一次护栏明细，请查看 `' + formatProjectPathFromWorkspace(input.layout, 'architecture/docs/guardrail-report.md') + '`。');
  lines.push('');

  return lines;
}

/**
 * 追加护栏结果内容。
 * @param {string[]} lines 输出行
 * @param {{projectRoot: string, workspaceRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {any} guardrailReport 护栏报告
 */
function appendGuardrailLines(lines, layout, guardrailReport) {
  if (!guardrailReport) {
    lines.push('- 暂无护栏报告，请先执行：`' + formatNodeCommand([formatProjectPathFromWorkspace(layout, 'architecture/tools/run-guardrails.js')]) + '`');
    return;
  }

  lines.push('- 最近执行时间：' + String(guardrailReport.generatedAt || 'unknown'));
  lines.push('- 护栏报告：`' + formatProjectPathFromWorkspace(layout, 'architecture/docs/guardrail-report.md') + '`');
  lines.push('- 已执行步骤：' + String(guardrailReport.totalSteps || 0));
  lines.push('- 通过步骤：' + String(guardrailReport.passedSteps || 0));
  lines.push('- 失败步骤：' + String(guardrailReport.failedSteps || 0));

  if (!Array.isArray(guardrailReport.results) || guardrailReport.results.length === 0) {
    lines.push('- 明细：无');
    return;
  }

  const failedLabels = guardrailReport.results
    .filter(function filterFailed(result) {
      return result.status === 'failed';
    })
    .map(function mapFailed(result) {
      return result.label;
    });

  if (failedLabels.length === 0) {
    lines.push('- 结果：全部通过');
    return;
  }

  lines.push('- 失败步骤：' + failedLabels.join('、'));
}

/**
 * 追加启动配置快照内容。
 * @param {string[]} lines 输出行
 * @param {{overrideGlobalKey: string, defaultConfig: Record<string, any>, fallbackConfig: Record<string, any>}} bootConfigSnapshot 启动配置快照
 */
function appendBootConfigSnapshotLines(lines, bootConfigSnapshot) {
  if (!bootConfigSnapshot || typeof bootConfigSnapshot !== 'object') {
    lines.push('- 无法读取启动配置快照');
    return;
  }

  lines.push('- 运行时覆盖入口：`globalThis.' + String(bootConfigSnapshot.overrideGlobalKey || '__DUCK_BOOT_OVERRIDES') + '`');

  const defaultConfig = bootConfigSnapshot.defaultConfig || {};
  for (const configKey of Object.keys(defaultConfig)) {
    lines.push('- 默认 `' + configKey + '`：`' + String(defaultConfig[configKey]) + '`');
  }
}

/**
 * 追加平台策略快照内容。
 * @param {string[]} lines 输出行
 * @param {{runtimeInfoKey: string, rules: {ruleId: string, match: string, startupMode: string, reason: string}[]}} platformStrategySnapshot 平台策略快照
 */
function appendPlatformStrategyLines(lines, platformStrategySnapshot) {
  if (!platformStrategySnapshot || !Array.isArray(platformStrategySnapshot.rules)) {
    lines.push('- 无法读取平台策略快照');
    return;
  }

  lines.push('- 运行时策略快照：`globalThis.' + String(platformStrategySnapshot.runtimeInfoKey || '__DUCK_BOOT_INFO') + '`');

  for (const rule of platformStrategySnapshot.rules) {
    lines.push(
      '- 规则 `' + rule.ruleId + '`：`' + rule.match + '` -> `' + rule.startupMode + '`，' + rule.reason
    );
  }
}

/**
 * 追加启动安全快照内容。
 * @param {string[]} lines 输出行
 * @param {{stateStoreKey: string, skipStatuses: string[], finalStatuses: string[]}} bootSafetySnapshot 启动安全快照
 */
function appendBootSafetyLines(lines, bootSafetySnapshot) {
  if (!bootSafetySnapshot || typeof bootSafetySnapshot !== 'object') {
    lines.push('- 无法读取启动安全快照');
    return;
  }

  lines.push('- 启动状态存储：`globalThis.' + String(bootSafetySnapshot.stateStoreKey || '__DUCK_BOOT_RUNTIME_STATE') + '`');
  lines.push('- 重复启动跳过状态：`' + (bootSafetySnapshot.skipStatuses || []).join(' / ') + '`');
  lines.push('- 终态状态：`' + (bootSafetySnapshot.finalStatuses || []).join(' / ') + '`');
}

/**
 * 追加启动恢复策略快照内容。
 * @param {string[]} lines 输出行
 * @param {{
 *  runtimeInfoKey?: string,
 *  runtimeStateKey?: string,
 *  failurePhaseName?: string,
 *  defaultRecoveryStrategy?: string,
 *  recordStackPreview?: boolean,
 *  maxErrorStackLines?: number,
 *  trackedErrorKeys?: string[]
 * }} recoveryStrategySnapshot 启动恢复策略快照
 */
function appendRecoveryStrategyLines(lines, recoveryStrategySnapshot) {
  if (!recoveryStrategySnapshot || typeof recoveryStrategySnapshot !== 'object') {
    lines.push('- 无法读取启动恢复策略快照');
    return;
  }

  lines.push('- 失败观测入口：`globalThis.' + String(recoveryStrategySnapshot.runtimeInfoKey || '__DUCK_BOOT_INFO') + '`');
  lines.push('- 失败状态入口：`globalThis.' + String(recoveryStrategySnapshot.runtimeStateKey || '__DUCK_BOOT_RUNTIME_STATE') + '`');
  lines.push('- 失败阶段名：`' + String(recoveryStrategySnapshot.failurePhaseName || 'boot-failed') + '`');
  lines.push('- 默认恢复策略：`' + String(recoveryStrategySnapshot.defaultRecoveryStrategy || 'manual-retry') + '`');
  lines.push('- 错误字段：`' + (recoveryStrategySnapshot.trackedErrorKeys || []).join(' / ') + '`');
  lines.push('- 堆栈预览：`' + String(recoveryStrategySnapshot.recordStackPreview ? '开启' : '关闭') + '`，最多 `' + String(recoveryStrategySnapshot.maxErrorStackLines || 0) + '` 行');
}

/**
 * 追加性能策略快照内容。
 * @param {string[]} lines 输出行
 * @param {{renderPolicy?: Record<string, any>, frameRatePolicy?: Record<string, any>, runtimeMetricKeys?: string[]}} performanceStrategySnapshot 性能策略快照
 */
function appendPerformanceStrategyLines(lines, performanceStrategySnapshot) {
  if (!performanceStrategySnapshot || typeof performanceStrategySnapshot !== 'object') {
    lines.push('- 无法读取性能策略快照');
    return;
  }

  const renderPolicy = performanceStrategySnapshot.renderPolicy || {};
  const frameRatePolicy = performanceStrategySnapshot.frameRatePolicy || {};
  lines.push('- 渲染倍率上限：`' + String(renderPolicy.renderPixelRatioCap || 'unknown') + '`');
  if (renderPolicy.effect) {
    lines.push('- 渲染策略说明：' + renderPolicy.effect);
  }
  lines.push('- 低端机阈值：`benchmarkLevel <= ' + String(frameRatePolicy.lowEndBenchmarkLevel || 'unknown') + '`');
  lines.push('- 低端机目标帧率：`' + String(frameRatePolicy.lowEndFps || 'unknown') + '`');
  lines.push('- 默认目标帧率：`' + String(frameRatePolicy.defaultFps || 'unknown') + '`');
}

/**
 * 追加启动观测快照内容。
 * @param {string[]} lines 输出行
 * @param {{runtimeInfoKey?: string, trackedPhases?: string[], trackedMetricKeys?: string[], trackedTimingKeys?: string[]}} bootObservationSnapshot 启动观测快照
 */
function appendBootObservationLines(lines, bootObservationSnapshot) {
  if (!bootObservationSnapshot || typeof bootObservationSnapshot !== 'object') {
    lines.push('- 无法读取启动观测快照');
    return;
  }

  lines.push('- 运行时观测入口：`globalThis.' + String(bootObservationSnapshot.runtimeInfoKey || '__DUCK_BOOT_INFO') + '`');
  lines.push('- 关键阶段：`' + (bootObservationSnapshot.trackedPhases || []).join(' / ') + '`');
  lines.push('- 关键指标：`' + (bootObservationSnapshot.trackedMetricKeys || []).join(' / ') + '`');
  lines.push('- 耗时字段：`' + (bootObservationSnapshot.trackedTimingKeys || []).join(' / ') + '`');
  lines.push('- 耗时说明：总耗时看 `durationMs`，阶段累计耗时看 `phases[].sinceBootMs`，相邻阶段间隔看 `phases[].sincePreviousPhaseMs`。');
}

/**
 * 追加改动文件内容。
 * @param {string[]} lines 输出行
 * @param {string[]} changedFiles 改动文件
 */
function appendChangedFileLines(lines, changedFiles) {
  if (changedFiles.length === 0) {
    lines.push('- 无（当前工作区干净）');
    return;
  }

  if (changedFiles.length <= MAX_CHANGED_FILES_FOR_FULL_LIST) {
    for (const changedFilePath of changedFiles) {
      lines.push('- `' + changedFilePath + '`');
    }
    return;
  }

  lines.push('- 改动文件较多，共 ' + changedFiles.length + ' 项，已按一级目录汇总：');

  const bucketSummaries = buildChangedFileBucketSummaries(changedFiles);
  for (const bucketSummary of bucketSummaries) {
    lines.push('- `' + bucketSummary.label + '`：' + bucketSummary.count + ' 项');
  }

  lines.push('- 重点文件：');
  for (const highlightedFile of selectHighlightedChangedFiles(changedFiles)) {
    lines.push('- `' + highlightedFile + '`');
  }
}

/**
 * 构建改动文件的一级目录汇总。
 * @param {string[]} changedFiles 改动文件
 * @returns {{label: string, count: number}[]}
 */
function buildChangedFileBucketSummaries(changedFiles) {
  const bucketCountMap = new Map();

  for (const changedFilePath of changedFiles) {
    const bucketLabel = resolveChangedFileBucketLabel(changedFilePath);
    const currentCount = bucketCountMap.get(bucketLabel) || 0;
    bucketCountMap.set(bucketLabel, currentCount + 1);
  }

  return Array.from(bucketCountMap.entries())
    .map(function mapBucket(entry) {
      return {
        label: entry[0],
        count: entry[1]
      };
    })
    .sort(function sortBucket(left, right) {
      return right.count - left.count || left.label.localeCompare(right.label);
    });
}

/**
 * 解析改动文件所属的一级目录标签。
 * @param {string} changedFilePath 改动文件路径
 * @returns {string}
 */
function resolveChangedFileBucketLabel(changedFilePath) {
  if (!changedFilePath.includes('/')) {
    return '(root)';
  }

  const firstSegment = changedFilePath.split('/')[0];
  if (firstSegment === 'runnable_wechat_project') {
    return 'runnable_wechat_project/**（历史路径变更）';
  }

  return firstSegment + '/**';
}

/**
 * 选取适合展示的重点改动文件。
 * @param {string[]} changedFiles 改动文件
 * @returns {string[]}
 */
function selectHighlightedChangedFiles(changedFiles) {
  const activeFiles = changedFiles.filter(function filterLegacyFile(filePath) {
    return !filePath.startsWith('runnable_wechat_project/');
  });
  const sourceFiles = activeFiles.length > 0 ? activeFiles : changedFiles;
  const highlightedFiles = [];

  appendHighlightedGroup(
    highlightedFiles,
    sourceFiles.filter(function filterBootFile(filePath) {
      return filePath.startsWith('architecture/boot/');
    }),
    12
  );

  appendHighlightedGroup(
    highlightedFiles,
    sourceFiles.filter(function filterToolFile(filePath) {
      return filePath.startsWith('architecture/tools/');
    }),
    10
  );

  appendHighlightedGroup(
    highlightedFiles,
    sourceFiles.filter(function filterMemoryFile(filePath) {
      return filePath.startsWith('architecture/memory/') || filePath.startsWith('architecture/skills/');
    }),
    6
  );

  appendHighlightedGroup(
    highlightedFiles,
    sourceFiles.filter(function filterArchitectureDocFile(filePath) {
      return filePath.startsWith('architecture/docs/') && isPreferredArchitectureDocFile(filePath);
    }),
    12
  );

  appendHighlightedGroup(
    highlightedFiles,
    sourceFiles.filter(function filterRootFile(filePath) {
      return !filePath.includes('/');
    }),
    8
  );

  appendHighlightedGroup(
    highlightedFiles,
    sourceFiles.filter(function filterOtherFile(filePath) {
      return filePath.includes('/') && !filePath.startsWith('architecture/');
    }),
    MAX_HIGHLIGHT_CHANGED_FILES - highlightedFiles.length
  );

  return highlightedFiles.slice(0, MAX_HIGHLIGHT_CHANGED_FILES);
}

/**
 * 判断 architecture 文档是否适合作为重点文件展示。
 * @param {string} filePath 文件路径
 * @returns {boolean}
 */
function isPreferredArchitectureDocFile(filePath) {
  return !/^architecture\/docs\/iterations\/iteration-\d{4}-\d{2}-\d{2}-/.test(filePath);
}

/**
 * 将一组重点文件追加到结果中，避免重复。
 * @param {string[]} highlightedFiles 重点文件结果集
 * @param {string[]} fileGroup 候选文件
 * @param {number} limit 最多追加数量
 */
function appendHighlightedGroup(highlightedFiles, fileGroup, limit) {
  if (limit <= 0) {
    return;
  }

  for (const filePath of fileGroup) {
    if (highlightedFiles.length >= MAX_HIGHLIGHT_CHANGED_FILES || limit <= 0) {
      return;
    }
    if (highlightedFiles.includes(filePath)) {
      continue;
    }
    highlightedFiles.push(filePath);
    limit -= 1;
  }
}

/**
 * 更新迭代报告索引。
 * @param {string} reportDirectoryPath 报告目录
 * @param {string} indexPath 索引文件路径
 */
function updateIterationIndex(reportDirectoryPath, indexPath) {
  const reportFileNames = fs
    .readdirSync(reportDirectoryPath)
    .filter(function filterReportFile(fileName) {
      return fileName.startsWith('iteration-') && fileName.endsWith('.md');
    })
    .sort()
    .reverse();

  const lines = [];
  lines.push('# 迭代报告索引（自动生成）');
  lines.push('');
  lines.push('> 本文件由 `architecture/tools/generate-iteration-report.js` 生成。');
  lines.push('');
  lines.push('## 报告列表（新到旧）');
  if (reportFileNames.length === 0) {
    lines.push('- 暂无报告');
  } else {
    for (const reportFileName of reportFileNames) {
      lines.push('- [' + reportFileName + '](./' + reportFileName + ')');
    }
  }
  lines.push('');

  fs.writeFileSync(indexPath, lines.join('\n') + '\n');
}

/**
 * 收集 boot 目录下模块文件路径。
 * @param {{projectRoot: string, workspaceRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @returns {string[]}
 */
function collectBootModulePaths(layout) {
  const bootDirectoryPath = resolveProjectFilePath(layout, 'architecture/boot');
  if (!fs.existsSync(bootDirectoryPath)) {
    return [];
  }

  return fs
    .readdirSync(bootDirectoryPath)
    .filter(function filterJsFile(fileName) {
      return fileName.endsWith('.js');
    })
    .sort()
    .map(function mapToRelativePath(fileName) {
      return formatProjectPathFromWorkspace(layout, 'architecture/boot/' + fileName);
    });
}

/**
 * 读取工作区改动文件列表（暂存区 + 未暂存）。
 * @param {{projectRoot: string, workspaceRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @returns {string[]}
 */
function resolveChangedFiles(layout) {
  const stagedOutput = safeRunGitCommand('git diff --cached --name-only', layout.workspaceRoot, '');
  const unstagedOutput = safeRunGitCommand('git diff --name-only', layout.workspaceRoot, '');
  const untrackedOutput = safeRunGitCommand('git ls-files --others --exclude-standard', layout.workspaceRoot, '');
  const changedFileSet = new Set();

  for (const outputLine of stagedOutput.split('\n')) {
    addChangedFile(layout, changedFileSet, outputLine);
  }

  for (const outputLine of unstagedOutput.split('\n')) {
    addChangedFile(layout, changedFileSet, outputLine);
  }

  for (const outputLine of untrackedOutput.split('\n')) {
    addChangedFile(layout, changedFileSet, outputLine);
  }

  return Array.from(changedFileSet).sort();
}

/**
 * 向改动集合中安全追加文件路径。
 * @param {{projectPathFromWorkspace: string}} layout 项目布局
 * @param {Set<string>} changedFileSet 文件集合
 * @param {string} outputLine 命令输出行
 */
function addChangedFile(layout, changedFileSet, outputLine) {
  const normalizedFilePath = normalizePath(outputLine.trim());
  if (normalizedFilePath.length === 0) {
    return;
  }

  if (layout.projectPathFromWorkspace.length > 0) {
    const projectPrefix = layout.projectPathFromWorkspace + '/';
    if (normalizedFilePath !== layout.projectPathFromWorkspace && !normalizedFilePath.startsWith(projectPrefix)) {
      return;
    }
  }

  changedFileSet.add(normalizedFilePath);
}

/**
 * 读取最近一次护栏报告。
 * @param {{projectRoot: string}} layout 项目布局
 * @returns {any}
 */
function readGuardrailReport(layout) {
  const guardrailReportPath = resolveProjectFilePath(layout, GUARDRAIL_REPORT_JSON_PATH);

  if (!fs.existsSync(guardrailReportPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(guardrailReportPath, 'utf8'));
  } catch (error) {
    return null;
  }
}

/**
 * 格式化项目根目录展示文本。
 * @param {{projectPathFromWorkspace: string}} layout 项目布局
 * @returns {string}
 */
function formatProjectRootDisplay(layout) {
  const projectRootPath = formatProjectPathFromWorkspace(layout, '');
  if (projectRootPath === './') {
    return '`./`（仓库根目录）';
  }
  return '`' + projectRootPath + '`';
}

/**
 * 安全执行 git 命令。
 * @param {string} command git 命令
 * @param {string} cwd 执行目录
 * @param {string} fallbackText 失败回退值
 * @returns {string}
 */
function safeRunGitCommand(command, cwd, fallbackText) {
  try {
    const output = execSync(command, {
      cwd: cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8'
    });
    return String(output || '').trim();
  } catch (error) {
    return fallbackText;
  }
}

/**
 * 确保目录存在。
 * @param {string} directoryPath 目录路径
 */
function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

/**
 * 格式化报告文件名时间戳。
 * @param {Date} currentDate 当前时间
 * @returns {string}
 */
function formatTimestampForFileName(currentDate) {
  const year = currentDate.getFullYear();
  const month = padTwoDigits(currentDate.getMonth() + 1);
  const day = padTwoDigits(currentDate.getDate());
  const hour = padTwoDigits(currentDate.getHours());
  const minute = padTwoDigits(currentDate.getMinutes());
  const second = padTwoDigits(currentDate.getSeconds());
  return year + '-' + month + '-' + day + '-' + hour + minute + second;
}

/**
 * 格式化报告可读时间。
 * @param {Date} currentDate 当前时间
 * @returns {string}
 */
function formatTimestampForText(currentDate) {
  const year = currentDate.getFullYear();
  const month = padTwoDigits(currentDate.getMonth() + 1);
  const day = padTwoDigits(currentDate.getDate());
  const hour = padTwoDigits(currentDate.getHours());
  const minute = padTwoDigits(currentDate.getMinutes());
  const second = padTwoDigits(currentDate.getSeconds());
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

/**
 * 补齐两位数字。
 * @param {number} value 数值
 * @returns {string}
 */
function padTwoDigits(value) {
  return String(value).padStart(2, '0');
}

generateIterationReport();
