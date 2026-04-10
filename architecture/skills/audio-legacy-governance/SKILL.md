---
name: audio-legacy-governance
description: 记录音频 legacy root token 收敛的低风险 mapping 流程，强调 canonical-only 验证顺序和回滚策略。
---

## 触发场景
- 音频审计仍报告 `legacy/` 以外的高频根层 token（`adz`、`bdz`、`door`、`fly`、`win` 等）。
- 需要把 legacy 目录里的 canonical 路径节点补齐，并避免再引入运行时兼容层。

## 核心策略
1. 只干 canonical 源头路径与 import 元数据：优先改 `subpackages/audioBundle/config.audio-bundle.json`，必要时改 `subpackages/audioBundle/import/legacy/*.json` 的 `cc.AudioClip._name`；禁止新增运行时映射。
2. 先跑 `node architecture/tools/generate-audio-usage-audit.js` 确认要收敛的 token，还在根层，然后把目标写入 `architecture/docs/asset-governance-log.md`。
3. 把 root token 直接重命名到对应 `legacy/*`，并同步更新 `import/legacy/*.json` 的 `_name` 到可读语义名（如 `unknownLs`、`levelCompleteDuplicateGz`）。
4. 跑 `node architecture/tools/run-guardrails.js`（含 root token 禁回流），确认 guardrail 报告绿灯。

## 验证顺序与回退
- 验证顺序：`generate-audio-usage-audit` -> `run-guardrails`（语法检查 + root token 禁回流）-> `sed -n '1,200p' architecture/docs/asset-governance-log.md` 收口说明 -> `git status` 检查未追加 runtime 兼容改动。
- 回退策略：若 guardrail 抛回“root token 回流”，先还原 `legacy/*` 目标路径，然后重新跑 `generate-audio-usage-audit` 验证没有老 token 再跑 `run-guardrails`；如果需要临时复原某个音频让运行时继续稳定，优先用文档方式记录 legacy 目录里的 “暂保留 + 复原原因”，而不是制造新的动态映射。
