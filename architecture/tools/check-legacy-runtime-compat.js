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
        label: 'uiBundle 鸽子图鉴标题旧名称',
        pattern: /"name":"鸽鸽图鉴"/g
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
        pattern: /"name":"(?:p10|p9|鸽鸽图鉴|p6|视频2|旋转光)"/g
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
        pattern: /"name":"p7"/g
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
