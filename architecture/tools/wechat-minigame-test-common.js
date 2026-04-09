'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace,
  normalizePath
} = require('./project-paths');

const DEFAULT_SERVICE_PORT = 9420;
const DEFAULT_AUTOMATION_PORT = 9421;
const MINI_GAME_TEST_PACKAGE_NAME = 'mini_game_test';
const TEST_WORKSPACE_RELATIVE_PATH = 'wechat-test/minigametest';
const TEST_WORKSPACE_PACKAGE_JSON_RELATIVE_PATH = TEST_WORKSPACE_RELATIVE_PATH + '/package.json';
const DEFAULT_CASE_RELATIVE_PATH = TEST_WORKSPACE_RELATIVE_PATH + '/sample/test.js';
const DEFAULT_VENDOR_RELATIVE_PATH = TEST_WORKSPACE_RELATIVE_PATH + '/vendor';
const DEFAULT_CLI_CANDIDATES = Object.freeze([
  process.env.WECHAT_DEVTOOLS_CLI,
  '/Applications/wechatwebdevtools.app/Contents/MacOS/cli',
  '/Applications/微信开发者工具.app/Contents/MacOS/cli'
].filter(Boolean));
const OFFICIAL_MINIGAME_TEST_DOCS = Object.freeze({
  cli: 'https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html',
  setup: 'https://developers.weixin.qq.com/minigame/dev/minigame-testtool/setup.html',
  tutorial: 'https://developers.weixin.qq.com/minigame/dev/minigame-testtool/tutorial.html'
});

function resolveMiniGameTestContext(scriptDirectoryPath) {
  const layout = resolveProjectLayout(scriptDirectoryPath);
  const workspacePath = resolveProjectFilePath(layout, TEST_WORKSPACE_RELATIVE_PATH);
  const packageJsonPath = resolveProjectFilePath(layout, TEST_WORKSPACE_PACKAGE_JSON_RELATIVE_PATH);
  const vendorPath = resolveProjectFilePath(layout, DEFAULT_VENDOR_RELATIVE_PATH);

  return {
    layout,
    workspaceRelativePath: TEST_WORKSPACE_RELATIVE_PATH,
    workspacePath,
    packageJsonRelativePath: TEST_WORKSPACE_PACKAGE_JSON_RELATIVE_PATH,
    packageJsonPath,
    vendorRelativePath: DEFAULT_VENDOR_RELATIVE_PATH,
    vendorPath,
    defaultCaseRelativePath: DEFAULT_CASE_RELATIVE_PATH,
    defaultCasePath: resolveProjectFilePath(layout, DEFAULT_CASE_RELATIVE_PATH),
    officialDocs: OFFICIAL_MINIGAME_TEST_DOCS
  };
}

function resolveCliPath() {
  for (const candidatePath of DEFAULT_CLI_CANDIDATES) {
    if (candidatePath && fs.existsSync(candidatePath)) {
      return candidatePath;
    }
  }
  return null;
}

function readPort(value, defaultValue) {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : defaultValue;
}

function resolveServicePort() {
  return readPort(process.env.WECHAT_DEVTOOLS_SERVICE_PORT, DEFAULT_SERVICE_PORT);
}

function resolveAutomationPort() {
  return readPort(process.env.WECHAT_MINIGAME_TEST_PORT, DEFAULT_AUTOMATION_PORT);
}

function validatePortPair(servicePort, automationPort) {
  if (servicePort === automationPort) {
    throw new Error(
      'MiniGameTest 自动化端口不能与开发者工具服务端口相同。请调整 WECHAT_DEVTOOLS_SERVICE_PORT 或 WECHAT_MINIGAME_TEST_PORT。'
    );
  }
}

function resolveCasePaths(context, relativeOrAbsolutePath) {
  const candidatePath = relativeOrAbsolutePath || process.env.WECHAT_MINIGAME_TEST_CASE || context.defaultCaseRelativePath;
  if (path.isAbsolute(candidatePath)) {
    return {
      relativePath: normalizePath(path.relative(context.layout.projectRoot, candidatePath)),
      absolutePath: candidatePath
    };
  }

  const normalizedRelativePath = normalizeProjectRelativePath(candidatePath);
  return {
    relativePath: normalizedRelativePath,
    absolutePath: resolveProjectFilePath(context.layout, normalizedRelativePath)
  };
}

function normalizeProjectRelativePath(relativePath) {
  const normalizedPath = normalizePath(relativePath || '').replace(/^\/+/, '');
  if (normalizedPath.length === 0) {
    return DEFAULT_CASE_RELATIVE_PATH;
  }
  return normalizedPath;
}

function resolveSdkStatus(context) {
  const installedPackagePaths = [
    path.join(context.workspacePath, 'node_modules', MINI_GAME_TEST_PACKAGE_NAME),
    path.join(context.layout.projectRoot, 'node_modules', MINI_GAME_TEST_PACKAGE_NAME)
  ];

  for (const installedPackagePath of installedPackagePaths) {
    if (fs.existsSync(installedPackagePath)) {
      return {
        packageName: MINI_GAME_TEST_PACKAGE_NAME,
        installed: true,
        installedPath: installedPackagePath,
        tgzPath: null
      };
    }
  }

  const tgzPath = resolveSdkTgzPath(context);
  return {
    packageName: MINI_GAME_TEST_PACKAGE_NAME,
    installed: false,
    installedPath: null,
    tgzPath: tgzPath
  };
}

function resolveSdkTgzPath(context) {
  const configuredTgzPath = String(process.env.WECHAT_MINIGAME_TEST_SDK_TGZ || '').trim();
  if (configuredTgzPath.length > 0) {
    return path.isAbsolute(configuredTgzPath)
      ? configuredTgzPath
      : resolveProjectFilePath(context.layout, normalizeProjectRelativePath(configuredTgzPath));
  }

  if (!fs.existsSync(context.vendorPath) || !fs.statSync(context.vendorPath).isDirectory()) {
    return null;
  }

  const tgzEntries = fs.readdirSync(context.vendorPath)
    .filter(function filterTgzEntry(entryName) {
      return /^mini_game_test.*\.tgz$/i.test(entryName);
    })
    .sort();

  if (tgzEntries.length === 0) {
    return null;
  }

  return path.join(context.vendorPath, tgzEntries[0]);
}

function validateNodeVersion() {
  const versionText = String(process.versions.node || '0.0.0');
  const versionTuple = versionText.split('.').map(function mapSegment(segment) {
    return Number(segment);
  });
  const major = Number.isFinite(versionTuple[0]) ? versionTuple[0] : 0;
  const minor = Number.isFinite(versionTuple[1]) ? versionTuple[1] : 0;

  return {
    versionText,
    satisfiesRequirement: major > 8 || (major === 8 && minor >= 8)
  };
}

function assertExists(absolutePath, description) {
  if (!fs.existsSync(absolutePath)) {
    throw new Error(description + ': ' + absolutePath);
  }
}

function ensureMiniGameTestPackageInstalled(context, sdkStatus) {
  if (sdkStatus.installed) {
    return sdkStatus;
  }

  if (!sdkStatus.tgzPath) {
    throw new Error(
      '未找到官方 MiniGameTest SDK。请把 mini_game_test-*.tgz 放到 ' +
      formatProjectPathFromWorkspace(context.layout, context.vendorRelativePath) +
      '，或通过 WECHAT_MINIGAME_TEST_SDK_TGZ 指定路径。'
    );
  }

  assertExists(context.packageJsonPath, '缺少 MiniGameTest 工作区 package.json');
  assertExists(sdkStatus.tgzPath, 'MiniGameTest SDK tgz 不存在');

  const installResult = childProcess.spawnSync('npm', ['install', '--no-save', sdkStatus.tgzPath], {
    cwd: context.workspacePath,
    encoding: 'utf8',
    stdio: 'pipe'
  });

  if (installResult.stdout) {
    process.stdout.write(installResult.stdout);
  }
  if (installResult.stderr) {
    process.stderr.write(installResult.stderr);
  }

  if (installResult.status !== 0) {
    throw new Error('安装 MiniGameTest SDK 失败: npm install --no-save ' + sdkStatus.tgzPath);
  }

  return resolveSdkStatus(context);
}

function formatProjectPath(layout, absolutePath) {
  return formatProjectPathFromWorkspace(layout, path.relative(layout.projectRoot, absolutePath));
}

const api = {
  DEFAULT_SERVICE_PORT,
  DEFAULT_AUTOMATION_PORT,
  MINI_GAME_TEST_PACKAGE_NAME,
  TEST_WORKSPACE_RELATIVE_PATH,
  TEST_WORKSPACE_PACKAGE_JSON_RELATIVE_PATH,
  DEFAULT_CASE_RELATIVE_PATH,
  DEFAULT_VENDOR_RELATIVE_PATH,
  OFFICIAL_MINIGAME_TEST_DOCS,
  resolveMiniGameTestContext,
  resolveCliPath,
  resolveServicePort,
  resolveAutomationPort,
  validatePortPair,
  resolveCasePaths,
  resolveSdkStatus,
  resolveSdkTgzPath,
  validateNodeVersion,
  ensureMiniGameTestPackageInstalled,
  formatProjectPath,
  assertExists
};

module.exports = api;
module.exports.default = api;
