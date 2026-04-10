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
    relativePath: 'subpackages/uiBundle/import/_packs/tex/bottom__pack_30.json',
    label: 'uiBundle 图鉴皮肤页底部图集',
    nameMap: {
      p8: 'skinPage8',
      p1: 'skinPage1'
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/banner__pack_20.json',
    label: 'uiBundle 图鉴皮肤页标题图集',
    nameMap: {
      p10: 'skinPage10',
      p9: 'skinPage9',
      p6: 'skinPage6'
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/share__pack_22.json',
    label: 'uiBundle 图鉴皮肤页分享图集',
    nameMap: {
      p2: 'skinPage2',
      p4: 'skinPage4',
      p3: 'skinPage3',
      p5: 'skinPage5'
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/bottom__pack_32.json',
    label: 'uiBundle 图鉴皮肤页结算图集',
    nameMap: {
      p7: 'skinPage7'
    }
  }
];

const LEGACY_SKIN_PATH_PATTERN = /^tex\/book\/鸽鸽图鉴\/皮肤图鉴\/p(10|[1-9])(?:\/(spriteFrame|texture))?$/;
/**
 * 把 uiBundle 图鉴皮肤页短 token 命名（p1..p10）收敛为可读命名。
 * 当前策略：
 * 1. tex/book/鸽鸽图鉴/皮肤图鉴/pN -> tex/book/pigeonGallery/skinCollection/skinPageN
 * 2. 当前仓库内仍承载皮肤页短 token 的 pack 名称按文件级目标收敛到 skinPageN
 */
function semanticizeUiBundleBookSkinAssets() {
  const layout = resolveProjectLayout(__dirname);

  const configResults = CONFIG_TARGETS.map((relativePath) => {
    const absolutePath = resolveProjectFilePath(layout, relativePath);
    return updateUiBundleConfig(absolutePath, formatProjectPathFromWorkspace(layout, relativePath));
  });

  const importResults = IMPORT_FILE_MAPPINGS.map((target) => {
    const absolutePath = resolveProjectFilePath(layout, target.relativePath);
    return updateImportJsonNameMap(absolutePath, target.label, target.nameMap, 'uiBundle语义化');
  });

  console.log('[uiBundle语义化] 已完成图鉴皮肤页命名收敛。');
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
 * 更新 uiBundle 配置中的图鉴皮肤页路径。
 * @param {string} filePath 配置绝对路径
 * @param {string} displayLabel 展示标签
 * @returns {{label: string, replacementCount: number}}
 */
function updateUiBundleConfig(filePath, displayLabel) {
  const result = updateConfigPathEntries(filePath, normalizeUiBundleSkinPath, (parsedJson) => {
    verifyNoLegacyUiBundleSkinPaths(parsedJson, displayLabel);
  });

  return {
    label: displayLabel,
    replacementCount: result.replacementCount
  };
}

/**
 * 规范化 uiBundle 图鉴皮肤页路径。
 * @param {string} assetPath 原始路径
 * @returns {string}
 */
function normalizeUiBundleSkinPath(assetPath) {
  const matched = String(assetPath || '').match(LEGACY_SKIN_PATH_PATTERN);
  if (!matched) {
    return String(assetPath || '');
  }

  const pageIndex = matched[1];
  const suffix = matched[2] || '';
  const semanticBasePath = 'tex/book/pigeonGallery/skinCollection/skinPage' + pageIndex;

  if (!suffix) {
    return semanticBasePath;
  }

  return semanticBasePath + '/' + suffix;
}

/**
 * 校验配置里已经没有旧图鉴皮肤页路径。
 * @param {{paths?: Record<string, unknown>}} parsedJson 配置 JSON
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacyUiBundleSkinPaths(parsedJson, displayLabel) {
  const legacyPathList = collectLegacyConfigPaths(parsedJson, (pathValue) => {
    return LEGACY_SKIN_PATH_PATTERN.test(pathValue);
  });

  if (legacyPathList.length > 0) {
    throw new Error(
      '[uiBundle语义化] 配置中仍残留图鉴皮肤页旧路径：' +
      displayLabel +
      ' -> ' +
      legacyPathList.slice(0, 5).join(', ')
    );
  }
}

semanticizeUiBundleBookSkinAssets();
