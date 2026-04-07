'use strict';

const { execSync } = require('child_process');
const path = require('path');

/**
 * 运行标准化迭代流程。
 * 目标：每次迭代都自动沉淀可追踪文档，并完成可运行性护栏校验。
 */
function runIterationCycle() {
  const workspace = path.resolve(__dirname, '..', '..', '..');
  const commands = [
    'node runnable_wechat_project/architecture/tools/generate-module-index.js',
    'node runnable_wechat_project/architecture/tools/generate-asset-code-report.js',
    'node runnable_wechat_project/architecture/tools/run-guardrails.js',
    'node runnable_wechat_project/architecture/tools/generate-iteration-report.js'
  ];

  for (const command of commands) {
    console.log('[迭代流水线] 执行命令:', command);
    execSync(command, {
      cwd: workspace,
      stdio: 'inherit'
    });
  }

  console.log('[迭代流水线] 完成');
}

runIterationCycle();
