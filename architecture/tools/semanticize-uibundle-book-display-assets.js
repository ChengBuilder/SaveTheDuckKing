'use strict';

const fs = require('fs');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');
const {
  updateConfigPathEntries,
  collectLegacyConfigPaths,
  escapeRegExp
} = require('./semanticize-shared');

const CONFIG_TARGET = 'subpackages/uiBundle/config.ui-bundle.json';

const CONFIG_PATH_MAP = new Map([
  ['tex/book/tex/全部/spriteFrame', 'tex/book/ui/filterAll/spriteFrame'],
  ['tex/book/tex/100/spriteFrame', 'tex/book/ui/completion100Label/spriteFrame'],
  ['tex/book/tex/标签/spriteFrame', 'tex/book/ui/itemBadge/spriteFrame'],
  ['tex/book/tex/底/spriteFrame', 'tex/book/ui/panelBackground/spriteFrame'],
  ['tex/book/tex/框2/spriteFrame', 'tex/book/ui/itemCardInactiveFrame/spriteFrame'],
  ['tex/book/tex/特殊/spriteFrame', 'tex/book/ui/filterSpecial/spriteFrame'],
  ['tex/book/tex/图鉴/spriteFrame', 'tex/book/ui/collectionTitle/spriteFrame'],
  ['tex/book/tex/框1/spriteFrame', 'tex/book/ui/itemCardActiveFrame/spriteFrame'],
  ['tex/book/tex/使用中/spriteFrame', 'tex/book/ui/equippedBadge/spriteFrame'],
  ['tex/book/tex/旋转光/spriteFrame', 'tex/book/ui/rotatingGlow/spriteFrame'],
  ['tex/book/tex/NO/spriteFrame', 'tex/book/ui/numberPrefix/spriteFrame'],
  ['tex/book/tex/稀有/spriteFrame', 'tex/book/ui/filterRare/spriteFrame'],
  ['tex/book/tex/已收集/spriteFrame', 'tex/book/ui/collectedLabel/spriteFrame'],
  ['tex/book/tex/条2/spriteFrame', 'tex/book/ui/progressTrack/spriteFrame'],
  ['tex/book/tex/条1/spriteFrame', 'tex/book/ui/progressFill/spriteFrame'],
  ['tex/book/鸽鸽图鉴/视频', 'tex/book/ui/videoBadge'],
  ['tex/book/鸽鸽图鉴/视频/texture', 'tex/book/ui/videoBadge/texture'],
  ['tex/book/鸽鸽图鉴/视频/spriteFrame', 'tex/book/ui/videoBadge/spriteFrame'],
  ['tex/book/鸽鸽图鉴/底2/spriteFrame', 'tex/book/ui/pillBase/spriteFrame'],
  ['tex/book/鸽鸽图鉴/鸽鸽图鉴/spriteFrame', 'tex/book/pigeonGallery/titleBanner/spriteFrame'],
  ['tex/book/鸽鸽图鉴/框/spriteFrame', 'tex/book/ui/selectionHalo/spriteFrame'],
  ['tex/book/鸽鸽图鉴/底/spriteFrame', 'tex/book/ui/infoBarBase/spriteFrame']
]);

const IMPORT_FILE_MAPPINGS = [
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/book/tex/bottom__pack_30.json',
    label: 'uiBundle 书册通用 UI 图集',
    nameMap: {
      '全部': 'filterAll',
      '100': 'completion100Label',
      '标签': 'itemBadge',
      '底': 'panelBackground',
      '框2': 'itemCardInactiveFrame',
      '特殊': 'filterSpecial',
      '图鉴': 'collectionTitle',
      '框1': 'itemCardActiveFrame',
      '使用中': 'equippedBadge',
      '旋转光': 'rotatingGlow',
      'NO': 'numberPrefix',
      '稀有': 'filterRare',
      '已收集': 'collectedLabel',
      '条2': 'progressTrack',
      '条1': 'progressFill'
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/bottom__pack_30.json',
    label: 'uiBundle 图鉴条目通用图集',
    nameMap: {
      '底2': 'pillBase',
      '框': 'selectionHalo',
      '底': 'infoBarBase'
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/banner__pack_20.json',
    label: 'uiBundle 鸽子图鉴标题图集',
    nameMap: {
      '鸽鸽图鉴': 'titleBanner'
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/pack/callFriend__pack_15.json',
    label: 'uiBundle 复用标题图集',
    nameMap: {
      '鸽鸽图鉴': 'titleBanner'
    }
  }
];

const LEGACY_CONFIG_PATH_PATTERN = /^tex\/book\/(?:tex|鸽鸽图鉴)\//;

function semanticizeUiBundleBookDisplayAssets() {
  const layout = resolveProjectLayout(__dirname);
  const configAbsolutePath = resolveProjectFilePath(layout, CONFIG_TARGET);
  const configLabel = formatProjectPathFromWorkspace(layout, CONFIG_TARGET);
  const configResult = updateBookConfig(configAbsolutePath, configLabel);
  const importResults = IMPORT_FILE_MAPPINGS.map((target) => {
    const absolutePath = resolveProjectFilePath(layout, target.relativePath);
    return updateImportNames(absolutePath, target.label, target.nameMap);
  });

  console.log('[uiBundle语义化] 已完成图鉴展示资源命名收敛。');
  console.log(
    '[uiBundle语义化] 配置更新:',
    configResult.label,
    '路径改写数:',
    configResult.replacementCount
  );
  for (const result of importResults) {
    console.log(
      '[uiBundle语义化] 元数据更新:',
      result.label,
      '名称改写数:',
      result.replacementCount
    );
  }
}

function updateBookConfig(filePath, displayLabel) {
  const result = updateConfigPathEntries(filePath, normalizeBookPath, (parsedJson) => {
    verifyNoLegacyBookPaths(parsedJson, displayLabel);
  });

  return {
    label: displayLabel,
    replacementCount: result.replacementCount
  };
}

function normalizeBookPath(assetPath) {
  return CONFIG_PATH_MAP.get(String(assetPath || '')) || String(assetPath || '');
}

function verifyNoLegacyBookPaths(parsedJson, displayLabel) {
  const legacyPathList = collectLegacyConfigPaths(parsedJson, (pathValue) => {
    return LEGACY_CONFIG_PATH_PATTERN.test(pathValue);
  });

  if (legacyPathList.length > 0) {
    throw new Error(
      '[uiBundle语义化] 配置中仍残留书册旧路径：' +
      displayLabel +
      ' -> ' +
      legacyPathList.slice(0, 5).join(', ')
    );
  }
}

function updateImportNames(filePath, displayLabel, nameMap) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  let nextContent = originalContent;
  let replacementCount = 0;

  for (const [legacyName, semanticName] of Object.entries(nameMap)) {
    const pattern = new RegExp('"name":"' + escapeRegExp(legacyName) + '"', 'g');
    nextContent = nextContent.replace(pattern, function replaceMatch() {
      replacementCount += 1;
      return '"name":"' + semanticName + '"';
    });
  }

  verifyNoLegacyImportNames(nextContent, displayLabel, Object.keys(nameMap));

  if (nextContent !== originalContent) {
    fs.writeFileSync(filePath, nextContent);
  }

  return {
    label: displayLabel,
    replacementCount: replacementCount
  };
}

function verifyNoLegacyImportNames(fileContent, displayLabel, legacyNames) {
  const remainingNames = legacyNames.filter((legacyName) => {
    const pattern = new RegExp('"name":"' + escapeRegExp(legacyName) + '"');
    return pattern.test(fileContent);
  });

  if (remainingNames.length > 0) {
    throw new Error(
      '[uiBundle语义化] import 元数据仍残留旧名称：' +
      displayLabel +
      ' -> ' +
      remainingNames.join(', ')
    );
  }
}

semanticizeUiBundleBookDisplayAssets();
