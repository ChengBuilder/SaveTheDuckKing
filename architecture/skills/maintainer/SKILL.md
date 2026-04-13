# Maintainer Skill

## 适用场景
- 继续迭代当前小游戏发布产物工程
- 需要“低风险改造 + 可运行性优先”

## 核心原则
1. 先在 `architecture/` 做可维护层改造，再桥接到 `game.js`
2. 不做无证据的大范围 `game.js` 深改；允许在“有引用证据”的前提下定点删死逻辑/改旧路径
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

## Unused Safe-Ignore 收敛切片
1. 定位：先看 `analyse-data.json` 的 `unusedCodeFiles`，只处理“开发侧无运行时依赖”的路径，明确禁止把 `game.js`、`assets/`、`subpackages/`、`runtime/` 加入 ignore。
2. 执行：
   - 审计预览：`node architecture/tools/sync-safe-ignore-from-analyse.js`
   - 安全应用：`node architecture/tools/sync-safe-ignore-from-analyse.js --apply`
3. 幂等验证：`--apply` 连续执行两次，第二次 `addedSafeCandidates` 必须为 `0`。
4. 护栏验证：执行 `node architecture/tools/run-guardrails.js`，确认 `unused safe-ignore` 工具语法检查通过且全量护栏仍绿色。
5. 收口文档：检查 `architecture/docs/unused-safe-ignore-report.md` 与 `architecture/docs/wechat-code-package-report.md`，确认本轮只做“安全忽略收敛”，没有引入运行时路径风险。

## game.js 反混淆收敛切片
1. 定位：先执行 `node architecture/tools/generate-gamejs-deobfuscation-audit.js`，读取 `architecture/docs/gamejs-deobfuscation-audit.md` 的三组信号：`保守不可达模块`、`壳模块候选`、`高混淆热点`。
2. 拆批：
   - 优先批次 A：`保守不可达模块`（静态和启发式入口都不可达，清理风险最低）
   - 优先批次 B：`壳模块候选`（只做转发的薄壳，适合并到统一入口）
   - 优先批次 C：`高混淆热点`（先导出阅读，再做等价重构）
3. 导出阅读：
   - 不可达导出：`node architecture/tools/generate-gamejs-deobfuscation-audit.js --export-unreachable`
   - 高混淆导出：`node architecture/tools/generate-gamejs-deobfuscation-audit.js --export-high-obfuscation`
   - 定点导出：`node architecture/tools/generate-gamejs-deobfuscation-audit.js --export-module=assets/start-scene/index.start-scene.js`
4. 实施原则：删除和替换必须“可逆 + 可验证”，优先改薄壳和重复桥接，不直接大面积改 gameplay 逻辑。
5. 回归验证：执行 `node architecture/tools/run-guardrails.js`，并重新跑一遍 `generate-gamejs-deobfuscation-audit`，确认 `保守不可达模块` 和 `高混淆热点` 数量在下降。

## game.js 入口瘦身切片
1. 定位：当 `game.js` 持续膨胀且难以审阅时，优先改为“瘦入口 + 模块清单”，而不是继续在单文件内硬改。
2. 执行：运行 `node architecture/tools/split-gamejs-into-modules.js`，将 `define(...)` 模块拆到 `runtime/gamejs-modules/`，入口仅保留插件桥接和启动编排。
3. 并行协作建议：
   - 线程 A：执行拆分与回归（`gamejs:split` + `run-guardrails`）
   - 线程 B：基于 `runtime/gamejs-modules/manifest.json` 做模块归类（入口/平台适配/业务层）
   - 线程 C：对高混淆模块做定点语义化改造草案
4. 收口：提交前必须确认 `game.js` 不再包含大段 `define` 产物，且 `require(\"game.js\")` 仍可启动。
5. 回归验证：执行 `node architecture/tools/run-guardrails.js`，并重点观察 `verify-runtime-safety` 与微信包体检查结果。

### 拆分后 `Error 3804` 快速排查
1. 现象：控制台出现 `Error 3804` 且栈落在某个组件 `update` 的 `getComponent(...)` 调用。
2. 根因高频项：循环依赖下，`getComponent(变量)` 的变量在运行时未绑定（值为 `undefined`）。
3. 处理原则：不回滚拆分，不加 runtime 兼容层；直接把调用改成稳定组件名字符串，例如 `getComponent(\"DuckController\")`。
4. 落地点：优先写进 `architecture/tools/split-gamejs-into-modules.js` 的 `patchFactorySourceForRuntimeId`，保证每次重切分自动带上修复。

## 多 Agent 并行模板
1. 先切片：按“互不重叠文件集”分配子任务，至少拆成 `路径迁移`、`护栏扩展`、`文档沉淀` 三条线。
2. 再并行：优先把不阻塞主线的只读分析交给 explorer；主线程同时推进一条可直接落地的改动，避免空等。
3. 冲突约束：每个 agent 在任务里显式声明负责文件，禁止回滚他人改动，提交前统一二次审查 `git diff --name-only`。
4. 限流回退：若子 agent 出现 `429` 或超时，主线程立即切回本地串行执行，并把“已完成/未完成清单”写入本轮迭代说明，避免断点丢失。
5. 收口标准：并行任务最终必须汇总为“一次可回归提交”，并完成 `幂等复跑 + 护栏 + 官方检查`。

## DuckBundle 可读性收敛切片
1. 定位：先看 `architecture/docs/asset-readability-audit.md`，确认 `DuckBundle` 是否仍残留 `tex/背景`、`tex/随机道具`、`tex/newNail/问号`、`tex/newNail/ls1..ls14`、`tex/newNail/lw1..lw14`、`tex/难度飙升/*`、`tex/bubble/t0..t12` 这类可读性噪音。
2. 并行执行：
   - 路径迁移：`node architecture/tools/semanticize-duckbundle-readability-assets.js`
   - 护栏扩展：在 `architecture/tools/check-legacy-runtime-compat.js` 注册 DuckBundle 旧中文段、`newNail/ls1..ls14`、`newNail/lw1..lw14` 与 `bubble/t0..t12` 禁回流检查，并在 `architecture/tools/run-guardrails.js` 接入脚本语法检查。
3. 幂等验证：`semanticize-duckbundle-readability-assets` 连续执行两次，第二次改写数必须为 0。
4. 护栏验证：执行 `node architecture/tools/check-legacy-runtime-compat.js` 与 `node architecture/tools/run-guardrails.js`，确保无旧中文段、`newNail/ls1..ls14`、`newNail/lw1..lw14` 或 `bubble` 短编号回流。
5. 收口文档：在 `architecture/docs/asset-governance-log.md` 记录本轮映射与验证结果，再执行 `node architecture/tools/run-iteration-cycle.js` 更新整体量化报告。
