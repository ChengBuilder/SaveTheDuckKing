'use strict';

const fs = require('fs');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');
const {
  escapeRegExp
} = require('./semanticize-shared');

const IMPORT_FILE_MAPPINGS = [
  {
    relativePath: 'subpackages/main/import/_packs/pack/banner__pack_11.json',
    label: '主包书册展示横幅复用图集',
    nameMap: {
      p10: 'skinPage10',
      p9: 'skinPage9',
      '鸽鸽图鉴': 'titleBanner',
      p6: 'skinPage6',
      '视频2': 'videoBadge',
      '旋转光': 'rotatingGlow'
    }
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/callFriend__pack_18.json',
    label: '主包书册标题复用图集',
    nameMap: {
      '鸽鸽图鉴': 'titleBanner',
      '图鉴': 'collectionTitle'
    }
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/bottom__pack_15.json',
    label: '主包书册底部复用图集',
    nameMap: {
      p8: 'skinPage8',
      '底2': 'pillBase',
      '已领取按钮': 'claimedButton',
      '框': 'selectionHalo',
      '底': 'infoBarBase',
      '领取按钮': 'claimButton',
      p1: 'skinPage1'
    }
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/share__pack_11.json',
    label: '主包书册分享复用图集',
    nameMap: {
      p2: 'skinPage2',
      p4: 'skinPage4',
      p3: 'skinPage3',
      p5: 'skinPage5'
    }
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/bottom__pack_17.json',
    label: '主包书册结算复用图集',
    nameMap: {
      p7: 'skinPage7'
    }
  }
];

function semanticizeMainBookDisplayAssets() {
  const layout = resolveProjectLayout(__dirname);
  const results = IMPORT_FILE_MAPPINGS.map((target) => {
    const absolutePath = resolveProjectFilePath(layout, target.relativePath);
    return updateImportNames(absolutePath, target.label, target.nameMap);
  });

  console.log('[main语义化] 已完成主包复用书册展示图集命名收敛。');
  for (const result of results) {
    console.log(
      '[main语义化] 元数据更新:',
      result.label,
      '名称改写数:',
      result.replacementCount
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
      '[main语义化] import 元数据仍残留旧名称：' +
      displayLabel +
      ' -> ' +
      remainingNames.join(', ')
    );
  }
}

semanticizeMainBookDisplayAssets();
