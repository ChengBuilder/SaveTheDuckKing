'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const FRAGMENT_VARIANT_FAMILY_CODES = ['a', 'b', 'c', 'd', 'e'];
const FRAGMENT_VARIANT_SHAPE_SLOTS = [1, 2, 3, 4, 5, 6];

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
      },
      {
        label: 'DuckBundle fragment 死 helper 残留',
        pattern: /fragmentEffect=function/g
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
        pattern: createImportJsonNamePattern('(?:全部|100|标签|底|框2|特殊|图鉴|框1|使用中|旋转光|NO|稀有|已收集|条2|条1)')
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/bottom__pack_30.json',
    checks: [
      {
        label: 'uiBundle 图鉴条目图集旧名称',
        pattern: createImportJsonNamePattern('(?:底2|道具|使用按钮|按键底|框|转发使用按钮|底|邀请好友|体力框)')
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/banner__pack_20.json',
    checks: [
      {
        label: 'uiBundle 鸽子图鉴与分享页横幅旧名称',
        pattern: createImportJsonNamePattern('(?:鸽鸽图鉴|横幅|求助|更多玩法|旋转光)')
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/bottom__pack_32.json',
    checks: [
      {
        label: 'uiBundle 分享页与投诉弹窗底部旧名称',
        pattern: createImportJsonNamePattern('(?:已领取|领取|进度条2|提交|按键底灰|底|免费获得体力|体力图标|圆1|进度条|获得|按键底绿|线)')
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/close__pack_28.json',
    checks: [
      {
        label: 'uiBundle 分享页与投诉弹窗复用图集旧名称',
        pattern: createImportJsonNamePattern('(?:视频\\(分享\\)|体力回复|视频|体力|已提交|×|叹号|底2|锁|new|圆2|按钮|加体力|标题底|底)')
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/levelCompletePage/halo__pack_12.json',
    checks: [
      {
        label: 'uiBundle 过关页光环图集旧名称',
        pattern: createImportJsonNamePattern('光圈')
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/levelCompletePage/successProgress/silhouette__pack_34.json',
    checks: [
      {
        label: 'uiBundle 过关页成功进度图集旧名称',
        pattern: createImportJsonNamePattern('(?:剪影|条2|条1|再救)')
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/autoUi/frame__pack_12.json',
    checks: [
      {
        label: 'uiBundle 自动 UI 旧框资源名称',
        pattern: createImportJsonNamePattern('框')
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/pack/callFriend__pack_15.json',
    checks: [
      {
        label: 'uiBundle 复用标题图集旧名称',
        pattern: createImportJsonNamePattern('(?:鸽鸽图鉴|入口有奖|加入鸭群|喊人|投诉|排行榜|更多玩法|添加桌面)')
      }
    ]
  },
  {
    relativePath: 'subpackages/uiBundle/import/_packs/tex/share__pack_22.json',
    checks: [
      {
        label: 'uiBundle 复用分享图集旧名称',
        pattern: createImportJsonNamePattern('(?:分享|转发录屏)')
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/banner__pack_11.json',
    checks: [
      {
        label: '主包书册展示横幅复用图集旧名称',
        pattern: createImportJsonNamePattern('(?:p10|p9|鸽鸽图鉴|p6|横幅|求助|更多玩法|视频2|旋转光)')
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/callFriend__pack_18.json',
    checks: [
      {
        label: '主包书册标题复用图集旧名称',
        pattern: createImportJsonNamePattern('(?:鸽鸽图鉴|图鉴|入口有奖|加入鸭群|喊人|投诉|排行榜|更多玩法|添加桌面|猜图开始游戏按钮心|猜图开始游戏按钮气泡)')
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/bottom__pack_15.json',
    checks: [
      {
        label: '主包书册底部复用图集旧名称',
        pattern: createImportJsonNamePattern('(?:p8|底2|道具|已领取按钮|使用按钮|按键底|框|邀请好友|底|体力框|领取按钮|转发使用按钮|p1)')
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/share__pack_11.json',
    checks: [
      {
        label: '主包书册分享复用图集旧名称',
        pattern: createImportJsonNamePattern('(?:p2|p4|p3|p5|分享|转发录屏)')
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/bottom__pack_17.json',
    checks: [
      {
        label: '主包书册结算复用图集旧名称',
        pattern: createImportJsonNamePattern('(?:p7|已领取|领取|进度条2|提交|redSpr|按键底灰|底|免费获得体力|体力图标|圆1|进度条|获得|按键底绿|线)')
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/close__pack_18.json',
    checks: [
      {
        label: '主包书册分享弹窗复用图集旧名称',
        pattern: createImportJsonNamePattern('(?:视频\\(分享\\)|体力回复|视频|体力|已提交|×|叹号|底2|锁|new|圆2|按钮|加体力|叹号更多玩法|标题底|底)')
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/halo__pack_18.json',
    checks: [
      {
        label: '主包书册成功进度复用图集旧名称',
        pattern: createImportJsonNamePattern('(?:光圈|剪影|条2|条1|再救)')
      }
    ]
  },
  {
    relativePath: 'subpackages/main/import/_packs/pack/percent__pack_10.json',
    checks: [
      {
        label: '主包书册复活进度复用图集旧名称',
        pattern: createImportJsonNamePattern('(?:底2|心1|关卡已完成|底1|移除槽位中的钉子|转发复活按钮|复活|图标|%|是否复活)')
      }
    ]
  },
  {
    relativePaths: buildDuckBundleFragmentSpriteFramePaths(),
    checks: [
      {
        label: 'DuckBundle fragment 元数据旧数字命名',
        pattern: createImportJsonNamePattern('[1-6]')
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
    const relativePaths = resolveTargetRelativePaths(target);

    for (const relativePath of relativePaths) {
      const absolutePath = path.join(PROJECT_ROOT, relativePath);
      const fileContent = fs.readFileSync(absolutePath, 'utf8');

      for (const check of target.checks) {
        const matchedValues = collectMatchedValues(fileContent, check.pattern);
        if (matchedValues.length === 0) {
          continue;
        }

        findings.push({
          file: relativePath,
          label: check.label,
          matches: matchedValues
        });
      }
    }
  }

  appendRuntimeRemapFindings(findings);

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

function appendRuntimeRemapFindings(findings) {
  const remapModule = require(path.join(PROJECT_ROOT, 'runtime/asset-file-remap.js'));
  const remapState = remapModule.buildRemapState(remapModule.loadGeneratedRemapManifest());
  const representativeRequests = [
    {
      requestPath: 'assets/internal/import/0c/0ca60d3e4.ea248.json',
      expectedPath: 'assets/internal/import/0ca60d3e4.ea248.json',
      label: 'internal 根包 import 分片路径'
    },
    {
      requestPath: 'subpackages/resources/import/03/03ccd410a.a3f7a.json',
      expectedPath: 'subpackages/resources/import/_packs/multiTexture/a_color__pack_59.json',
      label: 'resources 分包 import 分片路径'
    },
    {
      requestPath: 'subpackages/main/import/06/062b1717-90b0-4678-aec0-84cced2a3125.a2533.json',
      expectedPath: 'subpackages/main/import/tex/scene/hole.json',
      label: 'main 分包 import 分片路径'
    },
    {
      requestPath: 'subpackages/Game2Bundle/import/1c/1c169947-9a9e-480e-ae4a-140c6c43d8aa.a2533.json',
      expectedPath: 'subpackages/Game2Bundle/import/tex/props/removeFruitFromSlot/spriteFrame.json',
      label: 'Game2Bundle 分包 import 分片路径'
    },
    {
      requestPath: 'assets/game2bundle/import/1c/1c169947-9a9e-480e-ae4a-140c6c43d8aa.a2533.json',
      expectedPath: 'subpackages/Game2Bundle/import/tex/props/removeFruitFromSlot/spriteFrame.json',
      label: '旧 bundle 别名 import 分片路径'
    }
  ];

  for (const requestCase of representativeRequests) {
    const resolvedPath = remapModule.resolveRemappedAssetPath(requestCase.requestPath, remapState);
    const resolvedAbsolutePath = path.join(PROJECT_ROOT, resolvedPath);
    if (resolvedPath === requestCase.expectedPath && fs.existsSync(resolvedAbsolutePath)) {
      continue;
    }

    findings.push({
      file: 'runtime/asset-file-remap.js',
      label: requestCase.label,
      matches: [
        'request=' + requestCase.requestPath,
        'resolved=' + resolvedPath,
        'expected=' + requestCase.expectedPath,
        'exists=' + String(fs.existsSync(resolvedAbsolutePath))
      ]
    });
  }
}

function resolveTargetRelativePaths(target) {
  if (Array.isArray(target.relativePaths) && target.relativePaths.length > 0) {
    return target.relativePaths.slice();
  }

  return [target.relativePath];
}

function buildDuckBundleFragmentSpriteFramePaths() {
  const relativePaths = [];

  for (const familyCode of FRAGMENT_VARIANT_FAMILY_CODES) {
    for (const shapeSlot of FRAGMENT_VARIANT_SHAPE_SLOTS) {
      relativePaths.push(
        'subpackages/DuckBundle/import/tex/fragment/' +
          familyCode +
          '/' +
          String(shapeSlot) +
          '/spriteFrame__2.json'
      );
    }
  }

  return relativePaths;
}

function createImportJsonNamePattern(namePatternSource) {
  return new RegExp('"name"\\s*:\\s*"' + namePatternSource + '"', 'g');
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
