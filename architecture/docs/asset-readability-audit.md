# 素材可读性审计（自动生成）

> 本文件由 `architecture/tools/generate-asset-readability-audit.js` 生成。

## 总览
- Bundle 数：10
- 扫描 canonical 路径数：2293
- 命中候选数：534
- 高优先级候选数：0
- 中优先级候选数：361
- 低优先级候选数：173

## 全局高优先级候选
- 无

## 分 Bundle 摘要
| Bundle | 资产数 | 命中数 | 高优先级 | 高频问题片段 |
| --- | ---: | ---: | ---: | --- |
| `uiBundle` | 400 | 280 | 0 | `主页素材` x 48，`道具` x 22，`过关页面` x 20，`复活` x 15，`失败页面` x 15，`成功进度` x 14，`订阅` x 13，`分享有奖` x 12，`排行榜` x 12，`更多玩法` x 10 |
| `aniBundle` | 156 | 155 | 0 | `神兽动画合集` x 30，`骨骼动画` x 25，`鸭子动画` x 20，`小三视频` x 17，`破门动画` x 8，`百鹅朝凤` x 6，`百鹅朝麟` x 6，`百鹅朝鹏` x 6，`百鸭朝鲲` x 6，`百鸭朝龙` x 6 |
| `DuckBundle` | 1227 | 99 | 0 | `难度飙升` x 18，`背景` x 3，`飙升` x 3，`飙升2` x 3，`槽位已满` x 3，`底` x 3，`钉子光圈` x 3，`滑动条` x 3，`剪影3` x 3，`木桩` x 3 |
| `audioBundle` | 65 | 0 | 0 | 无 |
| `Game2Bundle` | 161 | 0 | 0 | 无 |
| `HomeBundle` | 231 | 0 | 0 | 无 |
| `internal` | 18 | 0 | 0 | 无 |
| `main` | 5 | 0 | 0 | 无 |
| `resources` | 27 | 0 | 0 | 无 |
| `start-scene` | 3 | 0 | 0 | 无 |

## 分 Bundle 详情

### uiBundle
- 配置：`subpackages/uiBundle/config.ui-bundle.json`
- 资产路径数：400
- 命中候选：280
- 高/中/低优先级：0 / 238 / 42
- 高频问题片段：`主页素材` x 48，`道具` x 22，`过关页面` x 20，`复活` x 15，`失败页面` x 15，`成功进度` x 14，`订阅` x 13，`分享有奖` x 12，`排行榜` x 12，`更多玩法` x 10
- 样例候选：
  - `tex/过关页面/成功进度/百鹅朝凤/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、百鹅朝凤 (non-ascii)
  - `tex/过关页面/成功进度/百鹅朝麟/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、百鹅朝麟 (non-ascii)
  - `tex/过关页面/成功进度/百鸭朝鲲/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、百鸭朝鲲 (non-ascii)
  - `tex/过关页面/成功进度/百鸭朝龙/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、百鸭朝龙 (non-ascii)
  - `tex/过关页面/成功进度/百鸭朝鹏/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、百鸭朝鹏 (non-ascii)
  - `tex/过关页面/成功进度/百鸭朝雀/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、百鸭朝雀 (non-ascii)
  - `tex/过关页面/成功进度/只鹅解锁百鹅朝凤/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、只鹅解锁百鹅朝凤 (non-ascii)
  - `tex/过关页面/成功进度/只鹅解锁百鹅朝麟/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、只鹅解锁百鹅朝麟 (non-ascii)
  - `tex/过关页面/成功进度/只鹅解锁百鹅朝鹏/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、只鹅解锁百鹅朝鹏 (non-ascii)
  - `tex/过关页面/成功进度/只鹅解锁百鸭朝雀/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、只鹅解锁百鸭朝雀 (non-ascii)
  - `tex/过关页面/成功进度/只鸭解锁百鸭朝鹅/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、只鸭解锁百鸭朝鹅 (non-ascii)
  - `tex/过关页面/成功进度/只鸭解锁百鸭朝鲲/spriteFrame`：过关页面 (non-ascii)、成功进度 (non-ascii)、只鸭解锁百鸭朝鲲 (non-ascii)

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

### DuckBundle
- 配置：`subpackages/DuckBundle/config.duck-bundle.json`
- 资产路径数：1227
- 命中候选：99
- 高/中/低优先级：0 / 63 / 36
- 高频问题片段：`难度飙升` x 18，`背景` x 3，`飙升` x 3，`飙升2` x 3，`槽位已满` x 3，`底` x 3，`钉子光圈` x 3，`滑动条` x 3，`剪影3` x 3，`木桩` x 3
- 样例候选：
  - `tex/bubble/t0`：t0 (short-indexed-token)
  - `tex/bubble/t0/spriteFrame`：t0 (short-indexed-token)
  - `tex/bubble/t0/texture`：t0 (short-indexed-token)
  - `tex/bubble/t1/spriteFrame`：t1 (short-indexed-token)
  - `tex/bubble/t10/spriteFrame`：t10 (short-indexed-token)
  - `tex/bubble/t11/spriteFrame`：t11 (short-indexed-token)
  - `tex/bubble/t12/spriteFrame`：t12 (short-indexed-token)
  - `tex/bubble/t2/spriteFrame`：t2 (short-indexed-token)
  - `tex/bubble/t3/spriteFrame`：t3 (short-indexed-token)
  - `tex/bubble/t4/spriteFrame`：t4 (short-indexed-token)
  - `tex/bubble/t5/spriteFrame`：t5 (short-indexed-token)
  - `tex/bubble/t6/spriteFrame`：t6 (short-indexed-token)

### audioBundle
- 配置：`subpackages/audioBundle/config.audio-bundle.json`
- 资产路径数：65
- 命中候选：0
- 高/中/低优先级：0 / 0 / 0
- 高频问题片段：无
- 样例候选：
  - 无

### Game2Bundle
- 配置：`subpackages/Game2Bundle/config.game2-bundle.json`
- 资产路径数：161
- 命中候选：0
- 高/中/低优先级：0 / 0 / 0
- 高频问题片段：无
- 样例候选：
  - 无

### HomeBundle
- 配置：`subpackages/HomeBundle/config.home-bundle.json`
- 资产路径数：231
- 命中候选：0
- 高/中/低优先级：0 / 0 / 0
- 高频问题片段：无
- 样例候选：
  - 无

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

