'use strict';

const fs = require('fs');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const GAME_ENTRY_PATH = 'game.js';
const PATH_NORMALIZER_PATH = 'architecture/boot/asset-path-normalizer.js';
const APP_LIFECYCLE_PATH = 'architecture/boot/app-lifecycle.js';

const LEGACY_COMPAT_RULES = [
  {
    ruleName: 'HomeBundle BgThings 旧路径',
    configPath: 'subpackages/HomeBundle/config.home-bundle.json',
    configLegacyPattern: /^tex\/BgThings\d+\//,
    runtimeLegacyPattern: /tex\/BgThings\d+\//g,
    requiredNormalizerSnippets: [
      'function normalizeHomeBundleLegacyPath',
      'hasLegacyHomeBundlePath(requestInput)',
      'normalizeLegacyBundleRequestInput'
    ],
    enforceNormalizerAlways: true
  },
  {
    ruleName: 'uiBundle 图鉴皮肤页旧路径',
    configPath: 'subpackages/uiBundle/config.ui-bundle.json',
    configLegacyPattern: /^tex\/book\/鸽鸽图鉴\/皮肤图鉴\/p(10|[1-9])(?:\/|$)/,
    runtimeLegacyPattern: /tex\/book\/(?:鸽鸽图鉴|%E9%B8%BD%E9%B8%BD%E5%9B%BE%E9%89%B4)\/(?:皮肤图鉴|%E7%9A%AE%E8%82%A4%E5%9B%BE%E9%89%B4)\/p(10|[1-9])(?:\/|$)/gi,
    requiredNormalizerSnippets: [
      'function normalizeUiBundleLegacyPath',
      'hasLegacyUiBundlePath(requestInput)',
      'normalizeLegacyBundleRequestInput'
    ],
    enforceNormalizerAlways: true
  },
  {
    ruleName: 'uiBundle 设置模块旧路径',
    configPath: 'subpackages/uiBundle/config.ui-bundle.json',
    configLegacyPattern: /^tex\/设置(?:二级)?\/.+(?:\/|$)/,
    runtimeLegacyPattern: /tex\/(?:设置(?:二级)?|%E8%AE%BE%E7%BD%AE(?:%E4%BA%8C%E7%BA%A7)?)(?:\/|%2F)/gi,
    requiredNormalizerSnippets: [
      'UI_BUNDLE_SETTINGS_LEGACY_PATH_MAP',
      'function normalizeUiBundleSettingsLegacyPath',
      'hasLegacyUiBundlePath(requestInput)',
      'normalizeLegacyBundleRequestInput'
    ],
    enforceNormalizerAlways: true
  }
];

/**
 * 校验“语义化改名 + 运行时旧路径兼容”是否同时成立。
 * 防止出现“配置已改名，但运行时仍引用旧路径”导致白屏/缺图。
 */
function checkLegacyRuntimeCompat() {
  const layout = resolveProjectLayout(__dirname);
  const gameEntryAbsolutePath = resolveProjectFilePath(layout, GAME_ENTRY_PATH);
  const normalizerAbsolutePath = resolveProjectFilePath(layout, PATH_NORMALIZER_PATH);
  const appLifecycleAbsolutePath = resolveProjectFilePath(layout, APP_LIFECYCLE_PATH);

  const gameSource = fs.readFileSync(gameEntryAbsolutePath, 'utf8');
  const normalizerSource = fs.readFileSync(normalizerAbsolutePath, 'utf8');
  const appLifecycleSource = fs.readFileSync(appLifecycleAbsolutePath, 'utf8');

  const issues = [];

  assertRequiredBootWiring(appLifecycleSource, issues);
  assertAssetManagerEntryPatch(normalizerSource, issues);

  for (const rule of LEGACY_COMPAT_RULES) {
    verifyConfigNoLegacyPath(layout, rule, issues);
    verifyRuntimeLegacyCompat(rule, gameSource, normalizerSource, issues);
  }

  if (issues.length > 0) {
    console.error('[check-legacy-runtime-compat] 失败：');
    for (const issue of issues) {
      console.error('- ' + issue);
    }
    process.exitCode = 1;
    return;
  }

  console.log('[check-legacy-runtime-compat] 通过');
}

/**
 * 校验生命周期启动链路已接入旧路径兼容补丁。
 * @param {string} appLifecycleSource 生命周期源码
 * @param {string[]} issues 问题收集器
 */
function assertRequiredBootWiring(appLifecycleSource, issues) {
  const requiredSnippets = [
    'applyHomeBundleLegacyPathPatch',
    'applyHomeBundleLegacyPathPatch(engineModule)'
  ];

  for (const snippet of requiredSnippets) {
    if (!appLifecycleSource.includes(snippet)) {
      issues.push('启动链缺少旧路径补丁接入片段：' + snippet);
    }
  }
}

/**
 * 校验 normalizer 仍在 assetManager 稳定入口做代理。
 * @param {string} normalizerSource normalizer 源码
 * @param {string[]} issues 问题收集器
 */
function assertAssetManagerEntryPatch(normalizerSource, issues) {
  const requiredSnippets = [
    "const methodNames = ['loadAny', 'preloadAny'];",
    'normalizeAssetManagerRequestArgs(methodArgs);'
  ];

  for (const snippet of requiredSnippets) {
    if (!normalizerSource.includes(snippet)) {
      issues.push('旧路径兼容未覆盖 assetManager 稳定入口：' + snippet);
    }
  }
}

/**
 * 校验语义化配置中不存在已知旧路径残留。
 * @param {{projectRoot: string, workspaceRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {{ruleName: string, configPath: string, configLegacyPattern: RegExp}} rule 规则定义
 * @param {string[]} issues 问题收集器
 */
function verifyConfigNoLegacyPath(layout, rule, issues) {
  const configAbsolutePath = resolveProjectFilePath(layout, rule.configPath);
  const configRelativePath = formatProjectPathFromWorkspace(layout, rule.configPath);
  const configJson = JSON.parse(fs.readFileSync(configAbsolutePath, 'utf8'));

  const legacyPathList = [];
  for (const pathEntry of Object.values(configJson.paths || {})) {
    if (!Array.isArray(pathEntry) || typeof pathEntry[0] !== 'string') {
      continue;
    }
    if (rule.configLegacyPattern.test(pathEntry[0])) {
      legacyPathList.push(pathEntry[0]);
    }
  }

  if (legacyPathList.length > 0) {
    issues.push(
      '[' + rule.ruleName + '] 配置仍残留旧路径: ' +
      configRelativePath +
      ' -> ' +
      legacyPathList.slice(0, 5).join(', ')
    );
  }
}

/**
 * 校验运行时若仍包含旧路径请求，normalizer 必须具备对应兼容逻辑。
 * @param {{ruleName: string, runtimeLegacyPattern: RegExp, requiredNormalizerSnippets: string[]}} rule 规则定义
 * @param {string} gameSource game.js 源码
 * @param {string} normalizerSource normalizer 源码
 * @param {string[]} issues 问题收集器
 */
function verifyRuntimeLegacyCompat(rule, gameSource, normalizerSource, issues) {
  rule.runtimeLegacyPattern.lastIndex = 0;
  const runtimeLegacyMatches = gameSource.match(rule.runtimeLegacyPattern) || [];
  if (runtimeLegacyMatches.length === 0 && !rule.enforceNormalizerAlways) {
    return;
  }

  const sampleMatches = Array.from(new Set(runtimeLegacyMatches)).slice(0, 3);
  const sampleText = sampleMatches.length > 0
    ? '，样例: ' + sampleMatches.join(', ')
    : '（当前 game.js 未直接命中旧路径样例，仍要求保留兼容补丁）';

  for (const snippet of rule.requiredNormalizerSnippets) {
    if (!normalizerSource.includes(snippet)) {
      issues.push(
        '[' + rule.ruleName + '] 旧路径兼容缺少 normalizer 片段: ' +
        snippet +
        sampleText
      );
    }
  }
}

checkLegacyRuntimeCompat();
