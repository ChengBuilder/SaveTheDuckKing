'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 生成“本轮优化迭代报告”并更新索引。
 * 报告目标：让维护者只看文档即可理解架构、入口、启动流程、常用命令和本次改动。
 */
function generateIterationReport() {
  const projectRoot = path.resolve(__dirname, '..', '..');
  const reportDirectoryPath = path.join(projectRoot, 'architecture', 'docs', 'iterations');
  const indexPath = path.join(reportDirectoryPath, 'README.md');

  ensureDirectory(reportDirectoryPath);

  const currentDate = new Date();
  const reportFileName = 'iteration-' + formatTimestampForFileName(currentDate) + '.md';
  const reportPath = path.join(reportDirectoryPath, reportFileName);
  const gitBranchName = safeRunGitCommand('git branch --show-current', projectRoot, 'unknown');
  const gitHeadCommit = safeRunGitCommand('git rev-parse --short HEAD', projectRoot, 'unknown');
  const changedFiles = resolveChangedFiles(projectRoot);
  const bootModulePaths = collectBootModulePaths(projectRoot);
  const reportLines = buildReportLines({
    generatedAtText: formatTimestampForText(currentDate),
    gitBranchName: gitBranchName,
    gitHeadCommit: gitHeadCommit,
    changedFiles: changedFiles,
    bootModulePaths: bootModulePaths
  });

  fs.writeFileSync(reportPath, reportLines.join('\n') + '\n');
  updateIterationIndex(reportDirectoryPath, indexPath);

  console.log('[generate-iteration-report] wrote:', reportPath);
  console.log('[generate-iteration-report] updated index:', indexPath);
}

/**
 * 构建报告正文。
 * @param {{
 *  generatedAtText: string,
 *  gitBranchName: string,
 *  gitHeadCommit: string,
 *  changedFiles: string[],
 *  bootModulePaths: string[]
 * }} input 报告输入
 * @returns {string[]}
 */
function buildReportLines(input) {
  const lines = [];
  lines.push('# 优化迭代报告');
  lines.push('');
  lines.push('## 基本信息');
  lines.push('- 生成时间：' + input.generatedAtText);
  lines.push('- 当前分支：`' + input.gitBranchName + '`');
  lines.push('- 基准提交：`' + input.gitHeadCommit + '`');
  lines.push('');
  lines.push('## 项目架构（当前）');
  lines.push('- 可运行目录：`runnable_wechat_project/`');
  lines.push('- 可维护层：`runnable_wechat_project/architecture/`');
  lines.push('- 启动编排层：`runnable_wechat_project/architecture/boot/`');
  lines.push('- 规范文档层：`runnable_wechat_project/architecture/docs/`');
  lines.push('- 自动化工具层：`runnable_wechat_project/architecture/tools/`');
  lines.push('');
  lines.push('## 入口与启动链路');
  lines.push('1. 入口文件：`runnable_wechat_project/game.js`');
  lines.push('2. 桥接入口：`runnable_wechat_project/architecture/boot/game-bootstrap.js`');
  lines.push('3. 启动主流程：`bootGameRuntime -> runBootSequence -> startApplicationLifecycle`');
  lines.push('4. 关键启动模块：');
  for (const bootModulePath of input.bootModulePaths) {
    lines.push('- `' + bootModulePath + '`');
  }
  lines.push('');
  lines.push('## 本轮改动文件（工作区）');
  if (input.changedFiles.length === 0) {
    lines.push('- 无（当前工作区干净）');
  } else {
    for (const changedFilePath of input.changedFiles) {
      lines.push('- `' + changedFilePath + '`');
    }
  }
  lines.push('');
  lines.push('## 常用命令');
  lines.push('```bash');
  lines.push('node runnable_wechat_project/architecture/tools/run-guardrails.js');
  lines.push('node runnable_wechat_project/architecture/tools/check-asset-code-separation.js');
  lines.push('node runnable_wechat_project/architecture/tools/generate-asset-code-report.js');
  lines.push('node runnable_wechat_project/architecture/tools/generate-iteration-report.js');
  lines.push('```');
  lines.push('');
  lines.push('## 备注');
  lines.push('- 本报告由脚本自动生成，建议每轮优化结束后执行一次。');
  lines.push('- 若需追踪历史，请查看 `architecture/docs/iterations/README.md`。');
  lines.push('');

  return lines;
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
 * @param {string} projectRoot 项目根目录
 * @returns {string[]}
 */
function collectBootModulePaths(projectRoot) {
  const bootDirectoryPath = path.join(projectRoot, 'architecture', 'boot');
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
      return toRelativePath(projectRoot, path.join(bootDirectoryPath, fileName));
    });
}

/**
 * 读取工作区改动文件列表（暂存区 + 未暂存）。
 * @param {string} projectRoot 项目根目录
 * @returns {string[]}
 */
function resolveChangedFiles(projectRoot) {
  const stagedOutput = safeRunGitCommand('git diff --cached --name-only', projectRoot, '');
  const unstagedOutput = safeRunGitCommand('git diff --name-only', projectRoot, '');
  const changedFileSet = new Set();

  for (const outputLine of stagedOutput.split('\n')) {
    const filePath = outputLine.trim();
    if (filePath.length > 0) {
      changedFileSet.add(filePath);
    }
  }

  for (const outputLine of unstagedOutput.split('\n')) {
    const filePath = outputLine.trim();
    if (filePath.length > 0) {
      changedFileSet.add(filePath);
    }
  }

  return Array.from(changedFileSet).sort();
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
 * 将路径转换为项目相对路径（统一正斜杠）。
 * @param {string} projectRoot 项目根目录
 * @param {string} fullPath 绝对路径
 * @returns {string}
 */
function toRelativePath(projectRoot, fullPath) {
  return path.relative(projectRoot, fullPath).replace(/\\/g, '/');
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

