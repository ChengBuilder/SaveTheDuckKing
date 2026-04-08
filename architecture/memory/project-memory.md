# 项目记忆（持续更新）

## 当前工程属性
- 这是微信小游戏发布产物工程，不是 Cocos Creator 原始源码工程。
- 当前可直接运行目录：`./`（仓库根目录）。
- 历史路径 `runnable_wechat_project/` 已不再是当前运行目录，工具链已兼容两种布局。
- 入口桥接策略：`game.js -> architecture/boot/game-bootstrap.js`

## 已落地决策
1. 不直接深改打包压缩业务代码（`game.js` 大段产物）。
2. 通过 `architecture/` 承载可维护逻辑与文档。
3. 每次迭代后必须运行“运行安全校验”。

## 最新沉淀（2026-04-07）
1. 启动层拆分为 6 个模块：`config`、`system-info`、`render-policies`、`runtime-bridge`、`app-lifecycle`、`game-bootstrap`。
2. 新增运行安全校验：`verify-runtime-safety.js`。
3. 新增一键护栏：`run-guardrails.js`。
4. 新增项目内技能文档：`skills/maintainer/SKILL.md`。
5. 启动参数支持运行时覆盖：`globalThis.__DUCK_BOOT_OVERRIDES`。

## 最新沉淀（2026-04-07 第二轮）
1. 新增运行时上下文模块：`boot/global-context.js`，统一处理全局对象兼容。
2. 修复重复启动风险：`boot/game-bootstrap.js` 新增启动状态机（pending/running/completed/failed）。
3. 修复分辨率重复放大风险：`boot/render-policies.js` 改为基于“逻辑尺寸 + DPR”计算，不再累乘。
4. 修复 loadingView 兼容风险：`boot/app-lifecycle.js` 对 `start/setProgress/end` 统一做 Promise 安全包装。
5. 新增素材/代码分离护栏：`tools/check-asset-code-separation.js`。
6. 新增结构报告生成：`tools/generate-asset-code-report.js` + `docs/asset-code-layout.md`。

## 最新沉淀（2026-04-07 第三轮）
1. 新增迭代报告生成器：`tools/generate-iteration-report.js`。
2. 新增迭代报告索引目录：`docs/iterations/README.md`（自动维护）。
3. 报告内容固定包含：项目架构、入口链路、启动模块、常用命令、本轮变更文件。
4. 约定每轮优化后都要生成一份迭代报告，保证“看文档即可接手”。

## 最新沉淀（2026-04-07 第四轮）
1. 新增一键迭代流水线：`tools/run-iteration-cycle.js`。
2. 流水线自动执行：模块索引 -> 分层报告 -> 护栏检查 -> 迭代报告。
3. 新增迭代工作流文档：`docs/iteration-workflow.md`。
4. 启动桥接路径规范化：`boot/runtime-bridge.js` 增加 `normalizeRuntimeModulePath`。

## 最新沉淀（2026-04-08 第五轮）
1. 新增启动日志模块：`boot/boot-logger.js`，统一中文日志输出。
2. 支持调试日志开关：`globalThis.__DUCK_BOOT_DEBUG` / `globalThis.__DUCK_DEBUG`。
3. 启动链路日志统一中文化（boot/app-lifecycle/system-info/render/runtime-bridge）。
4. 根目录新增 `.gitignore`，已忽略 `.idea/` 与 `.DS_Store`。

## 最新沉淀（2026-04-08 第六轮）
1. 新增项目路径策略模块：`tools/project-paths.js`，统一识别项目根与 git 工作区根。
2. `run-guardrails.js` 不再写死 `runnable_wechat_project/`，并新增 `docs/guardrail-report.md` / `docs/guardrail-report.json`。
3. `generate-iteration-report.js` 现在会自动写入最近一次护栏校验结果。
4. `generate-asset-code-report.js` 与 `check-asset-code-separation.js` 已忽略 `.git`、`.idea`、`node_modules`。
5. 维护文档、项目记忆、常用命令已切换到当前仓库根目录布局。

## 最新沉淀（2026-04-08 第七轮）
1. 启动配置兜底能力已收敛到 `boot/config.js`，入口不再重复维护配置规范化逻辑。
2. 新增启动安全模块：`boot/boot-safety.js`，统一处理状态存储、状态流转、重复启动跳过与失败记录。
3. 新增平台策略模块：`boot/platform-strategy.js`，统一处理 Android 下一帧启动与默认立即启动规则。
4. `boot/game-bootstrap.js` 已瘦身为“编排入口”，并把 `__DUCK_BOOT_INFO` 扩展为配置/平台/目标帧率快照。
5. 迭代报告新增“启动配置快照”“平台与安全策略快照”，无需运行小游戏也能看清当前规则。

## 最新沉淀（2026-04-08 第八轮）
1. 新增性能策略模块：`boot/performance-strategy.js`，统一编排画布方向、渲染分辨率与帧率策略。
2. 新增启动观测模块：`boot/boot-observer.js`，统一维护 `__DUCK_BOOT_INFO` 的阶段事件、指标与完成状态。
3. `boot/app-lifecycle.js` 已支持阶段回调，能回传 loading、应用创建、引擎初始化、应用启动等关键节点。
4. 迭代报告新增“性能与运行时观测快照”，可直接看到性能默认参数、观测入口、关键阶段与关键指标。
5. 风格护栏已修正为“只认紧邻函数的 JSDoc”，不再需要用重复注释规避检查。

## 最新沉淀（2026-04-08 第九轮）
1. `boot/boot-observer.js` 已为每个启动阶段记录 `sinceBootMs` 与 `sincePreviousPhaseMs`，可直接查看累计耗时与阶段间隔。
2. 启动观测新增 `phaseSummary`，会汇总阶段数量、平均阶段间隔、最长阶段间隔与总耗时。
3. `generate-iteration-report.js` 已把启动耗时字段写入“运行时观测快照”，后续定位启动慢点不需要先翻源码。

## 最新沉淀（2026-04-08 第十轮）
1. 新增启动恢复策略模块：`boot/recovery-strategy.js`，统一处理错误摘要、失败阶段记录与恢复策略归档。
2. `boot/game-bootstrap.js` 的失败分支已进一步瘦身，入口只保留编排职责，不再散落错误归档细节。
3. 迭代报告新增恢复策略快照，能直接看到失败阶段名、错误字段与堆栈预览规则。

## 关键风险与约束
1. `game.js` 内大量压缩代码不可控，深改风险极高。
2. 允许改动 `game.js` 的范围：仅限启动桥接与必要接入点。
3. 任何性能策略默认保守，不可影响主流程可用性。

## 必跑检查
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
node architecture/tools/run-guardrails.js
```

## 下阶段迭代路线
1. 在 `architecture/boot` 中继续拆分更细粒度策略模块（首屏加载资源策略、异常恢复策略）。
2. 继续增强自动化报告，补充运行时快照样例与异常场景说明。
3. 对高频改动逻辑优先做“可维护层替换”。
