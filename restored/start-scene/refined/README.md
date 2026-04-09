# refined 手工还原层

这个目录用于保存“人工语义重命名”版本的模块，目标是把核心逻辑从压缩结构逐步还原成可维护代码。

## 约束

- 仅用于阅读与还原，不参与运行时加载。
- 优先保留行为语义，弱化对原始包装结构（`System.register`）的依赖。
- 每个文件都应在头部标注对应的 `*.restored.js` 来源。

## 当前模块

- `AudioManager.ts.refined.js`
- `GameCtrl.ts.refined.js`
- `GameData.ts.refined.js`
- `GameData2.ts.refined.js`
- `ResManager.ts.refined.js`
- `Util.ts.refined.js`
- `Wood.ts.refined.js`
- `itemPigeonNode.ts.refined.js`

## 推荐工作流

1. 先看 `../method-inventory.md` 选高优先级模块。
2. 再看 `../rename-workbench/*.workbench.json` 获取命名线索（字段、storage key、资源路径）。
3. 最后在本目录新增/更新 `*.refined.js`，做人工语义重命名。
