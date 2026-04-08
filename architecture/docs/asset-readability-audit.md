# 素材可读性审计（自动生成）

> 本文件由 `architecture/tools/generate-asset-readability-audit.js` 生成。

## 总览
- 生成时间：2026-04-08T10:17:02.331Z
- Bundle 数：10
- 扫描 canonical 路径数：2293
- 命中候选数：739
- 高优先级候选数：97
- 中优先级候选数：420
- 低优先级候选数：222

## 全局高优先级候选
- `[audioBundle] gz`：gz (short-opaque-token)
- `[audioBundle] ls`：ls (short-opaque-token)
- `[audioBundle] lz`：lz (short-opaque-token)
- `[DuckBundle] tex/%2`：%2 (encoded-symbol)
- `[DuckBundle] tex/%2/spriteFrame`：%2 (encoded-symbol)
- `[DuckBundle] tex/%2/texture`：%2 (encoded-symbol)
- `[DuckBundle] tex/fragment/a/1`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/1/spriteFrame`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/1/texture`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/2`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/2/spriteFrame`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/2/texture`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/3`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/3/spriteFrame`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/3/texture`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/4`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/4/spriteFrame`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/4/texture`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/5`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/5/spriteFrame`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/5/texture`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/6`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/6/spriteFrame`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/a/6/texture`：a (short-opaque-token)
- `[DuckBundle] tex/fragment/b/1`：b (short-opaque-token)
- `[DuckBundle] tex/fragment/b/1/spriteFrame`：b (short-opaque-token)
- `[DuckBundle] tex/fragment/b/1/texture`：b (short-opaque-token)
- `[DuckBundle] tex/fragment/b/2`：b (short-opaque-token)
- `[DuckBundle] tex/fragment/b/2/spriteFrame`：b (short-opaque-token)
- `[DuckBundle] tex/fragment/b/2/texture`：b (short-opaque-token)

## 分 Bundle 摘要
| Bundle | 资产数 | 命中数 | 高优先级 | 高频问题片段 |
| --- | ---: | ---: | ---: | --- |
| `uiBundle` | 400 | 332 | 1 | `主页素材` x 48，`过关页面` x 27，`道具` x 22，`成功进度` x 21，`复活` x 15，`失败页面` x 15，`订阅` x 13，`分享有奖` x 12，`排行榜` x 12，`更多玩法` x 10 |
| `DuckBundle` | 1227 | 192 | 93 | `难度飙升` x 18，`a` x 18，`b` x 18，`c` x 18，`d` x 18，`e` x 18，`%2` x 3，`背景` x 3，`飙升` x 3，`飙升2` x 3 |
| `aniBundle` | 156 | 155 | 0 | `神兽动画合集` x 30，`骨骼动画` x 25，`鸭子动画` x 20，`小三视频` x 17，`破门动画` x 8，`百鹅朝凤` x 6，`百鹅朝麟` x 6，`百鹅朝鹏` x 6，`百鸭朝鲲` x 6，`百鸭朝龙` x 6 |
| `Game2Bundle` | 161 | 48 | 0 | `背景` x 15，`道具` x 12，`解锁进度` x 7，`解锁进度2` x 6，`打乱水果位置` x 3，`洞` x 3，`剩余` x 3，`消除2组水果` x 3，`移除槽位中的水果` x 3，`遮罩` x 3 |
| `HomeBundle` | 231 | 9 | 0 | `光` x 3，`获得100只鹅解锁` x 3，`获得100只鸭子解锁` x 3 |
| `audioBundle` | 65 | 3 | 3 | `gz` x 1，`ls` x 1，`lz` x 1 |
| `internal` | 18 | 0 | 0 | 无 |
| `main` | 5 | 0 | 0 | 无 |
| `resources` | 27 | 0 | 0 | 无 |
| `start-scene` | 3 | 0 | 0 | 无 |

## 分 Bundle 详情

### uiBundle
- 配置：`subpackages/uiBundle/config.ui-bundle.json`
- 资产路径数：400
- 命中候选：332
- 高/中/低优先级：1 / 285 / 46
- 高频问题片段：`主页素材` x 48，`过关页面` x 27，`道具` x 22，`成功进度` x 21，`复活` x 15，`失败页面` x 15，`订阅` x 13，`分享有奖` x 12，`排行榜` x 12，`更多玩法` x 10
- 样例候选：
  - `tex/book/tex/NO/spriteFrame`：NO (short-opaque-token)
  - `tex/过关页面/成功进度/百鹅朝凤/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、百鹅朝凤 (non-ascii)
  - `tex/过关页面/成功进度/百鹅朝麟/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、百鹅朝麟 (non-ascii)
  - `tex/过关页面/成功进度/百鸭朝鲲/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、百鸭朝鲲 (non-ascii)
  - `tex/过关页面/成功进度/百鸭朝龙/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、百鸭朝龙 (non-ascii)
  - `tex/过关页面/成功进度/百鸭朝鹏/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、百鸭朝鹏 (non-ascii)
  - `tex/过关页面/成功进度/百鸭朝雀/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、百鸭朝雀 (non-ascii)
  - `tex/过关页面/成功进度/光圈`：过关页面 (non-ascii)、成功进度 (non-ascii)、光圈 (non-ascii)
  - `tex/过关页面/成功进度/光圈/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、光圈 (non-ascii)
  - `tex/过关页面/成功进度/光圈/texture`：过关页面 (non-ascii)、成功进度 (non-ascii)、光圈 (non-ascii)
  - `tex/过关页面/成功进度/剪影/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、剪影 (non-ascii)
  - `tex/过关页面/成功进度/条1/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、条1 (non-ascii)

### DuckBundle
- 配置：`subpackages/DuckBundle/config.duck-bundle.json`
- 资产路径数：1227
- 命中候选：192
- 高/中/低优先级：93 / 63 / 36
- 高频问题片段：`难度飙升` x 18，`a` x 18，`b` x 18，`c` x 18，`d` x 18，`e` x 18，`%2` x 3，`背景` x 3，`飙升` x 3，`飙升2` x 3
- 样例候选：
  - `tex/%2`：%2 (encoded-symbol)
  - `tex/%2/spriteFrame`：%2 (encoded-symbol)
  - `tex/%2/texture`：%2 (encoded-symbol)
  - `tex/fragment/a/1`：a (short-opaque-token)
  - `tex/fragment/a/1/spriteFrame`：a (short-opaque-token)
  - `tex/fragment/a/1/texture`：a (short-opaque-token)
  - `tex/fragment/a/2`：a (short-opaque-token)
  - `tex/fragment/a/2/spriteFrame`：a (short-opaque-token)
  - `tex/fragment/a/2/texture`：a (short-opaque-token)
  - `tex/fragment/a/3`：a (short-opaque-token)
  - `tex/fragment/a/3/spriteFrame`：a (short-opaque-token)
  - `tex/fragment/a/3/texture`：a (short-opaque-token)

### aniBundle
- 配置：`subpackages/aniBundle/config.animation-bundle.json`
- 资产路径数：156
- 命中候选：155
- 高/中/低优先级：0 / 60 / 95
- 高频问题片段：`神兽动画合集` x 30，`骨骼动画` x 25，`鸭子动画` x 20，`小三视频` x 17，`破门动画` x 8，`百鹅朝凤` x 6，`百鹅朝麟` x 6，`百鹅朝鹏` x 6，`百鸭朝鲲` x 6，`百鸭朝龙` x 6
- 样例候选：
  - `神兽动画合集/百鹅朝凤/百鹅朝凤`：神兽动画合集 (non-ascii)、百鹅朝凤 (non-ascii)、百鹅朝凤 (non-ascii)
  - `神兽动画合集/百鹅朝麟/百鹅朝麟`：神兽动画合集 (non-ascii)、百鹅朝麟 (non-ascii)、百鹅朝麟 (non-ascii)
  - `神兽动画合集/百鹅朝鹏/百鹅朝鹏`：神兽动画合集 (non-ascii)、百鹅朝鹏 (non-ascii)、百鹅朝鹏 (non-ascii)
  - `神兽动画合集/百鸭朝鲲/百鸭朝鲲`：神兽动画合集 (non-ascii)、百鸭朝鲲 (non-ascii)、百鸭朝鲲 (non-ascii)
  - `神兽动画合集/百鸭朝龙/百鸭朝龙`：神兽动画合集 (non-ascii)、百鸭朝龙 (non-ascii)、百鸭朝龙 (non-ascii)
  - `神兽动画合集/百鸭朝雀/百鸭朝雀`：神兽动画合集 (non-ascii)、百鸭朝雀 (non-ascii)、百鸭朝雀 (non-ascii)
  - `鸽子动画/new_dove`：鸽子动画 (non-ascii)、new_dove (compact-underscored-token)
  - `鸽子动画/new_dove`：鸽子动画 (non-ascii)、new_dove (compact-underscored-token)
  - `鸽子动画/new_dove`：鸽子动画 (non-ascii)、new_dove (compact-underscored-token)
  - `鸽子动画/new_dove/spriteFrame`：鸽子动画 (non-ascii)、new_dove (compact-underscored-token)
  - `鸽子动画/new_dove/texture`：鸽子动画 (non-ascii)、new_dove (compact-underscored-token)
  - `骨骼动画/门动画/skeleton`：骨骼动画 (non-ascii)、门动画 (non-ascii)

### Game2Bundle
- 配置：`subpackages/Game2Bundle/config.game2-bundle.json`
- 资产路径数：161
- 命中候选：48
- 高/中/低优先级：0 / 12 / 36
- 高频问题片段：`背景` x 15，`道具` x 12，`解锁进度` x 7，`解锁进度2` x 6，`打乱水果位置` x 3，`洞` x 3，`剩余` x 3，`消除2组水果` x 3，`移除槽位中的水果` x 3，`遮罩` x 3
- 样例候选：
  - `tex/道具/打乱水果位置`：道具 (non-ascii)、打乱水果位置 (non-ascii)
  - `tex/道具/打乱水果位置/spriteFrame`：道具 (non-ascii)、打乱水果位置 (non-ascii)
  - `tex/道具/打乱水果位置/texture`：道具 (non-ascii)、打乱水果位置 (non-ascii)
  - `tex/道具/剩余`：道具 (non-ascii)、剩余 (non-ascii)
  - `tex/道具/剩余/spriteFrame`：道具 (non-ascii)、剩余 (non-ascii)
  - `tex/道具/剩余/texture`：道具 (non-ascii)、剩余 (non-ascii)
  - `tex/道具/消除2组水果`：道具 (non-ascii)、消除2组水果 (non-ascii)
  - `tex/道具/消除2组水果/spriteFrame`：道具 (non-ascii)、消除2组水果 (non-ascii)
  - `tex/道具/消除2组水果/texture`：道具 (non-ascii)、消除2组水果 (non-ascii)
  - `tex/道具/移除槽位中的水果`：道具 (non-ascii)、移除槽位中的水果 (non-ascii)
  - `tex/道具/移除槽位中的水果/spriteFrame`：道具 (non-ascii)、移除槽位中的水果 (non-ascii)
  - `tex/道具/移除槽位中的水果/texture`：道具 (non-ascii)、移除槽位中的水果 (non-ascii)

### HomeBundle
- 配置：`subpackages/HomeBundle/config.home-bundle.json`
- 资产路径数：231
- 命中候选：9
- 高/中/低优先级：0 / 0 / 9
- 高频问题片段：`光` x 3，`获得100只鹅解锁` x 3，`获得100只鸭子解锁` x 3
- 样例候选：
  - `tex/光`：光 (non-ascii)
  - `tex/光/spriteFrame`：光 (non-ascii)
  - `tex/光/texture`：光 (non-ascii)
  - `tex/获得100只鹅解锁`：获得100只鹅解锁 (non-ascii)
  - `tex/获得100只鹅解锁/spriteFrame`：获得100只鹅解锁 (non-ascii)
  - `tex/获得100只鹅解锁/texture`：获得100只鹅解锁 (non-ascii)
  - `tex/获得100只鸭子解锁`：获得100只鸭子解锁 (non-ascii)
  - `tex/获得100只鸭子解锁/spriteFrame`：获得100只鸭子解锁 (non-ascii)
  - `tex/获得100只鸭子解锁/texture`：获得100只鸭子解锁 (non-ascii)

### audioBundle
- 配置：`subpackages/audioBundle/config.audio-bundle.json`
- 资产路径数：65
- 命中候选：3
- 高/中/低优先级：3 / 0 / 0
- 高频问题片段：`gz` x 1，`ls` x 1，`lz` x 1
- 样例候选：
  - `gz`：gz (short-opaque-token)
  - `ls`：ls (short-opaque-token)
  - `lz`：lz (short-opaque-token)

### internal
- 配置：`assets/internal/config.internal.json`
- 资产路径数：18
- 命中候选：0
- 高/中/低优先级：0 / 0 / 0
- 高频问题片段：无
- 样例候选：
  - 无

### main
- 配置：`subpackages/main/config.main.json`
- 资产路径数：5
- 命中候选：0
- 高/中/低优先级：0 / 0 / 0
- 高频问题片段：无
- 样例候选：
  - 无

### resources
- 配置：`subpackages/resources/config.resources.json`
- 资产路径数：27
- 命中候选：0
- 高/中/低优先级：0 / 0 / 0
- 高频问题片段：无
- 样例候选：
  - 无

### start-scene
- 配置：`assets/start-scene/config.start-scene.json`
- 资产路径数：3
- 命中候选：0
- 高/中/低优先级：0 / 0 / 0
- 高频问题片段：无
- 样例候选：
  - 无

## 结果文件
- Markdown：`architecture/docs/asset-readability-audit.md`
- JSON：`architecture/docs/asset-readability-audit.json`

