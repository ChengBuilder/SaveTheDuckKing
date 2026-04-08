# start-scene 模块还原

这个目录用于保存从 `game.js` 内联包中拆出来的可读副本，目标是逐步把业务模块从“单文件压缩产物”还原为可维护结构。

## 当前内容

- `*.restored.js`：可读副本（不参与运行时加载）
- `module-index.json`：start-scene 下全部 `System.register` 模块索引（含是否已导出）
- `module-alias-map.json`：导出模块的导入别名提示（例如 `t => inheritsLoose`）

## 生成命令

默认（导出核心模块子集）：

```bash
node tools/deobf/extract-start-scene-modules.js
```

导出全部 76 个模块：

```bash
node tools/deobf/extract-start-scene-modules.js --all
```

按模块名定向导出：

```bash
node tools/deobf/extract-start-scene-modules.js --modules=chunks:///_virtual/GameModel2.ts,chunks:///_virtual/HomeScene.ts
```

生成语义视图（默认核心模块子集）：

```bash
node tools/deobf/generate-semantic-views.js
```

全量生成语义视图：

```bash
node tools/deobf/generate-semantic-views.js --all
```

生成方法清单（便于下一步按模块深挖还原）：

```bash
node tools/deobf/generate-method-inventory.js
```

## 说明

- 该目录用于“可读性还原与命名分析”，不改线上运行逻辑。
- 当前仓库快照已执行过 `--all`，目录内是 76 个模块全量副本。
- 脚本每次执行会先清理旧的 `*.restored.js`，再按当前参数重建，保证结果集一致。
- `semantic/` 目录是二阶段可读视图，仅做安全注释增强：`var` 别名注释 + `setters` 赋值注释，不做标识符替换。
- `method-inventory.md/.json` 会列出每个模块的原型方法与描述符键数量，用于确定下一步重命名优先级。
- 每次扩展还原范围后，建议执行：

```bash
for f in tools/deobf/extract-start-scene-modules.js restored/start-scene/*.restored.js; do
  node -c "$f" || exit 1
done

for f in tools/deobf/generate-semantic-views.js restored/start-scene/semantic/*.semantic.js; do
  node -c "$f" || exit 1
done

node -c tools/deobf/generate-method-inventory.js
```
