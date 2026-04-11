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

const DUCK_BUNDLE_CONFIG_RELATIVE_PATH = 'subpackages/DuckBundle/config.duck-bundle.json';

const PATH_SEGMENT_MAP = Object.freeze({
  问号: 'questionMark',
  问号2: 'questionMark2',
  问号3: 'questionMark3',
  随机钉灰: 'randomNailGray',
  高光: 'highlight',
  高光2: 'highlight2',
  星星: 'star',
  剪影3: 'silhouette3',
  无法消除: 'cannotEliminate',
  木桩: 'woodPile',
  槽位已满: 'slotFull',
  背景: 'backgroundPanel',
  钉子光圈: 'nailGlow',
  钥匙: 'key',
  随机道具: 'randomProp',
  难度飙升: 'difficultySurge',
  上层阴影: 'topShadow',
  底: 'base',
  滑动条: 'slider',
  通关数量: 'clearCount',
  飙升: 'surge',
  飙升2: 'surge2',
  鸭子阴影: 'duckShadow',
  t0: 'bubbleFrame0',
  t1: 'bubbleFrame1',
  t2: 'bubbleFrame2',
  t3: 'bubbleFrame3',
  t4: 'bubbleFrame4',
  t5: 'bubbleFrame5',
  t6: 'bubbleFrame6',
  t7: 'bubbleFrame7',
  t8: 'bubbleFrame8',
  t9: 'bubbleFrame9',
  t10: 'bubbleFrame10',
  t11: 'bubbleFrame11',
  t12: 'bubbleFrame12'
});

const LEGACY_SEGMENT_SET = new Set(Object.keys(PATH_SEGMENT_MAP));

function semanticizeDuckBundleReadabilityAssets() {
  const layout = resolveProjectLayout(__dirname);
  const configPath = resolveProjectFilePath(layout, DUCK_BUNDLE_CONFIG_RELATIVE_PATH);
  const configLabel = formatProjectPathFromWorkspace(layout, DUCK_BUNDLE_CONFIG_RELATIVE_PATH);

  const result = updateConfigPathEntries(
    configPath,
    rewritePathSegmentsToSemantic,
    verifyNoLegacyReadabilitySegments
  );

  console.log(
    '[DuckBundle 可读性语义化]',
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

function verifyNoLegacyReadabilitySegments(parsedJson) {
  const legacyPathList = collectLegacyConfigPaths(parsedJson, containsLegacyReadabilitySegment);
  if (legacyPathList.length === 0) {
    return;
  }

  throw new Error(
    '[DuckBundle 可读性语义化] config 仍残留 legacy 中文路径段：' +
      legacyPathList.slice(0, 10).join(', ')
  );
}

function containsLegacyReadabilitySegment(assetPath) {
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

semanticizeDuckBundleReadabilityAssets();
