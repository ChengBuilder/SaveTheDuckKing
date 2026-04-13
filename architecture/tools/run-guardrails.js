'use strict';

const path = require('path');
const childProcess = require('child_process');

const PROJECT_ROOT = process.cwd();

function main() {
  const args = new Set(process.argv.slice(2));
  const withPackageSize = args.has('--with-package-size');
  const steps = [
    {
      label: '微信小游戏结构校验',
      args: ['architecture/tools/verify-wechat-minigame-structure.js'],
    },
    {
      label: '配置资源完整性校验',
      args: ['architecture/tools/check-config-version-asset-integrity.js', '--strict-shard'],
    },
    {
      label: '运行安全校验',
      args: ['architecture/tools/verify-runtime-safety.js'],
    },
    {
      label: '旧运行时兼容残留校验',
      args: ['architecture/tools/check-legacy-runtime-compat.js'],
    },
  ];

  if (withPackageSize) {
    steps.push({
      label: '微信代码包体校验',
      args: ['architecture/tools/check-wechat-code-package-limits.js'],
    });
  }

  const results = [];
  for (const step of steps) {
    const result = runStep(step);
    results.push(result);
    if (!result.passed) {
      break;
    }
  }

  printSummary(results, steps.length);

  if (results.some((item) => !item.passed)) {
    process.exitCode = 1;
    return;
  }

  console.log('[guardrails] 全部通过');
}

function runStep(step) {
  const printable = ['node'].concat(step.args).join(' ');
  console.log('[guardrails] 执行:', step.label);
  console.log('[guardrails] 命令:', printable);

  const absoluteArgs = step.args.map((arg, index) => {
    if (index === 0) {
      return path.join(PROJECT_ROOT, arg);
    }
    return arg;
  });

  const result = childProcess.spawnSync(process.execPath, absoluteArgs, {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.status !== 0) {
    console.error('[guardrails] 失败:', step.label);
    return {
      label: step.label,
      passed: false,
      command: printable,
      code: result.status,
    };
  }

  return {
    label: step.label,
    passed: true,
    command: printable,
    code: 0,
  };
}

function printSummary(results, total) {
  const passed = results.filter((item) => item.passed).length;
  const failed = results.length - passed;
  console.log('[guardrails] summary');
  console.log(
    JSON.stringify(
      {
        totalPlanned: total,
        totalExecuted: results.length,
        passed,
        failed,
        steps: results,
      },
      null,
      2
    )
  );
}

main();
