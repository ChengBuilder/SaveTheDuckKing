'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();

const CHECK_TARGETS = [
  {
    relativePath: 'game.js',
    checks: [
      {
        label: 'HomeBundle 旧背景动态路径',
        pattern: /tex\/BgThings(?:\d+|"\+this\.bgType(?:\.toString\(\))?)/g
      },
      {
        label: 'HomeBundle 旧粒子动态路径',
        pattern: /tex\/BgParticle\/p(?:[1-4]|"\+e\.bgType)/g
      },
      {
        label: 'uiBundle 旧图鉴皮肤路径',
        pattern: /tex\/book\/鸽鸽图鉴\/皮肤图鉴\/p(?:10|[1-9]|"\+this\.id\.toString\(\))/g
      },
      {
        label: 'uiBundle 旧设置路径',
        pattern: /tex\/设置(?:二级)?\//g
      },
      {
        label: 'uiBundle 旧图鉴分类路径',
        pattern: /tex\/book\/(?:分享鸭|大胃王鸭|水果鸭|特殊图鉴)\//g
      },
      {
        label: 'uiBundle 旧领取按钮路径',
        pattern: /tex\/(?:已)?领取按钮\/spriteFrame/g
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/config.ui-bundle.json',
    checks: [
      {
        label: 'uiBundle 配置旧图鉴分类路径',
        pattern: /tex\/book\/(?:分享鸭|大胃王鸭|水果鸭|特殊图鉴)\//g
      },
      {
        label: 'uiBundle 配置旧图鉴展示路径',
        pattern: /tex\/book\/(?:tex|鸽鸽图鉴)\//g
      },
      {
        label: 'uiBundle 配置旧领取按钮路径',
        pattern: /tex\/(?:已)?领取按钮\/spriteFrame/g
      },
      {
        label: 'uiBundle 配置旧分享页路径',
        pattern: /tex\/喊人页面\/(?:横幅|旋转光|邀请好友|进度条2?|进度条)\/spriteFrame|tex\/视频2(?:\/(?:texture|spriteFrame))?|tex\/视频(?:\/(?:texture|spriteFrame))?|tex\/视频\(分享\)\/spriteFrame|tex\/底\/spriteFrame/g
      },
      {
        label: 'uiBundle 配置旧投诉弹窗路径',
        pattern: /tex\/投诉页面\/(?:提交|已提交|×|底2?|圆[12]|线)\/spriteFrame/g
      },
      {
        label: 'uiBundle 配置旧过关页成功进度路径',
        pattern: /tex\/过关页面\/成功进度\/(?:光圈(?:\/(?:texture|spriteFrame))?|条[12]\/spriteFrame|剪影\/spriteFrame|再救\/spriteFrame)/g
      },
      {
        label: 'uiBundle 配置旧自动 UI 路径',
        pattern: /tex\/自动ui\/框\/spriteFrame/g
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/book/tex/bottom__pack_30.json',
    checks: [
      {
        label: 'uiBundle 书册通用图集旧名称',
        pattern: /"name":"(?:全部|100|标签|底|框2|特殊|图鉴|框1|使用中|旋转光|NO|稀有|已收集|条2|条1)"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/bottom__pack_30.json',
    checks: [
      {
        label: 'uiBundle 图鉴条目图集旧名称',
        pattern: /"name":"(?:底2|框|底)"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/banner__pack_20.json',
    checks: [
      {
        label: 'uiBundle 鸽子图鉴与分享页横幅旧名称',
        pattern: /"name":"(?:鸽鸽图鉴|横幅|旋转光)"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/bottom__pack_30.json',
    checks: [
      {
        label: 'uiBundle 分享页邀请按钮旧名称',
        pattern: /"name":"邀请好友"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/bottom__pack_32.json',
    checks: [
      {
        label: 'uiBundle 分享页与投诉弹窗底部旧名称',
        pattern: /"name":"(?:已领取|领取|进度条2|提交|按键底灰|底|免费获得体力|体力图标|圆1|进度条|获得|按键底绿|线)"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/close__pack_28.json',
    checks: [
      {
        label: 'uiBundle 分享页与投诉弹窗复用图集旧名称',
        pattern: /"name":"(?:视频\(分享\)|体力回复|视频|体力|已提交|×|叹号|底2|锁|new|圆2|按钮|加体力|标题底|底)"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/levelCompletePage/halo__pack_12.json',
    checks: [
      {
        label: 'uiBundle 过关页光环图集旧名称',
        pattern: /"name":"光圈"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/levelCompletePage/successProgress/silhouette__pack_34.json',
    checks: [
      {
        label: 'uiBundle 过关页成功进度图集旧名称',
        pattern: /"name":"(?:剪影|条2|条1|再救)"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/autoUi/frame__pack_12.json',
    checks: [
      {
        label: 'uiBundle 自动 UI 旧框资源名称',
        pattern: /"name":"框"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/pack/callFriend__pack_15.json',
    checks: [
      {
        label: 'uiBundle 复用标题图集旧名称',
        pattern: /"name":"鸽鸽图鉴"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/banner__pack_11.json',
    checks: [
      {
        label: '主包书册展示横幅复用图集旧名称',
        pattern: /"name":"(?:p10|p9|鸽鸽图鉴|p6|横幅|视频2|旋转光)"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/callFriend__pack_18.json',
    checks: [
      {
        label: '主包书册标题复用图集旧名称',
        pattern: /"name":"(?:鸽鸽图鉴|图鉴)"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/bottom__pack_15.json',
    checks: [
      {
        label: '主包书册底部复用图集旧名称',
        pattern: /"name":"(?:p8|底2|已领取按钮|框|底|领取按钮|p1)"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/share__pack_11.json',
    checks: [
      {
        label: '主包书册分享复用图集旧名称',
        pattern: /"name":"(?:p2|p4|p3|p5)"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/bottom__pack_17.json',
    checks: [
      {
        label: '主包书册结算复用图集旧名称',
        pattern: /"name":"(?:p7|已领取|领取|进度条2|提交|redSpr|按键底灰|底|免费获得体力|体力图标|圆1|进度条|获得|按键底绿|线)"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/close__pack_18.json',
    checks: [
      {
        label: '主包书册分享弹窗复用图集旧名称',
        pattern: /"name":"(?:视频\(分享\)|体力回复|视频|体力|已提交|×|叹号|底2|锁|new|圆2|按钮|加体力|叹号更多玩法|标题底|底)"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/halo__pack_18.json',
    checks: [
      {
        label: '主包书册成功进度复用图集旧名称',
        pattern: /"name":"(?:光圈|剪影|条2|条1|再救)"/g
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/percent__pack_10.json',
    checks: [
      {
        label: '主包书册复活进度复用图集旧名称',
        pattern: /"name":"(?:底2|心1|关卡已完成|底1|移除槽位中的钉子|转发复活按钮|复活|图标|%|是否复活)"/g
      }
    ]
  },
  {
    relativePath: 'architecture/boot/asset-path-normalizer.js',
    checks: [
      {
        label: '启动层旧路径兼容入口',
        pattern: /applyLegacyBundleRequestPatch|LEGACY_BUNDLE_REQUEST_PATCH_FLAG/g
      }
    ]
  },
  {
    relativePath: 'architecture/boot/app-lifecycle.js',
    checks: [
      {
        label: '启动链路旧路径兼容接入',
        pattern: /applyLegacyBundleRequestPatch/g
      }
    ]
  },
  {
    relativePath: 'architecture/memory/project-memory.md',
    checks: [
      {
        label: '项目记忆中的旧兼容策略',
        pattern: /兼容层最小化|保留必要补丁|Home\/ui 旧路径兼容|不深改 `game\.js`/g
      }
    ]
  },
  {
    relativePath: 'architecture/docs/project-structure.md',
    checks: [
      {
        label: '项目结构文档中的旧兼容策略',
        pattern: /兼容层最小化|所有兼容补丁必须|兼容薄壳层/g
      }
    ]
  },
  {
    relativePath: 'architecture/docs/wechat-official-project-guide.md',
    checks: [
      {
        label: '官方指南落地文档中的旧兼容策略',
        pattern: /兼容补丁层/g
      }
    ]
  }
];

function main() {
  const findings = [];

  for (const target of CHECK_TARGETS) {
    const absolutePath = path.join(PROJECT_ROOT, target.relativePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf8');

    for (const check of target.checks) {
      const matchedValues = collectMatchedValues(fileContent, check.pattern);
      if (matchedValues.length === 0) {
        continue;
      }

      findings.push({
        file: target.relativePath,
        label: check.label,
        matches: matchedValues
      });
    }
  }

  if (findings.length > 0) {
    console.error('[legacy-runtime-compat] 失败：检测到旧运行时路径或兼容层残留。');
    for (const finding of findings) {
      console.error('- 文件:', finding.file);
      console.error('  规则:', finding.label);
      console.error('  命中:', finding.matches.join(', '));
    }
    process.exitCode = 1;
    return;
  }

  console.log('[legacy-runtime-compat] 通过');
}

function collectMatchedValues(fileContent, pattern) {
  const matchedValues = new Set();
  const globalPattern = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
  let matchedItem = globalPattern.exec(fileContent);

  while (matchedItem) {
    matchedValues.add(matchedItem[0]);
    matchedItem = globalPattern.exec(fileContent);
  }

  return Array.from(matchedValues).sort();
}

main();
