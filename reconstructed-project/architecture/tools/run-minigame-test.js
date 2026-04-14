'use strict';

const childProcess = require('child_process');
const {
  resolveMiniGameTestContext,
  resolveCliPath,
  resolveServicePort,
  resolveAutomationPort,
  resolveCasePaths,
  resolveSdkStatus,
  ensureMiniGameTestPackageInstalled,
  validatePortPair,
  formatProjectPath,
  assertExists
} = require('./wechat-minigame-test-common');

function main() {
  const args = process.argv.slice(2);
  const context = resolveMiniGameTestContext(__dirname);
  const cliPath = resolveCliPath();
  const servicePort = resolveServicePort();
  const automationPort = resolveAutomationPort();
  const casePaths = resolveCasePaths(context, readFlag(args, '--case'));
  const skipOpen = args.includes('--skip-open');

  validatePortPair(servicePort, automationPort);

  if (!cliPath) {
    throw new Error('未找到微信开发者工具 CLI。请通过 WECHAT_DEVTOOLS_CLI 指定路径，或先安装官方开发者工具。');
  }

  assertExists(context.workspacePath, '缺少 MiniGameTest 工作区');
  assertExists(context.packageJsonPath, '缺少 MiniGameTest 工作区 package.json');
  assertExists(casePaths.absolutePath, '缺少测试用例');

  const sdkStatus = ensureMiniGameTestPackageInstalled(context, resolveSdkStatus(context));
  if (!sdkStatus.installed) {
    throw new Error('MiniGameTest SDK 安装失败。');
  }

  if (!skipOpen) {
    runCommand(cliPath, [
      'auto',
      '--project', context.layout.projectRoot,
      '--port', String(servicePort),
      '--auto-port', String(automationPort)
    ], context.layout.projectRoot);
  }

  runCommand(process.execPath, [casePaths.absolutePath, '-t', 'ide', '-p', String(automationPort)], context.workspacePath);

  console.log('[minigame-test] 用例执行完成');
  console.log('- 默认工作区:', formatProjectPath(context.layout, context.workspacePath));
  console.log('- 用例:', formatProjectPath(context.layout, casePaths.absolutePath));
  console.log('- CLI:', cliPath);
  console.log('- 服务端口:', servicePort);
  console.log('- 自动化端口:', automationPort);
}

function runCommand(command, args, cwd) {
  const result = childProcess.spawnSync(command, args, {
    cwd: cwd,
    encoding: 'utf8',
    stdio: 'pipe'
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.status !== 0) {
    throw new Error('命令执行失败: ' + [command].concat(args).join(' '));
  }
}

function readFlag(args, flagName) {
  const prefix = flagName + '=';
  const matchedArg = args.find(function findArg(arg) {
    return arg.startsWith(prefix);
  });
  return matchedArg ? matchedArg.slice(prefix.length) : null;
}

main();
