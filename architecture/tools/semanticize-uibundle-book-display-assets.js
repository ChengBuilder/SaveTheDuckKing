'use strict';
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');
const {
  updateConfigPathEntries,
  collectLegacyConfigPaths,
  updateImportJsonNameMap
} = require('./semanticize-shared');

const CONFIG_TARGET = 'subpackages/uiBundle/config.ui-bundle.json';

const MYTHIC_FORMATION_NAME_MAP = {
  '百鸭朝鲲': 'hundredDucksToKun',
  '百鸭朝雀': 'hundredDucksToSparrow',
  '百鸭朝龙': 'hundredDucksToDragon',
  '百鸭朝鹏': 'hundredDucksToRoc',
  '百鸭朝鹅': 'hundredDucksToGoose',
  '百鹅朝凤': 'hundredGeeseToPhoenix',
  '百鹅朝鹏': 'hundredGeeseToRoc',
  '百鹅朝麟': 'hundredGeeseToQilin'
};

const MYTHIC_UNLOCK_NAME_MAP = {
  '只鸭解锁百鸭朝雀': 'unlockByDuckCount_hundredDucksToSparrow',
  '只鸭解锁百鸭朝鲲': 'unlockByDuckCount_hundredDucksToKun',
  '只鸭解锁百鸭朝龙': 'unlockByDuckCount_hundredDucksToDragon',
  '只鸭解锁百鸭朝鹅': 'unlockByDuckCount_hundredDucksToGoose',
  '只鹅解锁百鸭朝雀': 'unlockByGooseCount_hundredDucksToSparrow',
  '只鹅解锁百鹅朝凤': 'unlockByGooseCount_hundredGeeseToPhoenix',
  '只鹅解锁百鹅朝鹏': 'unlockByGooseCount_hundredGeeseToRoc',
  '只鹅解锁百鹅朝麟': 'unlockByGooseCount_hundredGeeseToQilin'
};

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
  ['tex/book/鸽鸽图鉴/底/spriteFrame', 'tex/book/ui/infoBarBase/spriteFrame'],
  ['tex/喊人页面/横幅/spriteFrame', 'tex/sharePage/banner/spriteFrame'],
  ['tex/喊人页面/旋转光/spriteFrame', 'tex/sharePage/rotatingGlow/spriteFrame'],
  ['tex/视频2', 'tex/sharePage/videoBadge'],
  ['tex/视频2/texture', 'tex/sharePage/videoBadge/texture'],
  ['tex/视频2/spriteFrame', 'tex/sharePage/videoBadge/spriteFrame'],
  ['tex/视频', 'tex/sharePage/videoIcon'],
  ['tex/视频/texture', 'tex/sharePage/videoIcon/texture'],
  ['tex/视频/spriteFrame', 'tex/sharePage/videoIcon/spriteFrame'],
  ['tex/视频(分享)/spriteFrame', 'tex/sharePage/videoShareBadge/spriteFrame'],
  ['tex/喊人页面/邀请好友/spriteFrame', 'tex/sharePage/inviteFriendsButton/spriteFrame'],
  ['tex/喊人页面/进度条2/spriteFrame', 'tex/sharePage/progressBarBackground/spriteFrame'],
  ['tex/喊人页面/进度条/spriteFrame', 'tex/sharePage/progressBarForeground/spriteFrame'],
  ['tex/投诉页面/提交/spriteFrame', 'tex/reportDialog/submitButton/spriteFrame'],
  ['tex/投诉页面/已提交/spriteFrame', 'tex/reportDialog/submittedBanner/spriteFrame'],
  ['tex/投诉页面/×/spriteFrame', 'tex/reportDialog/close/spriteFrame'],
  ['tex/投诉页面/底2/spriteFrame', 'tex/reportDialog/panelBackground/spriteFrame'],
  ['tex/投诉页面/圆2/spriteFrame', 'tex/reportDialog/highlightHalo/spriteFrame'],
  ['tex/投诉页面/底/spriteFrame', 'tex/reportDialog/pillBase/spriteFrame'],
  ['tex/投诉页面/圆1/spriteFrame', 'tex/reportDialog/progressDot/spriteFrame'],
  ['tex/投诉页面/线/spriteFrame', 'tex/reportDialog/dividerLine/spriteFrame'],
  ['tex/底/spriteFrame', 'tex/powerPanel/baseBackground/spriteFrame'],
  ['tex/过关页面/成功进度/光圈', 'tex/levelCompletePage/successProgress/selectionHalo'],
  ['tex/过关页面/成功进度/光圈/texture', 'tex/levelCompletePage/successProgress/selectionHalo/texture'],
  ['tex/过关页面/成功进度/光圈/spriteFrame', 'tex/levelCompletePage/successProgress/selectionHalo/spriteFrame'],
  ['tex/过关页面/成功进度/条2/spriteFrame', 'tex/levelCompletePage/successProgress/progressBarFill/spriteFrame'],
  ['tex/过关页面/成功进度/条1/spriteFrame', 'tex/levelCompletePage/successProgress/progressBarTrack/spriteFrame'],
  ['tex/过关页面/成功进度/剪影/spriteFrame', 'tex/levelCompletePage/successProgress/silhouette/spriteFrame'],
  ['tex/过关页面/成功进度/再救/spriteFrame', 'tex/levelCompletePage/successProgress/reviveAgainLabel/spriteFrame'],
  ['tex/book/specialCollection/百鸭朝鲲/spriteFrame', 'tex/book/specialCollection/hundredDucksToKun/spriteFrame'],
  ['tex/book/specialCollection/百鸭朝雀/spriteFrame', 'tex/book/specialCollection/hundredDucksToSparrow/spriteFrame'],
  ['tex/book/specialCollection/百鸭朝龙/spriteFrame', 'tex/book/specialCollection/hundredDucksToDragon/spriteFrame'],
  ['tex/book/specialCollection/百鹅朝凤/spriteFrame', 'tex/book/specialCollection/hundredGeeseToPhoenix/spriteFrame'],
  ['tex/book/specialCollection/百鹅朝鹏/spriteFrame', 'tex/book/specialCollection/hundredGeeseToRoc/spriteFrame'],
  ['tex/book/specialCollection/百鹅朝麟/spriteFrame', 'tex/book/specialCollection/hundredGeeseToQilin/spriteFrame'],
  ['tex/过关页面/成功进度/百鸭朝雀/spriteFrame', 'tex/levelCompletePage/successProgress/hundredDucksToSparrow/spriteFrame'],
  ['tex/过关页面/成功进度/百鸭朝鲲/spriteFrame', 'tex/levelCompletePage/successProgress/hundredDucksToKun/spriteFrame'],
  ['tex/过关页面/成功进度/百鸭朝龙/spriteFrame', 'tex/levelCompletePage/successProgress/hundredDucksToDragon/spriteFrame'],
  ['tex/过关页面/成功进度/百鸭朝鹏/spriteFrame', 'tex/levelCompletePage/successProgress/hundredDucksToRoc/spriteFrame'],
  ['tex/过关页面/成功进度/百鹅朝凤/spriteFrame', 'tex/levelCompletePage/successProgress/hundredGeeseToPhoenix/spriteFrame'],
  ['tex/过关页面/成功进度/百鹅朝麟/spriteFrame', 'tex/levelCompletePage/successProgress/hundredGeeseToQilin/spriteFrame'],
  ['tex/过关页面/成功进度/只鸭解锁百鸭朝雀/spriteFrame', 'tex/levelCompletePage/successProgress/unlockByDuckCount_hundredDucksToSparrow/spriteFrame'],
  ['tex/过关页面/成功进度/只鸭解锁百鸭朝鲲/spriteFrame', 'tex/levelCompletePage/successProgress/unlockByDuckCount_hundredDucksToKun/spriteFrame'],
  ['tex/过关页面/成功进度/只鸭解锁百鸭朝龙/spriteFrame', 'tex/levelCompletePage/successProgress/unlockByDuckCount_hundredDucksToDragon/spriteFrame'],
  ['tex/过关页面/成功进度/只鸭解锁百鸭朝鹅/spriteFrame', 'tex/levelCompletePage/successProgress/unlockByDuckCount_hundredDucksToGoose/spriteFrame'],
  ['tex/过关页面/成功进度/只鹅解锁百鸭朝雀/spriteFrame', 'tex/levelCompletePage/successProgress/unlockByGooseCount_hundredDucksToSparrow/spriteFrame'],
  ['tex/过关页面/成功进度/只鹅解锁百鹅朝凤/spriteFrame', 'tex/levelCompletePage/successProgress/unlockByGooseCount_hundredGeeseToPhoenix/spriteFrame'],
  ['tex/过关页面/成功进度/只鹅解锁百鹅朝鹏/spriteFrame', 'tex/levelCompletePage/successProgress/unlockByGooseCount_hundredGeeseToRoc/spriteFrame'],
  ['tex/过关页面/成功进度/只鹅解锁百鹅朝麟/spriteFrame', 'tex/levelCompletePage/successProgress/unlockByGooseCount_hundredGeeseToQilin/spriteFrame'],
  ['tex/自动ui/框/spriteFrame', 'tex/autoUi/frame/spriteFrame']
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
      '道具': 'propIllustration',
      '使用按钮': 'useButton',
      '按键底': 'buttonBackground',
      '框': 'selectionHalo',
      '转发使用按钮': 'shareUseButton',
      '底': 'infoBarBase',
      '邀请好友': 'inviteFriendsButton',
      '体力框': 'energyFrame'
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/banner__pack_20.json',
    label: 'uiBundle 鸽子图鉴标题图集',
    nameMap: {
      '鸽鸽图鉴': 'titleBanner',
      '横幅': 'banner',
      '求助': 'helpLabel',
      '更多玩法': 'moreGamesLabel',
      '旋转光': 'rotatingGlow',
      ...MYTHIC_FORMATION_NAME_MAP
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/pack/callFriend__pack_15.json',
    label: 'uiBundle 复用标题图集',
    nameMap: {
      '鸽鸽图鉴': 'titleBanner',
      '入口有奖': 'entryRewardLabel',
      '加入鸭群': 'joinDuckGroupLabel',
      '喊人': 'inviteFriendsLabel',
      '投诉': 'reportLabel',
      '排行榜': 'leaderboardLabel',
      '更多玩法': 'moreGamesLabel',
      '添加桌面': 'addToDesktopLabel',
      ...MYTHIC_FORMATION_NAME_MAP
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/share__pack_22.json',
    label: 'uiBundle 复用分享图集',
    nameMap: {
      '分享': 'shareLabel',
      '转发录屏': 'shareReplayButton',
      ...MYTHIC_FORMATION_NAME_MAP
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/close__pack_28.json',
    label: 'uiBundle 分享页与投诉弹窗复用图集',
    nameMap: {
      '视频(分享)': 'videoShareBadge',
      '体力回复': 'energyRecoveryTitle',
      '视频': 'videoIcon',
      '体力': 'energyIllustration',
      '已提交': 'submittedBanner',
      '×': 'close',
      '叹号': 'exclamationMark',
      '底2': 'panelBackground',
      '锁': 'lockIcon',
      new: 'newBadge',
      '圆2': 'highlightHalo',
      '按钮': 'buttonBackground',
      '加体力': 'addEnergyIcon',
      '标题底': 'titleBackground',
      '底': 'pillBase',
      ...MYTHIC_FORMATION_NAME_MAP
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/bottom__pack_32.json',
    label: 'uiBundle 分享页与投诉弹窗底部图集',
    nameMap: {
      '已领取': 'claimedButton',
      '领取': 'claimButton',
      '进度条2': 'progressBarBackground',
      '提交': 'submitButton',
      '按键底灰': 'disabledButtonBackground',
      '底': 'baseBackground',
      '免费获得体力': 'freeEnergyTitle',
      '体力图标': 'energyIcon',
      '圆1': 'progressDot',
      '进度条': 'progressBarForeground',
      '获得': 'rewardLabel',
      '按键底绿': 'primaryButtonBackground',
      '线': 'dividerLine',
      ...MYTHIC_FORMATION_NAME_MAP
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/levelCompletePage/halo__pack_12.json',
    label: 'uiBundle 过关页光环图集',
    nameMap: {
      '光圈': 'selectionHalo'
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/levelCompletePage/successProgress/silhouette__pack_34.json',
    label: 'uiBundle 过关页成功进度图集',
    nameMap: {
      '剪影': 'silhouette',
      '条2': 'progressBarFill',
      '条1': 'progressBarTrack',
      '再救': 'reviveAgainLabel',
      ...MYTHIC_FORMATION_NAME_MAP,
      ...MYTHIC_UNLOCK_NAME_MAP
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/props__pack_24.json',
    label: 'uiBundle 道具图集神兽命名',
    nameMap: {
      ...MYTHIC_FORMATION_NAME_MAP
    }
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/autoUi/frame__pack_12.json',
    label: 'uiBundle 自动 UI 提示图集',
    nameMap: {
      '框': 'frame'
    }
  }
];

const LEGACY_CONFIG_PATH_PATTERNS = [
  /^tex\/book\/(?:tex|鸽鸽图鉴)\//,
  /^tex\/喊人页面\/(?:横幅|旋转光|邀请好友|进度条2?|进度条)\/spriteFrame$/,
  /^tex\/投诉页面\/(?:提交|已提交|×|底2?|圆[12]|线)\/spriteFrame$/,
  /^tex\/自动ui\/框\/spriteFrame$/,
  /^tex\/视频2(?:\/(?:texture|spriteFrame))?$/,
  /^tex\/视频(?:\/(?:texture|spriteFrame))?$/,
  /^tex\/视频\(分享\)\/spriteFrame$/,
  /^tex\/底\/spriteFrame$/,
  /^tex\/过关页面\/成功进度\/(?:光圈(?:\/(?:texture|spriteFrame))?|条[12]\/spriteFrame|剪影\/spriteFrame|再救\/spriteFrame|百鸭朝(?:雀|鲲|龙|鹏)|百鹅朝(?:凤|麟)|只鸭解锁百鸭朝(?:雀|鲲|龙|鹅)|只鹅解锁(?:百鸭朝雀|百鹅朝(?:凤|鹏|麟)))\/spriteFrame$/,
  /^tex\/book\/specialCollection\/(?:百鸭朝(?:雀|鲲|龙)|百鹅朝(?:凤|鹏|麟))\/spriteFrame$/
];

function semanticizeUiBundleBookDisplayAssets() {
  const layout = resolveProjectLayout(__dirname);
  const configAbsolutePath = resolveProjectFilePath(layout, CONFIG_TARGET);
  const configLabel = formatProjectPathFromWorkspace(layout, CONFIG_TARGET);
  const configResult = updateDisplayConfig(configAbsolutePath, configLabel);
  const importResults = IMPORT_FILE_MAPPINGS.map((target) => {
    const absolutePath = resolveProjectFilePath(layout, target.relativePath);
    return updateImportJsonNameMap(absolutePath, target.label, target.nameMap, 'uiBundle语义化');
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

function updateDisplayConfig(filePath, displayLabel) {
  const result = updateConfigPathEntries(filePath, normalizeDisplayPath, (parsedJson) => {
    verifyNoLegacyDisplayPaths(parsedJson, displayLabel);
  });

  return {
    label: displayLabel,
    replacementCount: result.replacementCount
  };
}

function normalizeDisplayPath(assetPath) {
  return CONFIG_PATH_MAP.get(String(assetPath || '')) || String(assetPath || '');
}

function verifyNoLegacyDisplayPaths(parsedJson, displayLabel) {
  const legacyPathList = collectLegacyConfigPaths(parsedJson, function collectLegacyDisplayPaths(pathValue) {
    return LEGACY_CONFIG_PATH_PATTERNS.some(function matchPattern(pattern) {
      return pattern.test(pathValue);
    });
  });

  if (legacyPathList.length > 0) {
    throw new Error(
      '[uiBundle语义化] 配置中仍残留展示模块旧路径：' +
      displayLabel +
      ' -> ' +
      legacyPathList.slice(0, 5).join(', ')
    );
  }
}

semanticizeUiBundleBookDisplayAssets();
