'use strict';

const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');
const {
  updateConfigPathEntries,
  collectLegacyConfigPaths
} = require('./semanticize-shared');

const UI_BUNDLE_CONFIG_RELATIVE_PATH = 'subpackages/uiBundle/config.ui-bundle.json';
const LEGACY_DUCK_SKIN_PATH_PATTERN = /^tex\/book\/duck\/y([1-9]\d{0,2})\/spriteFrame$/;

function semanticizeUiBundleBookDuckAssets() {
  const layout = resolveProjectLayout(__dirname);
  const configPath = resolveProjectFilePath(layout, UI_BUNDLE_CONFIG_RELATIVE_PATH);
  const configLabel = formatProjectPathFromWorkspace(layout, UI_BUNDLE_CONFIG_RELATIVE_PATH);

  const result = updateConfigPathEntries(
    configPath,
    normalizeDuckSkinPath,
    verifyNoLegacyDuckSkinPaths
  );

  console.log(
    '[uiBundle 路径语义化]',
    configLabel,
    '图鉴鸭子短编号路径改写数:',
    result.replacementCount
  );
}

function normalizeDuckSkinPath(assetPath) {
  const pathValue = String(assetPath || '');
  const matched = pathValue.match(LEGACY_DUCK_SKIN_PATH_PATTERN);
  if (!matched) {
    return pathValue;
  }

  return 'tex/book/duck/duckSkin' + matched[1] + '/spriteFrame';
}

function verifyNoLegacyDuckSkinPaths(parsedJson) {
  const legacyPathList = collectLegacyConfigPaths(parsedJson, function isLegacyDuckPath(pathValue) {
    return LEGACY_DUCK_SKIN_PATH_PATTERN.test(pathValue);
  });

  if (legacyPathList.length === 0) {
    return;
  }

  throw new Error(
    '[uiBundle 路径语义化] config 仍残留图鉴鸭子旧短编号路径：' +
      legacyPathList.slice(0, 10).join(', ')
  );
}

semanticizeUiBundleBookDuckAssets();
