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
  'subpackages/HomeBundle/config.home-bundle.json',
  'assets/homebundle/config.json',
  'assets/HomeBundlebundle/config.json'
];

const IMPORT_DIRECTORY_TARGETS = [
  'subpackages/HomeBundle/import',
  'assets/homebundle/import',
  'assets/HomeBundlebundle/import'
];

const PARTICLE_PATH_MAP = {
  'tex/BgParticle/p1': 'tex/backgroundParticles/whiteGlowParticle',
  'tex/BgParticle/p2': 'tex/backgroundParticles/orangeGlowParticle',
  'tex/BgParticle/p3': 'tex/backgroundParticles/greenLeafParticle',
  'tex/BgParticle/p4': 'tex/backgroundParticles/orangeLeafParticle'
};

const PARTICLE_NAME_MAP = {
  p1: 'whiteGlowParticle',
  p2: 'orangeGlowParticle',
  p3: 'greenLeafParticle',
  p4: 'orangeLeafParticle'
};

const HOME_THEME_PATH_RULES = [
  { pattern: /\/foreground\/f([1-5])(?=\/|$)/g, replacement: '/foreground/foregroundLayer$1' },
  { pattern: /\/midground\/m([1-2])(?=\/|$)/g, replacement: '/midground/midgroundLayer$1' },
  { pattern: /\/background\/b([1-2])(?=\/|$)/g, replacement: '/background/backgroundLayer$1' },
  { pattern: /\/distant\/l1(?=\/|$)/g, replacement: '/distant/distantLayer1' },
  { pattern: /\/homeBg[0-9](?=\/|$)/g, replacement: '/themeBackground' },
  { pattern: /\/bottom[0-9](?=\/|$)/g, replacement: '/bottomOverlay' },
  { pattern: /\/雾(?=\/|$)/g, replacement: '/fogOverlay' }
];

const LEGACY_HOME_THEME_LEAF_PATH_PATTERNS = [
  /\/foreground\/f[1-5](?:\/|$)/,
  /\/midground\/m[1-2](?:\/|$)/,
  /\/background\/b[1-2](?:\/|$)/,
  /\/distant\/l1(?:\/|$)/,
  /\/homeBg[0-9](?:\/|$)/,
  /\/bottom[0-9](?:\/|$)/,
  /\/雾(?:\/|$)/
];

const SPRITE_FRAME_NAME_MAP = {
  p1: 'whiteGlowParticle',
  p2: 'orangeGlowParticle',
  p3: 'greenLeafParticle',
  p4: 'orangeLeafParticle',
  f1: 'foregroundLayer1',
  f2: 'foregroundLayer2',
  f3: 'foregroundLayer3',
  f4: 'foregroundLayer4',
  f5: 'foregroundLayer5',
  m1: 'midgroundLayer1',
  m2: 'midgroundLayer2',
  b1: 'backgroundLayer1',
  b2: 'backgroundLayer2',
  l1: 'distantLayer1',
  homeBg0: 'themeBackground',
  homeBg1: 'themeBackground',
  homeBg2: 'themeBackground',
  homeBg3: 'themeBackground',
  homeBg4: 'themeBackground',
  homeBg5: 'themeBackground',
  bottom0: 'bottomOverlay',
  bottom1: 'bottomOverlay',
  bottom2: 'bottomOverlay',
  bottom3: 'bottomOverlay',
  bottom4: 'bottomOverlay',
  bottom5: 'bottomOverlay',
  雾: 'fogOverlay'
};

const LEGACY_SPRITE_NAME_KEYS = Object.keys(SPRITE_FRAME_NAME_MAP).sort((leftToken, rightToken) => {
  return rightToken.length - leftToken.length;
});
const LEGACY_SPRITE_NAME_PATTERN = new RegExp(
  '"name":"(' + LEGACY_SPRITE_NAME_KEYS.map(escapeRegExp).join('|') + ')"',
  'g'
);

const LEGACY_BG_THINGS_PATTERN = /^tex\/BgThings(\d+)\//;
const LEGACY_LAYER_SEGMENT_PATTERN = /\/(front|middle|back|last)\//;
const LEGACY_PARTICLE_PATH_PATTERN = /^tex\/BgParticle\/p[1-4](?:\/(?:spriteFrame|texture))?$/;

/**
 * 把 HomeBundle 背景素材目录和已确认语义的背景粒子统一收敛到可读路径。
 * 当前策略：
 * 1. BgThingsX -> homeThemeX
 * 2. front/middle/back/last -> foreground/midground/background/distant
 * 3. BgParticle/p1..p4 -> backgroundParticles/*Particle
 * 4. homeTheme 叶子命名收敛（f/m/b/l/homeBg/bottom/雾）
 */
function semanticizeHomeBundleAssets() {
  const layout = resolveProjectLayout(__dirname);

  const configResults = CONFIG_TARGETS.map((relativePath) => {
    const absolutePath = resolveProjectFilePath(layout, relativePath);
    return updateHomeBundleConfig(absolutePath, formatProjectPathFromWorkspace(layout, relativePath));
  });

  const importResults = IMPORT_DIRECTORY_TARGETS.map((relativePath) => {
    const absolutePath = resolveProjectFilePath(layout, relativePath);
    return updateSpriteFrameImportNames(absolutePath, formatProjectPathFromWorkspace(layout, relativePath));
  });

  console.log('[HomeBundle语义化] 已完成背景目录与 SpriteFrame 名称语义化收敛。');
  for (const result of configResults) {
    console.log(
      '[HomeBundle语义化] 配置更新:',
      result.label,
      '路径改写数:',
      result.replacementCount
    );
  }
  for (const result of importResults) {
    console.log(
      '[HomeBundle语义化] 元数据更新:',
      result.label,
      '文件更新数:',
      result.updatedFileCount,
      '名称改写数:',
      result.replacementCount
    );
  }
}

/**
 * 更新 HomeBundle 配置中的路径。
 * @param {string} filePath 配置绝对路径
 * @param {string} displayLabel 展示标签
 * @returns {{label: string, replacementCount: number}}
 */
function updateHomeBundleConfig(filePath, displayLabel) {
  const result = updateConfigPathEntries(filePath, normalizeHomeBundlePath, (parsedJson) => {
    verifyNoLegacyHomeBundlePathEntries(parsedJson, displayLabel);
  });

  return {
    label: displayLabel,
    replacementCount: result.replacementCount
  };
}

/**
 * 更新 HomeBundle SpriteFrame 元数据名。
 * @param {string} directoryPath import 目录
 * @param {string} displayLabel 展示标签
 * @returns {{label: string, updatedFileCount: number, replacementCount: number}}
 */
function updateSpriteFrameImportNames(directoryPath, displayLabel) {
  const result = updateImportSpriteFrameNames(directoryPath, LEGACY_SPRITE_NAME_PATTERN, (token) => {
    return SPRITE_FRAME_NAME_MAP[token];
  });

  verifyNoLegacySpriteFrameNames(directoryPath, displayLabel);

  return {
    label: displayLabel,
    updatedFileCount: result.updatedFileCount,
    replacementCount: result.replacementCount
  };
}

/**
 * 规范化 HomeBundle 单条路径。
 * @param {string} assetPath 原始路径
 * @returns {string}
 */
function normalizeHomeBundlePath(assetPath) {
  let normalizedPath = String(assetPath || '');

  for (const [legacyPrefix, semanticPrefix] of Object.entries(PARTICLE_PATH_MAP)) {
    if (normalizedPath === legacyPrefix) {
      return semanticPrefix;
    }
    if (normalizedPath === legacyPrefix + '/spriteFrame') {
      return semanticPrefix + '/spriteFrame';
    }
    if (normalizedPath === legacyPrefix + '/texture') {
      return semanticPrefix + '/texture';
    }
  }

  normalizedPath = normalizedPath.replace(/^tex\/BgThings(\d+)\//, 'tex/homeTheme$1/');
  normalizedPath = normalizedPath
    .replace('/front/', '/foreground/')
    .replace('/middle/', '/midground/')
    .replace('/back/', '/background/')
    .replace('/last/', '/distant/');

  if (normalizedPath.startsWith('tex/homeTheme')) {
    for (const rule of HOME_THEME_PATH_RULES) {
      normalizedPath = normalizedPath.replace(rule.pattern, rule.replacement);
    }
  }

  return normalizedPath;
}

/**
 * 校验配置里已经没有旧命名路径。
 * @param {{paths?: Record<string, unknown>}} parsedJson 配置 JSON
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacyHomeBundlePathEntries(parsedJson, displayLabel) {
  const legacyPathList = collectLegacyConfigPaths(parsedJson, (pathValue) => {
    const hasLegacyHomeThemeLeafPath = LEGACY_HOME_THEME_LEAF_PATH_PATTERNS.some((pattern) => {
      return pattern.test(pathValue);
    });

    return LEGACY_BG_THINGS_PATTERN.test(pathValue) ||
      LEGACY_LAYER_SEGMENT_PATTERN.test(pathValue) ||
      LEGACY_PARTICLE_PATH_PATTERN.test(pathValue) ||
      hasLegacyHomeThemeLeafPath;
  });

  if (legacyPathList.length > 0) {
    throw new Error(
      '[HomeBundle语义化] 配置中仍残留旧路径：' +
      displayLabel +
      ' -> ' +
      legacyPathList.slice(0, 5).join(', ')
    );
  }
}

/**
 * 校验 import 目录里已不存在旧 SpriteFrame 命名。
 * @param {string} directoryPath import 目录
 * @param {string} displayLabel 展示标签
 */
function verifyNoLegacySpriteFrameNames(directoryPath, displayLabel) {
  const legacyFileList = collectLegacySpriteFrameFiles(directoryPath, LEGACY_SPRITE_NAME_PATTERN);

  if (legacyFileList.length > 0) {
    throw new Error(
      '[HomeBundle语义化] import 元数据仍残留旧 SpriteFrame 名称：' +
      displayLabel +
      ' -> ' +
      legacyFileList.slice(0, 5).join(', ')
    );
  }
}

semanticizeHomeBundleAssets();
