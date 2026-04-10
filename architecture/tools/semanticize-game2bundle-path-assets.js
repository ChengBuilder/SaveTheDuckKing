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

const GAME2_BUNDLE_CONFIG_RELATIVE_PATH = 'subpackages/Game2Bundle/config.game2-bundle.json';

const PATH_SEGMENT_MAP = Object.freeze({
  '背景': 'background',
  '道具': 'props',
  '解锁进度': 'unlockProgress',
  '解锁进度2': 'unlockProgress2',
  '移除槽位中的水果': 'removeFruitFromSlot',
  '打乱水果位置': 'shuffleFruitPositions',
  '消除2组水果': 'clearTwoFruitGroups',
  '剩余': 'remaining',
  '随机问号': 'randomQuestionMark',
  '随机水果': 'randomFruit',
  '洞': 'hole',
  '遮罩': 'mask'
});

const LEGACY_SEGMENTS = Object.freeze(Object.keys(PATH_SEGMENT_MAP));
const LEGACY_SEGMENT_SET = new Set(LEGACY_SEGMENTS);

function semanticizeGame2BundleCanonicalPaths() {
  const layout = resolveProjectLayout(__dirname);
  const configPath = resolveProjectFilePath(layout, GAME2_BUNDLE_CONFIG_RELATIVE_PATH);
  const configLabel = formatProjectPathFromWorkspace(layout, GAME2_BUNDLE_CONFIG_RELATIVE_PATH);

  const result = updateConfigPathEntries(
    configPath,
    rewritePathSegmentsToSemantic,
    verifyNoLegacyChineseSegments
  );

  console.log(
    '[Game2Bundle 路径语义化]',
    configLabel,
    'canonical path 改写数:',
    result.replacementCount
  );
}

function rewritePathSegmentsToSemantic(assetPath) {
  if (typeof assetPath !== 'string' || assetPath.length === 0) {
    return assetPath;
  }

  const segments = assetPath.split('/');
  let changed = false;

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const semanticSegment = PATH_SEGMENT_MAP[segment];
    if (!semanticSegment || semanticSegment === segment) {
      continue;
    }
    segments[index] = semanticSegment;
    changed = true;
  }

  return changed ? segments.join('/') : assetPath;
}

function verifyNoLegacyChineseSegments(parsedJson) {
  const legacyPathList = collectLegacyConfigPaths(parsedJson, containsLegacySegment);
  if (legacyPathList.length === 0) {
    return;
  }

  throw new Error(
    '[Game2Bundle 路径语义化] config 仍残留 legacy 中文路径段：' +
      legacyPathList.slice(0, 10).join(', ')
  );
}

function containsLegacySegment(assetPath) {
  if (typeof assetPath !== 'string' || assetPath.length === 0) {
    return false;
  }

  const segments = assetPath.split('/');
  for (let index = 0; index < segments.length; index += 1) {
    if (LEGACY_SEGMENT_SET.has(segments[index])) {
      return true;
    }
  }

  return false;
}

semanticizeGame2BundleCanonicalPaths();
