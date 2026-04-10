---
name: game2bundle-canonical-governance
description: 并行收敛 Game2Bundle 的中文 canonical 路径段，强调中性命名、幂等迁移与护栏防回流。
---

## 触发场景
- `Game2Bundle` 仍含中文目录段（如 `背景`、`道具`、`解锁进度`、`洞`、`遮罩`、`随机问号`）。
- 需要保持运行时稳定，不引入 runtime mapping，只做 canonical 源头收敛。

## 并行拆分模板
1. Worker A（路径迁移）：
- 负责 `subpackages/Game2Bundle/config.game2-bundle.json` 的中文段语义化收敛。
- 通过 `architecture/tools/semanticize-game2bundle-path-assets.js` 做可复跑改写。
2. Worker B（护栏）：
- 负责 `check-legacy-runtime-compat.js` 增加 Game2 中文段禁回流检查。
- 负责 `run-guardrails.js` 注册迁移脚本语法检查。
3. 主线程（集成）：
- 合并补丁后跑全量护栏与迭代流水线，确认报告与可读性指标同步更新。

## 执行步骤
1. 执行路径迁移：
```bash
node architecture/tools/semanticize-game2bundle-path-assets.js
```
2. 幂等校验（同命令再执行一次，改写数应为 0）。
3. 运行护栏：
```bash
node architecture/tools/check-legacy-runtime-compat.js
node architecture/tools/run-guardrails.js
```
4. 生成量化报告：
```bash
node architecture/tools/run-iteration-cycle.js
```

## 验证要点
- `subpackages/Game2Bundle/config.game2-bundle.json` 不再含 `背景/道具/解锁进度/洞/遮罩/随机问号/随机水果`。
- 护栏报告已包含 `Game2Bundle 路径语义化工具语法检查` 且为通过状态。
- 兼容检查报告不再出现 Game2 中文 canonical 残留。

## 回退原则
- 护栏失败时，优先回看 segment 映射是否误伤，再修复脚本并重跑；禁止引入 runtime alias 暂时兜底。
- 若出现目录分层歧义，优先使用中性命名（结构语义）而不是业务猜测命名。
