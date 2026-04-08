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

## 最新沉淀（2026-04-08 第十一轮）
1. 命名清理策略已切换为“直接语义化 rename”，不再维护运行时映射表或中间台账。
2. 启动主应用虚拟模块已定名为 `application-main.js`，运行时设置清单已定名为 `src/runtime-settings.json`。
3. 运行时脚本包已定名为 `src/chunks/game-scripts.js`。
4. 顶层 bundle 配置后缀统一改为语义名，并直接对应 `config.<semantic>.json` / `index.<semantic>.js`。

## 最新沉淀（2026-04-08 第十二轮）
1. `assets/*` 与 `subpackages/*` 下的 `import/<uuid前两位>/`、`native/<uuid前两位>/` 分片目录已全部聚合为扁平根目录。
2. 资源路径兼容改为启动层补丁：`boot/asset-path-normalizer.js` 会在 `game.init()` 前为 `cc.assetManager.transformPipeline` 追加扁平路径修正，不深改压缩产物主干。
3. 分层护栏已对齐 Cocos 产物结构：`import/*.bin` 视为 CCON 编译元数据，继续归类到 import 元数据，不按 native 素材误判。

## 最新沉淀（2026-04-08 第十三轮）
1. 微信开发者工具在加载 root bundle 预加载脚本时，仍可能请求 `assets/<bundleName>bundle/index.js` 这类兼容入口，而不是语义化后的 `assets/<bundleName>/index.<semantic>.js`。
2. 当前已在 `game.js` 顶部为 `internal` 与 `start-scene` 保留 root bundle 脚本别名入口，确保语义化 rename 后仍能兼容 devtools 的 bundle 脚本解析。
3. `boot/asset-path-normalizer.js` 现已在进入 Cocos bundle 下载器前归一化 root bundle 请求：`internalbundle -> internal`、`start-scenebundle -> start-scene`，避免 devtools 继续回退到 `config.json` 旧路径。
4. 当前仓库已额外保留 root bundle 磁盘兼容目录：`assets/internalbundle/` 与 `assets/start-scenebundle/`，并补齐 `config.json` / `index.js`，优先保证微信开发者工具启动链稳定。
5. 当前已把 devtools 旧 bundle 路径兼容扩展到全部项目 bundle：`resourcesbundle`、`mainbundle`、`anibundle`、`audiobundle`、`duckbundle`、`game2bundle`、`homebundle`、`uibundle`，并在 `assets/` 下补齐对应 `config.json` / `index.js` / `import` / `native` 兼容副本。

## 最新沉淀（2026-04-08 第十四轮）
1. 微信开发者工具对语义名本身带 `Bundle` 的分包，仍会继续追加一次 `bundle` 后缀，请求 `assets/audioBundlebundle/`、`assets/uiBundlebundle/` 这类历史路径。
2. `boot/asset-path-normalizer.js` 当前 root bundle 归一化逻辑已泛化为“去掉前导 `./`、去掉前导 `assets/`、再裁掉末尾一次 `bundle`”，用于兼容 `internalbundle`、`resourcesbundle` 以及 `audioBundlebundle` 这类混合命名请求。
3. `game.js` 顶部已新增 exact-case 兼容模块入口：`aniBundlebundle`、`audioBundlebundle`、`DuckBundlebundle`、`Game2Bundlebundle`、`HomeBundlebundle`、`uiBundlebundle`，避免 devtools 在 `require('./assets/<name>bundle/index.js')` 时再次白屏。
4. `assets/` 下已补齐同名 exact-case 磁盘兼容目录，并同步保留 `config.json` / `index.js` / `import` / `native`，确保 `require` 与 `readFile` 两条链路都能命中真实文件。

## 最新沉淀（2026-04-08 第十五轮）
1. 新增 `tools/format-project-json.js`，统一把 `game.json`、`src/runtime-settings.json`、root bundle 配置和 subpackage bundle 配置格式化为可读 JSON，后续查依赖、查路径、查 bundle 字段不再只能看单行压缩内容。
2. 新增 `tools/generate-bundle-asset-catalog.js`，从 canonical bundle 配置自动提取资产路径、场景路径、依赖、主要前缀和 UUID 风格编译文件统计，输出 `docs/bundle-asset-catalog.md` / `.json`。
3. 本轮资源治理策略明确收敛为“两层治理”：运行时继续保留稳定 UUID 编译产物，维护层通过 bundle 目录、资产目录文档和关键 JSON 可读化先建立语义骨架，再分批替换高价值资源命名。
4. `run-iteration-cycle.js` 与 `run-guardrails.js` 已接入新工具，后续每轮优化都能自动补齐 JSON 可读化与 bundle 资产目录沉淀。

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
1. 继续清理 bundle 目录名、缩写名和高频语义不明入口，但每次只做闭环 rename，保证运行链不中断。
2. 在 `architecture/boot` 中继续拆分更细粒度策略模块（首屏加载资源策略、异常恢复策略）。
3. 对高频改动逻辑优先做“可维护层替换”。
