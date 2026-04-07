'use strict';

const { execSync } = require('child_process');
const path = require('path');

/**
 * 执行标准护栏检查。
 * 目标：一条命令覆盖语法、规范和运行桥接安全。
 */
function runGuardrails() {
  const workspace = path.resolve(__dirname, '..', '..', '..');
  const commands = [
    'node -c runnable_wechat_project/game.js',
    'node -c runnable_wechat_project/architecture/boot/game-bootstrap.js',
    'node runnable_wechat_project/architecture/tools/check-architecture-style.js',
    'node runnable_wechat_project/architecture/tools/verify-runtime-safety.js'
  ];

  for (const command of commands) {
    console.log('[guardrails] run:', command);
    execSync(command, {
      cwd: workspace,
      stdio: 'inherit'
    });
  }

  console.log('[guardrails] 全部通过');
}

runGuardrails();

