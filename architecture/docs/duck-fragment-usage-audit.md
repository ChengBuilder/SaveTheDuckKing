# Duck Fragment 使用审计（自动生成）

> 本文件由 `architecture/tools/generate-duck-fragment-usage-audit.js` 生成。

## 总览
- 生成时间：2026-04-08T15:18:23.799Z
- Bundle：`DuckBundle`
- 扫描文件数：5
- `fragmentEffect` 定义数：2
- `fragmentEffect` 静态调用数：0
- 碎片组数量：5
- 碎片资源路径数：90
- 木板贴图目录数：6

## 结论
- 状态：`definition-only`
- 高概率死代码：是
- 结论摘要：当前仅找到 fragmentEffect 定义，未找到任何静态调用点；同时 Wood 下落分支直接销毁节点，碎片特效高度疑似历史残留工具函数。
- 建议下一步：继续保持 tex/fragment/a..e 只做审计与语义推断，不直接 rename；若未来发现动态调用入口，再补兼容闭环。

## 定义与调用
- 定义位置：
  - `game.js:111` -> `...ew a(255,0,0)}).to(.1,{color:t}).delay(.1).to(.1,{color:new a(255,0,0)}).to(.1,{color:t}).union().start()}},t.fragmentEffect=function(e,n,i){for(var a="tex/fragment/"+i+"/",p=e.worldPosition,f=e.worldRotation,g=0;g<10;g+...`
  - `restored/start-scene/Util.ts.restored.js:311` -> `,t.fragmentEffect=function(e,n,i){`
- 未找到任何静态调用点（含 `game.js` 与已还原模块）。

## 木板销毁线索
- `restored/start-scene/Wood.ts.restored.js:94` -> `if(this.node.worldPosition.y<=200){`
- `restored/start-scene/Wood.ts.restored.js:98` -> `i.woodArr.splice(i.woodArr.indexOf(this.node),1),this.node.destroy()}`

## 碎片组清单
- `a`：共 18 条，样例：`tex/fragment/a/1`、`tex/fragment/a/1/spriteFrame`、`tex/fragment/a/1/texture`、`tex/fragment/a/2`、`tex/fragment/a/2/spriteFrame`、`tex/fragment/a/2/texture`
- `b`：共 18 条，样例：`tex/fragment/b/1`、`tex/fragment/b/1/spriteFrame`、`tex/fragment/b/1/texture`、`tex/fragment/b/2`、`tex/fragment/b/2/spriteFrame`、`tex/fragment/b/2/texture`
- `c`：共 18 条，样例：`tex/fragment/c/1`、`tex/fragment/c/1/spriteFrame`、`tex/fragment/c/1/texture`、`tex/fragment/c/2`、`tex/fragment/c/2/spriteFrame`、`tex/fragment/c/2/texture`
- `d`：共 18 条，样例：`tex/fragment/d/1`、`tex/fragment/d/1/spriteFrame`、`tex/fragment/d/1/texture`、`tex/fragment/d/2`、`tex/fragment/d/2/spriteFrame`、`tex/fragment/d/2/texture`
- `e`：共 18 条，样例：`tex/fragment/e/1`、`tex/fragment/e/1/spriteFrame`、`tex/fragment/e/1/texture`、`tex/fragment/e/2`、`tex/fragment/e/2/spriteFrame`、`tex/fragment/e/2/texture`

## 木板目录与推断映射
- runtime `woodColorArr`：`grayWood`、`lightWood`、`redWood`、`brownWood`、`goldWood`
- canonical `tex/wood/*` 目录：`brownWood`、`goldWood`、`grayWood`、`lightWood`、`redWood`、`yellowWood`
- `brownWood` -> `c` -> `brownWoodFragments`
- `goldWood` -> `e` -> `goldWoodFragments`
- `grayWood` -> `b` -> `grayWoodFragments`
- `lightWood` -> `d` -> `lightWoodFragments`
- `redWood` -> `a` -> `redWoodFragments`

## 扫描文件
- `game.js`：`fragmentEffect` token 1 次，`tex/fragment/` token 1 次
- `restored/start-scene/Util.ts.restored.js`：`fragmentEffect` token 1 次，`tex/fragment/` token 1 次
- `restored/start-scene/Wood.ts.restored.js`：`fragmentEffect` token 0 次，`tex/fragment/` token 0 次
- `restored/start-scene/DuckController.ts.restored.js`：`fragmentEffect` token 0 次，`tex/fragment/` token 0 次
- `restored/start-scene/GameModel2.ts.restored.js`：`fragmentEffect` token 0 次，`tex/fragment/` token 0 次

## 说明
- 本报告只做静态扫描，不替代真机/DevTools 运行验证。
- 当前更适合作为 rename 风险判断与 refined 还原的证据底稿。

