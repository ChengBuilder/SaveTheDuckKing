---
name: duckbundle-canonical-governance
description: 并行收敛 DuckBundle 的 fragment 与 `%2` canonical 路径，强调中性命名、幂等迁移与护栏防回流。
---

## 触发场景
- `architecture/docs/asset-readability-audit.md` 在 `DuckBundle` 里出现 `tex/fragment/a..e/1..6`、`tex/%2` 等高噪音 canonical 路径。
- 需要在不引入 runtime 兼容层的前提下，做可复跑、可审计、低风险的路径治理。

## 并行拆分模板
1. Worker A（fragment 路径迁移）：
- 负责 `config + import/native` 的 `fragment` 路径收敛（`a..e/1..6 -> variantA..E/shape1..6`）。
- 只用中性维度命名，不猜业务语义。
2. Worker B（`%2` 清理 + 护栏）：
- 负责 `%2 -> percent2` canonical 重命名。
- 负责 URL 编码路径护栏扩展，阻止回流。
3. 主线程（集成）：
- 合并两侧补丁，补 `check-legacy-runtime-compat` 与 `run-guardrails` 注册，跑全量验证和迭代报告。

## 执行步骤
1. 执行 fragment 迁移脚本：
```bash
node architecture/tools/semanticize-duckbundle-fragment-path-assets.js
```
2. 执行 `%2` 迁移脚本：
```bash
node architecture/tools/semanticize-duckbundle-percent-assets.js
```
3. 幂等校验（两条脚本重复执行一次，改写数应为 0）。
4. 运行护栏：
```bash
node architecture/tools/check-no-url-encoded-paths.js
node architecture/tools/check-legacy-runtime-compat.js
node architecture/tools/run-guardrails.js
```
5. 生成量化报告：
```bash
node architecture/tools/run-iteration-cycle.js
```

## 验证要点
- `subpackages/DuckBundle/config.duck-bundle.json` 不再含 `tex/fragment/[a-e]/[1-6]` 与 `tex/%2`。
- `subpackages/DuckBundle/import/tex/fragment`、`subpackages/DuckBundle/native/tex/fragment` 目录轴统一为 `variantX/shapeY`。
- `asset-readability-audit` 的高优先级候选保持为 0。

## 回退原则
- 若护栏失败，优先回看映射规则是否误伤 canonical 路径，再回跑语义化脚本；禁止新增 runtime alias 兜底。
- 若目录迁移冲突，先解决文件内容差异并保持幂等，再继续流程。
