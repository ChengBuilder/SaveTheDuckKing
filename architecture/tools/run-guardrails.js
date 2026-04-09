'use strict';

const fs = require('fs');
const { execFileSync } = require('child_process');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace,
  formatNodeCommand
} = require('./project-paths');

const GUARDRAIL_REPORT_JSON_PATH = 'architecture/docs/guardrail-report.json';
const GUARDRAIL_REPORT_MARKDOWN_PATH = 'architecture/docs/guardrail-report.md';

/**
 * 执行标准护栏检查。
 * 目标：一条命令覆盖语法、规范和运行桥接安全。
 */
function runGuardrails() {
  const layout = resolveProjectLayout(__dirname);
  const steps = buildGuardrailSteps(layout);
  const startedAt = new Date();
  const results = [];

  for (const step of steps) {
    const stepResult = runGuardrailStep(layout, step);
    results.push(stepResult);
    if (stepResult.status !== 'passed') {
      break;
    }
  }

  const report = buildGuardrailReport(layout, startedAt, results);
  writeGuardrailReportFiles(layout, report);

  if (report.failedSteps > 0) {
    console.error('[护栏检查] 未通过，请查看报告:', formatProjectPathFromWorkspace(layout, GUARDRAIL_REPORT_MARKDOWN_PATH));
    process.exitCode = 1;
    return;
  }

  console.log('[护栏检查] 全部通过');
}

/**
 * 构建护栏步骤定义。
 * @param {{projectRoot: string, workspaceRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @returns {{label: string, commandText: string, execArgs: string[]}[]}
 */
function buildGuardrailSteps(layout) {
  return [
    createSyntaxCheckStep(layout, '主入口语法检查', 'game.js'),
    createSyntaxCheckStep(layout, '启动编排语法检查', 'architecture/boot/game-bootstrap.js'),
    createSyntaxCheckStep(layout, '启动配置语法检查', 'architecture/boot/config.js'),
    createSyntaxCheckStep(layout, '启动安全语法检查', 'architecture/boot/boot-safety.js'),
    createSyntaxCheckStep(layout, '启动观测语法检查', 'architecture/boot/boot-observer.js'),
    createSyntaxCheckStep(layout, '启动恢复策略语法检查', 'architecture/boot/recovery-strategy.js'),
    createSyntaxCheckStep(layout, '运行时上下文语法检查', 'architecture/boot/global-context.js'),
    createSyntaxCheckStep(layout, '启动日志语法检查', 'architecture/boot/boot-logger.js'),
    createSyntaxCheckStep(layout, '平台策略语法检查', 'architecture/boot/platform-strategy.js'),
    createSyntaxCheckStep(layout, '性能策略语法检查', 'architecture/boot/performance-strategy.js'),
    createSyntaxCheckStep(layout, '运行时治理语法检查', 'architecture/boot/runtime-governance.js'),
    createSyntaxCheckStep(layout, '系统信息语法检查', 'architecture/boot/system-info.js'),
    createSyntaxCheckStep(layout, '渲染策略语法检查', 'architecture/boot/render-policies.js'),
    createSyntaxCheckStep(layout, '运行桥接语法检查', 'architecture/boot/runtime-bridge.js'),
    createSyntaxCheckStep(layout, '应用生命周期语法检查', 'architecture/boot/app-lifecycle.js'),
    createSyntaxCheckStep(layout, '资源路径规范化语法检查', 'architecture/boot/asset-path-normalizer.js'),
    createSyntaxCheckStep(layout, '项目路径策略语法检查', 'architecture/tools/project-paths.js'),
    createSyntaxCheckStep(layout, '语义化共享工具语法检查', 'architecture/tools/semanticize-shared.js'),
    createSyntaxCheckStep(layout, '关键 JSON 格式化工具语法检查', 'architecture/tools/format-project-json.js'),
    createSyntaxCheckStep(layout, 'Bundle 资产目录工具语法检查', 'architecture/tools/generate-bundle-asset-catalog.js'),
    createSyntaxCheckStep(layout, 'UUID 资产审计工具语法检查', 'architecture/tools/generate-uuid-asset-report.js'),
    createSyntaxCheckStep(layout, '素材可读性审计工具语法检查', 'architecture/tools/generate-asset-readability-audit.js'),
    createSyntaxCheckStep(layout, '音频使用审计工具语法检查', 'architecture/tools/generate-audio-usage-audit.js'),
    createSyntaxCheckStep(layout, '子包结构审计工具语法检查', 'architecture/tools/generate-subpackage-structure-audit.js'),
    createSyntaxCheckStep(layout, '兼容镜像审计工具语法检查', 'architecture/tools/generate-compatibility-mirror-audit.js'),
    createSyntaxCheckStep(layout, '微信小游戏结构校验语法检查', 'architecture/tools/verify-wechat-minigame-structure.js'),
    createSyntaxCheckStep(layout, 'DuckBundle 木板语义化工具语法检查', 'architecture/tools/semanticize-duckbundle-wood-assets.js'),
    createSyntaxCheckStep(layout, 'DuckBundle 背景语义化工具语法检查', 'architecture/tools/semanticize-duckbundle-background-assets.js'),
    createSyntaxCheckStep(layout, 'DuckBundle 季节背景语义化工具语法检查', 'architecture/tools/semanticize-duckbundle-seasonal-background-assets.js'),
    createSyntaxCheckStep(layout, 'HomeBundle 素材语义化工具语法检查', 'architecture/tools/semanticize-homebundle-assets.js'),
    createSyntaxCheckStep(layout, 'uiBundle 图鉴皮肤页语义化工具语法检查', 'architecture/tools/semanticize-uibundle-book-skin-assets.js'),
    createSyntaxCheckStep(layout, 'uiBundle 设置模块语义化工具语法检查', 'architecture/tools/semanticize-uibundle-settings-assets.js'),
    createSyntaxCheckStep(layout, 'URL 编码路径校验工具语法检查', 'architecture/tools/check-no-url-encoded-paths.js'),
    createSyntaxCheckStep(layout, '迭代报告生成器语法检查', 'architecture/tools/generate-iteration-report.js'),
    createSyntaxCheckStep(layout, '迭代流水线语法检查', 'architecture/tools/run-iteration-cycle.js'),
    createScriptStep(layout, '架构风格检查', 'architecture/tools/check-architecture-style.js'),
    createScriptStep(layout, '素材分层检查', 'architecture/tools/check-asset-code-separation.js'),
    createScriptStep(layout, 'URL 编码路径校验', 'architecture/tools/check-no-url-encoded-paths.js'),
    createScriptStep(layout, '微信小游戏结构校验', 'architecture/tools/verify-wechat-minigame-structure.js'),
    createScriptStep(layout, '运行安全校验', 'architecture/tools/verify-runtime-safety.js')
  ];
}

/**
 * 创建语法检查步骤。
 * @param {{projectRoot: string, workspaceRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {string} label 步骤标签
 * @param {string} relativePath 项目内相对路径
 * @returns {{label: string, commandText: string, execArgs: string[]}}
 */
function createSyntaxCheckStep(layout, label, relativePath) {
  const filePath = resolveProjectFilePath(layout, relativePath);
  const commandText = formatNodeCommand(['-c', formatProjectPathFromWorkspace(layout, relativePath)]);
  return {
    label: label,
    commandText: commandText,
    execArgs: ['-c', filePath]
  };
}

/**
 * 创建脚本执行步骤。
 * @param {{projectRoot: string, workspaceRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {string} label 步骤标签
 * @param {string} relativePath 项目内相对路径
 * @returns {{label: string, commandText: string, execArgs: string[]}}
 */
function createScriptStep(layout, label, relativePath) {
  const filePath = resolveProjectFilePath(layout, relativePath);
  const commandText = formatNodeCommand([formatProjectPathFromWorkspace(layout, relativePath)]);
  return {
    label: label,
    commandText: commandText,
    execArgs: [filePath]
  };
}

/**
 * 执行单个护栏步骤并记录结果。
 * @param {{workspaceRoot: string}} layout 项目布局
 * @param {{label: string, commandText: string, execArgs: string[]}} step 步骤定义
 * @returns {{label: string, commandText: string, status: string, startedAt: string, finishedAt: string, durationMs: number, errorMessage: string}}
 */
function runGuardrailStep(layout, step) {
  const startedAt = new Date();
  console.log('[护栏检查] 执行命令:', step.commandText);

  try {
    execFileSync(process.execPath, step.execArgs, {
      cwd: layout.workspaceRoot,
      stdio: 'inherit'
    });

    const finishedAt = new Date();
    return {
      label: step.label,
      commandText: step.commandText,
      status: 'passed',
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      errorMessage: ''
    };
  } catch (error) {
    const finishedAt = new Date();
    return {
      label: step.label,
      commandText: step.commandText,
      status: 'failed',
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      errorMessage: resolveExecErrorMessage(error)
    };
  }
}

/**
 * 组装护栏检查报告。
 * @param {{projectPathFromWorkspace: string}} layout 项目布局
 * @param {Date} startedAt 流程开始时间
 * @param {{status: string}[]} results 步骤结果
 * @returns {{generatedAt: string, startedAt: string, finishedAt: string, projectPath: string, totalSteps: number, passedSteps: number, failedSteps: number, results: any[]}}
 */
function buildGuardrailReport(layout, startedAt, results) {
  const finishedAt = new Date();
  const passedSteps = results.filter(function filterPassed(stepResult) {
    return stepResult.status === 'passed';
  }).length;
  const failedSteps = results.filter(function filterFailed(stepResult) {
    return stepResult.status === 'failed';
  }).length;

  return {
    generatedAt: finishedAt.toISOString(),
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    projectPath: formatProjectPathFromWorkspace(layout, ''),
    totalSteps: results.length,
    passedSteps: passedSteps,
    failedSteps: failedSteps,
    results: results
  };
}

/**
 * 输出护栏检查报告文件。
 * @param {{projectRoot: string}} layout 项目布局
 * @param {{generatedAt: string, projectPath: string, totalSteps: number, passedSteps: number, failedSteps: number, results: any[]}} report 报告数据
 */
function writeGuardrailReportFiles(layout, report) {
  const jsonPath = resolveProjectFilePath(layout, GUARDRAIL_REPORT_JSON_PATH);
  const markdownPath = resolveProjectFilePath(layout, GUARDRAIL_REPORT_MARKDOWN_PATH);
  const markdownLines = buildGuardrailMarkdownLines(report);

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(markdownPath, markdownLines.join('\n') + '\n');
}

/**
 * 构建护栏 Markdown 报告。
 * @param {{generatedAt: string, projectPath: string, totalSteps: number, passedSteps: number, failedSteps: number, results: any[]}} report 报告数据
 * @returns {string[]}
 */
function buildGuardrailMarkdownLines(report) {
  const lines = [];
  lines.push('# 护栏检查报告（自动生成）');
  lines.push('');
  lines.push('> 本文件由 `architecture/tools/run-guardrails.js` 生成。');
  lines.push('');
  lines.push('## 总览');
  lines.push('- 最近执行时间：' + report.generatedAt);
  lines.push('- 项目目录：`' + report.projectPath + '`');
  lines.push('- 已执行步骤：' + report.totalSteps);
  lines.push('- 通过步骤：' + report.passedSteps);
  lines.push('- 失败步骤：' + report.failedSteps);
  lines.push('');
  lines.push('## 步骤明细');
  lines.push('| 步骤 | 状态 | 耗时（ms） | 命令 |');
  lines.push('| --- | --- | ---: | --- |');

  for (const result of report.results) {
    const statusText = result.status === 'passed' ? '通过' : '失败';
    lines.push(
      '| ' + result.label + ' | ' + statusText + ' | ' + result.durationMs + ' | `' + result.commandText + '` |'
    );
  }

  lines.push('');
  lines.push('## 失败信息');
  if (report.failedSteps === 0) {
    lines.push('- 无');
  } else {
    for (const result of report.results) {
      if (result.status !== 'failed') {
        continue;
      }
      lines.push('- `' + result.label + '`：' + result.errorMessage);
    }
  }
  lines.push('');

  return lines;
}

/**
 * 提取子进程失败信息。
 * @param {any} error 子进程异常
 * @returns {string}
 */
function resolveExecErrorMessage(error) {
  if (error && typeof error.status === 'number') {
    return '退出码 ' + error.status;
  }
  if (error && typeof error.message === 'string' && error.message.length > 0) {
    return error.message;
  }
  return '未知错误';
}

runGuardrails();
