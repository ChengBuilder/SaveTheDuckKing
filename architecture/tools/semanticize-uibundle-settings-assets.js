'use strict';

const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');
const {
  updateConfigPathEntries,
  updateImportJsonNameMap,
  collectLegacyConfigPaths
} = require('./semanticize-shared');

const CONFIG_TARGETS = [
  'subpackages/uiBundle/config.ui-bundle.json'
];

const IMPORT_FILE_MAPPINGS = [
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/failPage/image2__pack_12.json',
    label: 'uiBundle 设置页失败弹窗图集',
    nameMap: {
      '返回主页': 'backToHomeText'
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/revive/percent__pack_16.json',
    label: 'uiBundle 设置页二级弹窗数字图集',
    nameMap: {
      '%': 'percentSign'
    }
  }
];

const SETTINGS_PATH_MAP = {
  'tex/设置/x': 'tex/settings/closeIcon',
  'tex/设置/关': 'tex/settings/toggleOffState',
  'tex/设置/关(字)': 'tex/settings/toggleOffText',
  'tex/设置/开': 'tex/settings/toggleOnState',
  'tex/设置/开(字)': 'tex/settings/toggleOnText',
  'tex/设置/开关槽': 'tex/settings/toggleTrackPrimary',
  'tex/设置/开关槽1': 'tex/settings/toggleTrackSecondary',
  'tex/设置/放弃挑战': 'tex/settings/giveUpChallengeText',
  'tex/设置/设置': 'tex/settings/settingsText',
  'tex/设置/返回主页': 'tex/settings/backToHomeText',
  'tex/设置/震动': 'tex/settings/vibrationText',
  'tex/设置/震动图标': 'tex/settings/vibrationIcon',
  'tex/设置/音乐': 'tex/settings/musicText',
  'tex/设置/音乐图标': 'tex/settings/musicIcon',
  'tex/设置/音效': 'tex/settings/soundEffectText',
  'tex/设置/音效图标': 'tex/settings/soundEffectIcon',
  'tex/设置/齿轮': 'tex/settings/gearIcon',
  'tex/设置二级/%': 'tex/settingsDialog/percentSign',
  'tex/设置二级/再试试': 'tex/settingsDialog/tryAgainText',
  'tex/设置二级/当前进度：': 'tex/settingsDialog/currentProgressText',
  'tex/设置二级/确定吗': 'tex/settingsDialog/confirmQuestionText',
  'tex/设置二级/马上要通关了': 'tex/settingsDialog/nearCompletionText',
  'tex/设置二级/鸭子set': 'tex/settingsDialog/duckSetText'
};

const LEGACY_PATH_PATTERN = /^tex\/设置(?:二级)?\/.+$/;
/**
 * 把 uiBundle 设置模块历史中文目录名收敛到语义化英文目录。
 * 当前策略：
 * 1. tex/设置/* -> tex/settings/*
 * 2. tex/设置二级/* -> tex/settingsDialog/*
 * 3. 当前仓库内仍残留的设置相关 pack 名称按文件级目标收敛到语义化英文名
 */
function semanticizeUiBundleSettingsAssets() {
  const layout = resolveProjectLayout(__dirname);

  const configResults = CONFIG_TARGETS.map((relativePath) => {
    const absolutePath = resolveProjectFilePath(layout, relativePath);
    return updateUiBundleConfig(absolutePath, formatProjectPathFromWorkspace(layout, relativePath));
  });

  const importResults = IMPORT_FILE_MAPPINGS.map((target) => {
    const absolutePath = resolveProjectFilePath(layout, target.relativePath);
    return updateImportJsonNameMap(absolutePath, target.label, target.nameMap, 'uiBundle语义化');
  });

  console.log('[uiBundle语义化] 已完成设置模块目录与 SpriteFrame 命名收敛。');
  for (const result of configResults) {
    console.log(
      '[uiBundle语义化] 配置更新:',
      result.label,
      '路径改写数:',
      result.replacementCount
    );
  }
  for (const result of importResults) {
    console.log(
      '[uiBundle语义化] 元数据更新:',
      result.label,
      '名称改写数:',
      result.replacementCount
    );
  }
}

/**
 * 更新 uiBundle 配置中的设置路径。
 * @param {string} filePath 配置绝对路径
 * @param {string} displayLabel 展示标签
 * @returns {{label: string, replacementCount: number}}
 */
function updateUiBundleConfig(filePath, displayLabel) {
  const result = updateConfigPathEntries(filePath, normalizeUiBundleSettingsPath, (parsedJson) => {
    verifyNoLegacyUiBundleSettingsPaths(parsedJson, displayLabel);
  });

  return {
    label: displayLabel,
    replacementCount: result.replacementCount
  };
}

/**
 * 规范化 uiBundle 设置路径。
 * @param {string} assetPath 原始路径
 * @returns {string}
 */
function normalizeUiBundleSettingsPath(assetPath) {
  const normalizedPath = String(assetPath || '');

  for (const [legacyBasePath, semanticBasePath] of Object.entries(SETTINGS_PATH_MAP)) {
    if (normalizedPath === legacyBasePath) {
      return semanticBasePath;
    }
    if (normalizedPath.startsWith(legacyBasePath + '/')) {
      return semanticBasePath + normalizedPath.slice(legacyBasePath.length);
    }
  }

  return normalizedPath;
}

/**
 * 校验配置里已经没有旧设置路径。
 * @param {{paths?: Record<string, unknown>}} parsedJson 配置 JSON
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacyUiBundleSettingsPaths(parsedJson, displayLabel) {
  const legacyPathList = collectLegacyConfigPaths(parsedJson, (pathValue) => {
    return LEGACY_PATH_PATTERN.test(pathValue);
  });

  if (legacyPathList.length > 0) {
    throw new Error(
      '[uiBundle语义化] 配置中仍残留设置旧路径：' +
      displayLabel +
      ' -> ' +
      legacyPathList.slice(0, 5).join(', ')
    );
  }
}

semanticizeUiBundleSettingsAssets();
