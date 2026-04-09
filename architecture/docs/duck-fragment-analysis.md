# Duck Fragment 分组分析

## 目标

回答 `DuckBundle` 中 `tex/fragment/a..e/*` 到底是不是纯乱码目录，以及它们是否已经具备进入语义化 rename 的证据。

## 代码证据

### 1. `Util.fragmentEffect()`

- `restored/start-scene/Util.ts.restored.js` 中存在碎片特效入口：
  - 运行时会按 `tex/fragment/${groupKey}/${1..6}/spriteFrame` 动态加载资源。
- 结论：
  - `a..e` 不是孤立垃圾目录，而是玩法运行时会按组访问的碎片资源集。

### 2. `Wood.initWood()`

- `restored/start-scene/Wood.ts.restored.js` 中木板贴图目录来自：
  - `GameModel.woodColorArr = ["grayWood","lightWood","redWood","brownWood","goldWood"]`
- 结论：
  - 木板本体已经具备稳定的语义颜色目录；
  - `fragment/a..e` 更像是“木板碎片视觉组”的历史短名，而不是完全无结构的随机文件。

## 图像证据

对五组 `1` 号碎片图的透明像素平均色做了离线统计：

| Fragment 组 | 样本图 | 平均 RGB | 推断 |
| --- | --- | --- | --- |
| `a` | `tex/fragment/a/1` | `(151.3, 97.0, 56.7)` | 暖红棕，接近 `redWood` |
| `b` | `tex/fragment/b/1` | `(116.2, 116.2, 116.2)` | 中灰，接近 `grayWood` |
| `c` | `tex/fragment/c/1` | `(76.4, 50.2, 31.5)` | 深棕，接近 `brownWood` |
| `d` | `tex/fragment/d/1` | `(165.8, 165.8, 165.8)` | 浅灰，接近 `lightWood` |
| `e` | `tex/fragment/e/1` | `(198.8, 156.6, 114.2)` | 金黄，接近 `goldWood` |

## 当前推断

高置信推断如下：

| Fragment 组 | 推断语义 |
| --- | --- |
| `a` | `redWoodFragments` |
| `b` | `grayWoodFragments` |
| `c` | `brownWoodFragments` |
| `d` | `lightWoodFragments` |
| `e` | `goldWoodFragments` |

## 风险判断

虽然颜色证据已经很强，但当前还缺少一条明确的“运行时 groupKey 从哪里生成”的直接调用链证据。

补充静态审计结果：

- `architecture/docs/duck-fragment-usage-audit.md` 当前只找到 `fragmentEffect` 定义，没有找到任何静态调用点；
- `Wood.ts` 的木板下落分支会在越界后直接 `destroy()` 节点，没有触发碎片工具函数。

也就是说，我们已经能高置信判断 `a..e` 是颜色分组，但还需要继续追：

1. 谁在调用 `Util.fragmentEffect(node, parent, groupKey)`；
2. 调用方是直接传 `a..e`，还是由 `woodColor` / `woodTextureDirectory` 转换出来。

## 建议

1. 继续还原 `DuckController.ts` 与相关木板破碎逻辑，定位 `groupKey` 生成点。
2. 找到生成点后，再统一推进：
   - canonical 路径 rename；
   - `SpriteFrame.name` rename；
   - 运行时兼容归一化；
   - 护栏校验。
