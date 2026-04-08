'use strict';

const { execFileSync } = require('child_process');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace,
  formatNodeCommand
} = require('./project-paths');

/**
 * 运行标准化迭代流程。
 * 目标：每次迭代都自动沉淀可追踪文档，并完成可运行性护栏校验。
 */
function runIterationCycle() {
  const layout = resolveProjectLayout(__dirname);
  const steps = [
    createScriptStep(layout, '生成模块索引', 'architecture/tools/generate-module-index.js'),
    createScriptStep(layout, '生成素材分层报告', 'architecture/tools/generate-asset-code-report.js'),
    createScriptStep(layout, '执行护栏检查', 'architecture/tools/run-guardrails.js'),
    createScriptStep(layout, '生成迭代报告', 'architecture/tools/generate-iteration-report.js')
  ];

  for (const step of steps) {
    console.log('[迭代流水线] 执行命令:', step.commandText);
    execFileSync(process.execPath, step.execArgs, {
      cwd: layout.workspaceRoot,
      stdio: 'inherit'
    });
  }

  console.log('[迭代流水线] 完成');
}

/**
 * 创建脚本执行步骤。
 * @param {{projectRoot: string, workspaceRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {string} label 步骤标签
 * @param {string} relativePath 项目内相对路径
 * @returns {{label: string, commandText: string, execArgs: string[]}}
 */
function createScriptStep(layout, label, relativePath) {
  const commandText = formatNodeCommand([formatProjectPathFromWorkspace(layout, relativePath)]);
  return {
    label: label,
    commandText: commandText,
    execArgs: [resolveProjectFilePath(layout, relativePath)]
  };
}

runIterationCycle();
