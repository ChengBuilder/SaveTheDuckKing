# Maintainer Skill

## 适用场景
- 继续迭代当前小游戏发布产物工程
- 需要“低风险改造 + 可运行性优先”

## 核心原则
1. 先在 `architecture/` 做可维护层改造，再桥接到 `game.js`
2. 不深改 `game.js` 压缩业务代码
3. 每次改动后必须执行运行安全检查
4. 素材与代码目录必须保持分层，不在 `architecture/` 混入二进制素材
5. 每轮优化结束后必须生成迭代报告，记录架构/入口/使用方式
6. 优先使用一键迭代流水线，确保沉淀文档与校验步骤不遗漏
7. 控制台输出优先中文，可读性优先，调试日志默认关闭按需开启
8. 启动层优先沿 `config -> boot-safety -> platform-strategy -> game-bootstrap` 方向继续拆分，而不是重新把逻辑塞回入口
9. 涉及性能与调试时，优先复用 `performance-strategy` 与 `boot-observer`，不要在入口里零散拼快照字段
10. 涉及启动失败处理时，优先复用 `recovery-strategy` 统一收敛错误摘要、失败阶段与恢复策略
11. 涉及哈希名/语义不明名治理时，优先直接做语义化 rename，禁止再引入运行时映射表或中间台账

## 必跑命令
```bash
node -c game.js
node -c architecture/boot/game-bootstrap.js
node -c architecture/boot/global-context.js
node -c architecture/boot/boot-logger.js
node -c architecture/boot/recovery-strategy.js
node -c architecture/boot/render-policies.js
node architecture/tools/check-architecture-style.js
node architecture/tools/check-asset-code-separation.js
node architecture/tools/verify-runtime-safety.js
node architecture/tools/generate-iteration-report.js
node architecture/tools/run-iteration-cycle.js
```

## 标准迭代流程
1. 阅读 `architecture/memory/project-memory.md`
2. 仅修改本次目标相关模块
3. 运行必跑命令
4. 查看 `architecture/docs/guardrail-report.md`，确认失败项已清零
5. 查看最新迭代报告，确认“启动配置快照 / 平台与安全策略快照”符合预期
6. 更新 `project-memory.md` 的“已落地决策 / 下阶段路线 / 已完成命名清理”

## 音频 legacy 收敛切片
1. 定位：先在 `architecture/docs/audio-usage-audit.md` 与 `architecture/memory/project-memory.md` 的“legacy root token”条目中确认仍挂在根层的 tokens，并直接记录本轮要收敛的 canonical target，确保与项目内已有决策一致（禁止新增 runtime 兼容层）。
2. 改 config：在 `subpackages/audioBundle/config.audio-bundle.json` 里把 root token 直接重命名成 `legacy/*` 路径；必要时同步 `subpackages/audioBundle/import/legacy/*.json` 的 `cc.AudioClip._name`，不改 runtime/boot 兼容层。
3. 跑护栏：先运行 `node architecture/tools/generate-audio-usage-audit.js`，再 `node architecture/tools/run-guardrails.js`（包含 root token 禁回流护栏），确认没有回退到老 token，并把 `architecture/docs/guardrail-report.md` 推到绿色。
4. 更新日志：在 `architecture/docs/asset-governance-log.md` 记录 2026-04-10 音频收敛，说明只做 canonical 源头路径收敛、列出关键映射、确认 root token 禁回流护栏已上线，使后续 AI 能复用同一个“切片”流程。

## DuckBundle fragment/%2 收敛切片
1. 定位：先看 `architecture/docs/asset-readability-audit.md`，确认 `DuckBundle` 是否仍有 `tex/fragment/a..e/1..6` 与 `tex/%2` 这类高风险 token。
2. 并行执行：
   - 路径迁移：`node architecture/tools/semanticize-duckbundle-fragment-path-assets.js`
   - `%2` 清理：`node architecture/tools/semanticize-duckbundle-percent-assets.js`
3. 幂等验证：两条脚本各再跑一次，期望“改写数为 0”。
4. 护栏验证：依次执行 `node architecture/tools/check-no-url-encoded-paths.js`、`node architecture/tools/check-legacy-runtime-compat.js`、`node architecture/tools/run-guardrails.js`。
5. 收口文档：更新 `architecture/docs/asset-governance-log.md` 记录 mapping、护栏与结果，并跑 `node architecture/tools/run-iteration-cycle.js` 产出最新量化数据。

## Game2Bundle 中文 canonical 收敛切片
1. 定位：先看 `architecture/docs/asset-readability-audit.md` 与 `subpackages/Game2Bundle/config.game2-bundle.json`，确认是否仍残留 `背景/道具/解锁进度/洞/遮罩/随机水果` 等中文目录段。
2. 并行执行：
   - 路径迁移：`node architecture/tools/semanticize-game2bundle-path-assets.js`
   - 护栏扩展：在 `architecture/tools/check-legacy-runtime-compat.js` 注册 Game2 中文段禁回流检查，并在 `architecture/tools/run-guardrails.js` 接入脚本语法检查。
3. 幂等验证：`semanticize-game2bundle-path-assets` 连续执行两次，第二次改写数必须为 0。
4. 护栏验证：执行 `node architecture/tools/check-legacy-runtime-compat.js` 与 `node architecture/tools/run-guardrails.js`，确保无中文 canonical 回流。
5. 收口文档：在 `architecture/docs/asset-governance-log.md` 记录本轮映射与验证结果，再执行 `node architecture/tools/run-iteration-cycle.js` 更新整体量化报告。
