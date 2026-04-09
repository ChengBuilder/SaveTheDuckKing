'use strict';

const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');
const {
  updateConfigPathEntries,
  updateImportSpriteFrameNames,
  collectLegacyConfigPaths,
  collectLegacySpriteFrameFiles,
  escapeRegExp
} = require('./semanticize-shared');

const CONFIG_TARGETS = [
  'subpackages/uiBundle/config.ui-bundle.json',
  'assets/uibundle/config.json',
  'assets/uiBundlebundle/config.json'
];

const IMPORT_DIRECTORY_TARGETS = [
  'subpackages/uiBundle/import',
  'assets/uibundle/import',
  'assets/uiBundlebundle/import'
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

const SPRITE_FRAME_NAME_MAP = {
  x: 'closeIcon',
  关: 'toggleOffState',
  '关(字)': 'toggleOffText',
  开: 'toggleOnState',
  '开(字)': 'toggleOnText',
  开关槽: 'toggleTrackPrimary',
  开关槽1: 'toggleTrackSecondary',
  放弃挑战: 'giveUpChallengeText',
  设置: 'settingsText',
  震动: 'vibrationText',
  震动图标: 'vibrationIcon',
  音乐: 'musicText',
  音乐图标: 'musicIcon',
  音效: 'soundEffectText',
  音效图标: 'soundEffectIcon',
  齿轮: 'gearIcon',
  再试试: 'tryAgainText',
  '当前进度：': 'currentProgressText',
  确定吗: 'confirmQuestionText',
  马上要通关了: 'nearCompletionText',
  鸭子set: 'duckSetText'
};

const LEGACY_PATH_PATTERN = /^tex\/设置(?:二级)?\/.+$/;
const LEGACY_NAME_KEYS = Object.keys(SPRITE_FRAME_NAME_MAP).sort((leftToken, rightToken) => {
  return rightToken.length - leftToken.length;
});
const LEGACY_NAME_PATTERN = new RegExp(
  '"name":"(' + LEGACY_NAME_KEYS.map(escapeRegExp).join('|') + ')"',
  'g'
);

/**
 * 把 uiBundle 设置模块历史中文目录名收敛到语义化英文目录。
 * 当前策略：
 * 1. tex/设置/* -> tex/settings/*
 * 2. tex/设置二级/* -> tex/settingsDialog/*
 * 3. 对应 SpriteFrame 名同步改为语义化英文名
 */
function semanticizeUiBundleSettingsAssets() {
  const layout = resolveProjectLayout(__dirname);

  const configResults = CONFIG_TARGETS.map((relativePath) => {
    const absolutePath = resolveProjectFilePath(layout, relativePath);
    return updateUiBundleConfig(absolutePath, formatProjectPathFromWorkspace(layout, relativePath));
  });

  const importResults = IMPORT_DIRECTORY_TARGETS.map((relativePath) => {
    const absolutePath = resolveProjectFilePath(layout, relativePath);
    return updateUiBundleImportNames(absolutePath, formatProjectPathFromWorkspace(layout, relativePath));
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
      '文件更新数:',
      result.updatedFileCount,
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
 * 更新 uiBundle import 目录中的设置 SpriteFrame 名称。
 * @param {string} directoryPath import 目录
 * @param {string} displayLabel 展示标签
 * @returns {{label: string, updatedFileCount: number, replacementCount: number}}
 */
function updateUiBundleImportNames(directoryPath, displayLabel) {
  const result = updateImportSpriteFrameNames(directoryPath, LEGACY_NAME_PATTERN, (token) => {
    return SPRITE_FRAME_NAME_MAP[token];
  });

  verifyNoLegacyUiBundleSettingsNames(directoryPath, displayLabel);

  return {
    label: displayLabel,
    updatedFileCount: result.updatedFileCount,
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

/**
 * 校验 import 目录里已不存在旧设置 SpriteFrame 名称。
 * @param {string} directoryPath import 目录
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacyUiBundleSettingsNames(directoryPath, displayLabel) {
  const legacyFileList = collectLegacySpriteFrameFiles(directoryPath, LEGACY_NAME_PATTERN);

  if (legacyFileList.length > 0) {
    throw new Error(
      '[uiBundle语义化] import 元数据仍残留设置旧名称：' +
      displayLabel +
      ' -> ' +
      legacyFileList.slice(0, 5).join(', ')
    );
  }
}

semanticizeUiBundleSettingsAssets();
