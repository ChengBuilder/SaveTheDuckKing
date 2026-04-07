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
    'node -c runnable_wechat_project/architecture/boot/config.js',
    'node -c runnable_wechat_project/architecture/boot/global-context.js',
    'node -c runnable_wechat_project/architecture/boot/boot-logger.js',
    'node -c runnable_wechat_project/architecture/boot/system-info.js',
    'node -c runnable_wechat_project/architecture/boot/render-policies.js',
    'node -c runnable_wechat_project/architecture/boot/runtime-bridge.js',
    'node -c runnable_wechat_project/architecture/boot/app-lifecycle.js',
    'node -c runnable_wechat_project/architecture/tools/generate-iteration-report.js',
    'node -c runnable_wechat_project/architecture/tools/run-iteration-cycle.js',
    'node runnable_wechat_project/architecture/tools/check-architecture-style.js',
    'node runnable_wechat_project/architecture/tools/check-asset-code-separation.js',
    'node runnable_wechat_project/architecture/tools/verify-runtime-safety.js'
  ];

  for (const command of commands) {
    console.log('[护栏检查] 执行命令:', command);
    execSync(command, {
      cwd: workspace,
      stdio: 'inherit'
    });
  }

  console.log('[护栏检查] 全部通过');
}

runGuardrails();
