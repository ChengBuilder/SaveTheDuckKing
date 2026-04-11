---
name: duckbundle-readability-governance
description: 并行收敛 DuckBundle 的旧中文段与 bubble 短编号路径，强调语义化改名、幂等迁移与护栏防回流。
---

## 触发场景
- `architecture/docs/asset-readability-audit.md` 仍报告 DuckBundle 存在 `背景`、`随机道具`、`难度飙升`、`newNail/问号`、`bubble/t0..t12` 这类可读性噪音。
- 需要在不新增 runtime alias 的前提下，把最难读的 canonical 路径收敛成可检索、可复跑的结构。

## 并行拆分模板
1. Worker A（语义化迁移）：
- 负责 `subpackages/DuckBundle/config.duck-bundle.json` 的旧中文段与 `bubble/t0..t12` 收敛。
- 通过 `architecture/tools/semanticize-duckbundle-readability-assets.js` 做幂等改写。
2. Worker B（护栏）：
- 负责 `architecture/tools/check-legacy-runtime-compat.js` 新增 DuckBundle 旧路径禁回流检查。
- 负责 `architecture/tools/run-guardrails.js` 注册新脚本语法检查。
3. 主线程（收口）：
- 合并补丁后跑验证命令，更新治理日志与迭代报告。

## 执行步骤
1. 执行语义化脚本：
```bash
node architecture/tools/semanticize-duckbundle-readability-assets.js
```
2. 立刻再执行一次，确认第二次改写数为 0。
3. 跑护栏：
```bash
node architecture/tools/check-legacy-runtime-compat.js
node architecture/tools/run-guardrails.js
```
4. 收口文档与量化结果：
```bash
node architecture/tools/run-iteration-cycle.js
```

## 验证要点
- `subpackages/DuckBundle/config.duck-bundle.json` 不再包含旧中文 canonical 段或 `tex/bubble/t0..t12`.
- `check-legacy-runtime-compat` 不再报告 DuckBundle 可读性旧路径回流。
- `run-guardrails` 包含新脚本语法检查且最终通过。

## 回退原则
- 若护栏失败，优先回看映射表与残留 token，不新增 runtime mapping 兜底。
- 若某个目录的语义命名仍不稳，优先保留结构语义和中性命名，不硬猜业务语义。
