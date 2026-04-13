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

const CONFIG_PATH_MAP = Object.freeze({
  'tex/book/shareCollection/甄嬛鸭/spriteFrame': 'tex/book/shareCollection/zhenHuanDuck/spriteFrame',
  'tex/book/shareCollection/华妃鸭/spriteFrame': 'tex/book/shareCollection/huaFeiDuck/spriteFrame',
  'tex/book/shareCollection/安陵容鸭/spriteFrame': 'tex/book/shareCollection/anLingRongDuck/spriteFrame',
  'tex/book/shareCollection/刘备鸭/spriteFrame': 'tex/book/shareCollection/liuBeiDuck/spriteFrame',
  'tex/book/shareCollection/关羽鸭/spriteFrame': 'tex/book/shareCollection/guanYuDuck/spriteFrame',
  'tex/book/shareCollection/张飞鸭/spriteFrame': 'tex/book/shareCollection/zhangFeiDuck/spriteFrame'
});

const LEGACY_PATH_PATTERNS = Object.freeze([
  /^tex\/book\/shareCollection\/(?:甄嬛鸭|华妃鸭|安陵容鸭|刘备鸭|关羽鸭|张飞鸭)\/spriteFrame$/
]);

function semanticizeUiBundleBookCollectionAssets() {
  const layout = resolveProjectLayout(__dirname);
  const configPath = resolveProjectFilePath(layout, UI_BUNDLE_CONFIG_RELATIVE_PATH);
  const configLabel = formatProjectPathFromWorkspace(layout, UI_BUNDLE_CONFIG_RELATIVE_PATH);

  const result = updateConfigPathEntries(
    configPath,
    normalizeCollectionPath,
    verifyNoLegacyCollectionPaths
  );

  console.log(
    '[uiBundle 路径语义化]',
    configLabel,
    '图鉴动态集合路径改写数:',
    result.replacementCount
  );
}

function normalizeCollectionPath(assetPath) {
  return CONFIG_PATH_MAP[String(assetPath || '')] || String(assetPath || '');
}

function verifyNoLegacyCollectionPaths(parsedJson) {
  const legacyPathList = collectLegacyConfigPaths(parsedJson, function isLegacyCollectionPath(pathValue) {
    return LEGACY_PATH_PATTERNS.some(function matchPattern(pattern) {
      return pattern.test(pathValue);
    });
  });

  if (legacyPathList.length === 0) {
    return;
  }

  throw new Error(
    '[uiBundle 路径语义化] config 仍残留图鉴动态集合旧路径：' +
      legacyPathList.slice(0, 10).join(', ')
  );
}

semanticizeUiBundleBookCollectionAssets();
