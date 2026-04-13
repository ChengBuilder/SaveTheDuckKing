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

const ANI_BUNDLE_CONFIG_RELATIVE_PATH = 'subpackages/aniBundle/config.animation-bundle.json';

// 该路径由启动流程显式加载，先保持稳定不改。
const RUNTIME_RETAINED_PATH_PATTERNS = Object.freeze([
  /^prefab\/SubBg(?:\/|$)/
]);

const PATH_SEGMENT_MAP = Object.freeze({
  吃饱动画: 'eatFullAnimation',
  'eatFull': 'eatFull',
  圈动画: 'ringAnimation',
  ZYQ: 'ringLoop',
  套鹅动画: 'gooseTrapAnimation',
  小三视频: 'sideStoryVideo',
  开始动画: 'startAnimation',
  引导动画: 'tutorialAnimation',
  戴夫: 'daveAnimation',
  杀手动画: 'assassinAnimation',
  标题动画1: 'titleAnimation1',
  每日: 'dailyAnimation',
  比比拉布: 'bibiLabuAnimation',
  直玩动画: 'instantPlayAnimation',
  破门动画: 'doorBreakAnimation',
  陀螺仪: 'gyroscopeAnimation',
  鸽子动画: 'pigeonAnimation',
  new_dove: 'newDove',
  神兽动画合集: 'mythicCollection',
  百鸭朝雀: 'hundredDucksToSparrow',
  百鸭朝鲲: 'hundredDucksToKun',
  百鸭朝龙: 'hundredDucksToDragon',
  百鹅朝凤: 'hundredGeeseToPhoenix',
  百鹅朝鹏: 'hundredGeeseToRoc',
  百鹅朝麟: 'hundredGeeseToQilin',
  骨骼动画: 'skeletonAnimations',
  鸭子动画: 'duckAnimation',
  门动画: 'doorAnimation'
});

const LEGACY_SEGMENT_SET = new Set(Object.keys(PATH_SEGMENT_MAP));

function semanticizeAniBundleCanonicalPaths() {
  const layout = resolveProjectLayout(__dirname);
  const configPath = resolveProjectFilePath(layout, ANI_BUNDLE_CONFIG_RELATIVE_PATH);
  const configLabel = formatProjectPathFromWorkspace(layout, ANI_BUNDLE_CONFIG_RELATIVE_PATH);

  const result = updateConfigPathEntries(
    configPath,
    rewritePathSegmentsToSemantic,
    verifyNoLegacySegments
  );

  console.log(
    '[aniBundle 路径语义化]',
    configLabel,
    'canonical path 改写数:',
    result.replacementCount
  );
}

function rewritePathSegmentsToSemantic(assetPath) {
  if (typeof assetPath !== 'string' || assetPath.length === 0) {
    return assetPath;
  }

  if (isRuntimeRetainedPath(assetPath)) {
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

function verifyNoLegacySegments(parsedJson) {
  const legacyPathList = collectLegacyConfigPaths(parsedJson, containsLegacySegment);
  if (legacyPathList.length === 0) {
    return;
  }

  throw new Error(
    '[aniBundle 路径语义化] config 仍残留 legacy 路径段：' +
      legacyPathList.slice(0, 10).join(', ')
  );
}

function containsLegacySegment(assetPath) {
  if (typeof assetPath !== 'string' || assetPath.length === 0) {
    return false;
  }

  if (isRuntimeRetainedPath(assetPath)) {
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

function isRuntimeRetainedPath(assetPath) {
  for (let index = 0; index < RUNTIME_RETAINED_PATH_PATTERNS.length; index += 1) {
    if (RUNTIME_RETAINED_PATH_PATTERNS[index].test(assetPath)) {
      return true;
    }
  }

  return false;
}

semanticizeAniBundleCanonicalPaths();
