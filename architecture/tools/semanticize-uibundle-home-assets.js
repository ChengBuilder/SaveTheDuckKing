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

const PATH_SEGMENT_MAP = Object.freeze({
  主页素材: 'homeUi',
  道具: 'props',
  失败页面: 'failPage',
  复活: 'revive',
  订阅: 'subscribe',
  排行榜: 'leaderboard',
  分享有奖: 'shareRewards',
  更多玩法: 'moreGames',
  体力获取: 'energyPanel',
  过关页面: 'levelCompletePage',
  领取奖励: 'claimRewards',
  开局解锁: 'startupUnlock',
  自动ui: 'autoUi',
  添加桌面: 'addToDesktop',
  分享: 'share',
  关注抖音: 'followDouyin',
  消除按钮: 'eliminateButton',
  点击摇摇: 'tapToShake',
  叹号: 'exclamationMark',
  体力box: 'energyBox',
  奖: 'rewardBadge',
  官方抖音: 'officialDouyin',
  摇摇道具: 'shakeProp',
  订阅btn: 'subscribeButton',
  叹号更多玩法: 'moreGamesExclamation',
  打乱按钮: 'shuffleButton',
  侧边栏: 'sideBar',
  还差: 'remainingNeeded',
  图标算数: 'iconMath',
  名次底2: 'rankIndexBase2',
  继续挑战: 'continueChallenge',
  消除说明: 'eliminateHint',
  图3: 'image3',
  侧边栏页面: 'sideBarPanel',
  入口奖励: 'entryReward',
  图1: 'image1',
  光: 'glow',
  前往订阅: 'goSubscribe',
  已领取: 'claimed',
  关_: 'levelLabelPrefix',
  体力回复: 'energyRecovery',
  解锁1说明: 'unlockHint1',
  关可晋升: 'levelCanPromote',
  名次底1: 'rankIndexBase1',
  领取: 'claim',
  进入: 'enter',
  排行底2: 'leaderboardRowBase2',
  分享标: 'shareBadge',
  体力: 'energy',
  喊人页面: 'sharePage',
  解锁1道具: 'unlockProp1',
  分享失败: 'shareFailed',
  挑战成功: 'challengeSuccess',
  求助: 'help',
  图标鸽: 'iconPigeon',
  排行底1: 'leaderboardRowBase1',
  失败: 'fail',
  使用按钮: 'useButton',
  图2: 'image2',
  心1: 'heart1',
  人头: 'avatar',
  分享好友: 'shareToFriend',
  第: 'rankPrefix',
  打乱说明: 'shuffleHint',
  关卡已完成: 'levelCompleted',
  转发录屏: 'shareReplay',
  图标牛: 'iconBull',
  打乱: 'shuffle',
  按键底: 'buttonBase',
  胜利: 'victory',
  挑战失败2: 'challengeFailed2',
  圆: 'circle',
  锁: 'lock',
  全自动: 'fullAuto',
  挑战成功2: 'challengeSuccess2',
  排序说明: 'sortHint',
  按键底灰: 'buttonBaseGray',
  移除槽位中的钉子: 'removeNailInSlot',
  进度底: 'progressBase',
  转发复活按钮: 'shareReviveButton',
  消除道具: 'eliminateProp',
  免费获得体力: 'freeEnergy',
  '今日剩余次数（1_1）': 'dailyRemainingCount_1_1',
  体力图标: 'energyIcon',
  添加桌面领取奖励: 'addToDesktopClaimReward',
  解锁说明: 'unlockHint',
  关注官方抖音获得奖励: 'followOfficialDouyinReward',
  光圈: 'halo',
  排序道具: 'sortProp',
  转发使用按钮: 'shareUseButton',
  入口有礼: 'entryGift',
  添加收藏奖励: 'addToFavoritesReward',
  图标: 'icon',
  未上榜: 'unranked',
  字: 'labelText',
  解锁道具: 'unlockProp',
  添加桌面奖励: 'addToDesktopReward',
  跳选关卡: 'jumpSelectLevel',
  关注: 'follow',
  返回主页: 'backHome',
  分享好友可获得奖励: 'shareToFriendReward',
  打乱道具: 'shuffleProp',
  体力框: 'energyFrame',
  获得: 'receive',
  挑战失败: 'challengeFailed',
  按键底绿: 'buttonBaseGreen',
  按键底红: 'buttonBaseRed',
  确定: 'confirm',
  按钮: 'button',
  加体力: 'addEnergy',
  解锁: 'unlock',
  '今日剩余次数（0_1）': 'dailyRemainingCount_0_1',
  标题底: 'titleBase',
  订阅抖音推荐即可获得奖励: 'subscribeDouyinReward',
  进度条: 'progressBar',
  是否复活: 'reviveQuestion',
  提示: 'hint',
  消除: 'eliminate',
  底1: 'base1',
  底2: 'base2',
  '%': 'percentSign'
});

const LEGACY_SEGMENT_SET = new Set(Object.keys(PATH_SEGMENT_MAP));

function semanticizeUiBundleHomeAssets() {
  const layout = resolveProjectLayout(__dirname);
  const configPath = resolveProjectFilePath(layout, UI_BUNDLE_CONFIG_RELATIVE_PATH);
  const configLabel = formatProjectPathFromWorkspace(layout, UI_BUNDLE_CONFIG_RELATIVE_PATH);

  const result = updateConfigPathEntries(
    configPath,
    rewritePathSegmentsToSemantic,
    verifyNoLegacySegments
  );

  console.log(
    '[uiBundle 路径语义化]',
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

function verifyNoLegacySegments(parsedJson) {
  const legacyPathList = collectLegacyConfigPaths(parsedJson, containsLegacySegment);
  if (legacyPathList.length === 0) {
    return;
  }

  throw new Error(
    '[uiBundle 路径语义化] config 仍残留 legacy 路径段：' +
      legacyPathList.slice(0, 10).join(', ')
  );
}

function containsLegacySegment(assetPath) {
  if (typeof assetPath !== 'string' || assetPath.length === 0) {
    return false;
  }

  const segments = assetPath.split('/');
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    if (LEGACY_SEGMENT_SET.has(segment) || /[^\x00-\x7F]/.test(segment)) {
      return true;
    }
  }

  return false;
}

semanticizeUiBundleHomeAssets();
