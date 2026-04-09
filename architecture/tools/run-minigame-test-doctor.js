'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveMiniGameTestContext,
  resolveCliPath,
  resolveServicePort,
  resolveAutomationPort,
  resolveCasePaths,
  resolveSdkStatus,
  validateNodeVersion,
  validatePortPair,
  formatProjectPath
} = require('./wechat-minigame-test-common');

function main() {
  const args = process.argv.slice(2);
  const allowMissingSdk = args.includes('--allow-missing-sdk');
  const jsonOnly = args.includes('--json');
  const context = resolveMiniGameTestContext(__dirname);
  const nodeVersion = validateNodeVersion();
  const cliPath = resolveCliPath();
  const servicePort = resolveServicePort();
  const automationPort = resolveAutomationPort();
  const casePaths = resolveCasePaths(context, readFlag(args, '--case'));
  const sdkStatus = resolveSdkStatus(context);
  const findings = [];

  if (!nodeVersion.satisfiesRequirement) {
    findings.push('Node.js 版本过低：当前 ' + nodeVersion.versionText + '，官方要求 >= 8.8.0。');
  }

  if (!cliPath) {
    findings.push('未找到微信开发者工具 CLI，请通过 WECHAT_DEVTOOLS_CLI 指定路径，或安装官方开发者工具。');
  }

  try {
    validatePortPair(servicePort, automationPort);
  } catch (error) {
    findings.push(error.message);
  }

  if (!fs.existsSync(context.workspacePath)) {
    findings.push('缺少 MiniGameTest 工作区目录：' + context.workspaceRelativePath);
  }
  if (!fs.existsSync(context.packageJsonPath)) {
    findings.push('缺少 MiniGameTest 工作区 package.json：' + context.packageJsonRelativePath);
  }
  if (!fs.existsSync(casePaths.absolutePath)) {
    findings.push('缺少默认测试用例：' + casePaths.relativePath);
  }

  if (!sdkStatus.installed && !sdkStatus.tgzPath && !allowMissingSdk) {
    findings.push(
      '未找到官方 MiniGameTest SDK。请把 mini_game_test-*.tgz 放到 ' +
      context.vendorRelativePath + '，或通过 WECHAT_MINIGAME_TEST_SDK_TGZ 指定。'
    );
  }

  const report = {
    status: findings.length === 0 ? 'ok' : 'error',
    officialDocs: context.officialDocs,
    projectPath: context.layout.projectPathFromWorkspace || './',
    cliPath: cliPath,
    nodeVersion: nodeVersion.versionText,
    servicePort: servicePort,
    automationPort: automationPort,
    testWorkspace: formatProjectPath(context.layout, context.workspacePath),
    defaultCase: formatProjectPath(context.layout, casePaths.absolutePath),
    sdk: {
      installed: sdkStatus.installed,
      installedPath: sdkStatus.installedPath ? formatProjectPath(context.layout, sdkStatus.installedPath) : null,
      tgzPath: sdkStatus.tgzPath ? formatPath(context.layout.projectRoot, sdkStatus.tgzPath) : null,
      allowMissingSdk: allowMissingSdk
    },
    findings: findings,
    notes: [
      '官方要求先在开发者工具中开启安全设置里的服务端口。',
      '官方教程要求自动化监听端口不能与开发者工具服务端口相同。',
      '官方 JS 版本 MiniGameTest 需要通过 mini_game_test-*.tgz 安装。'
    ]
  };

  if (jsonOnly) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printDoctorReport(report);
  }

  if (findings.length > 0) {
    process.exitCode = 1;
  }
}

function printDoctorReport(report) {
  console.log('[minigame-test-doctor] MiniGameTest 环境检查');
  console.log('- 项目:', report.projectPath);
  console.log('- CLI:', report.cliPath || '未找到');
  console.log('- Node:', report.nodeVersion);
  console.log('- 服务端口:', report.servicePort);
  console.log('- 自动化端口:', report.automationPort);
  console.log('- 工作区:', report.testWorkspace);
  console.log('- 默认用例:', report.defaultCase);
  console.log('- SDK 已安装:', report.sdk.installed ? '是' : '否');
  console.log('- SDK tgz:', report.sdk.tgzPath || '未提供');

  if (report.findings.length === 0) {
    console.log('[minigame-test-doctor] 通过');
    return;
  }

  console.error('[minigame-test-doctor] 失败：');
  for (const finding of report.findings) {
    console.error('- ' + finding);
  }
}

function readFlag(args, flagName) {
  const prefix = flagName + '=';
  const matchedArg = args.find(function findArg(arg) {
    return arg.startsWith(prefix);
  });
  return matchedArg ? matchedArg.slice(prefix.length) : null;
}

function formatPath(projectRoot, absolutePath) {
  return path.isAbsolute(absolutePath)
    ? path.relative(projectRoot, absolutePath).replace(/\\/g, '/') || '.'
    : absolutePath;
}

main();
