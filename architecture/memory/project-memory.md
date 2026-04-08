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

## 最新沉淀（2026-04-08 第十六轮）
1. `audioBundle` 已完成第一批真实语义化 rename，把一批平铺音频路径收敛到 `bgm/`、`duckGame/`、`fruitGame/`、`sceneTransition/`、`ui/` 等一级目录。
2. 本轮已同步修改 canonical bundle 配置、微信开发者工具兼容配置副本、对应 `AudioClip` import 元数据，以及 `game.js` 中的直接字符串引用。
3. 新增 `docs/asset-governance-log.md`，只记录治理历史与待处理遗留项，不参与运行时映射。

## 最新沉淀（2026-04-08 第十七轮）
1. `audioBundle` 第二批 rename 已继续收敛 `p1`、`p2`、`plateUnlock`、`showGame`，其中 `p1/p2` 按木板重组动画用途落为 `duckGame/woodAssembleLead`、`duckGame/woodAssembleFollow`。
2. 新增 `tools/generate-audio-usage-audit.js`，会自动扫描 `game.js` 中的 `playSound/playMusic/playLongSound` 引用，并与 `audioBundle` canonical 路径比对。
3. 音频使用审计产物输出到 `docs/audio-usage-audit.md` / `.json`，并已接入 `run-iteration-cycle.js`；后续定位未引用候选和低可读命名不再需要纯手工排查。

## 最新沉淀（2026-04-08 第十八轮）
1. `audioBundle` 第三批 rename 已继续把高频根层音效收敛进 `ui/`、`fruitGame/`、`duckGame/`、`sceneTransition/`，本轮新增包括 `ui/buttonClick`、`ui/duckUnlock`、`ui/levelComplete`、`ui/failureStinger`、`ui/warningPrompt`、`ui/victoryStinger`、`ui/ribbonBurst`、`fruitGame/slotFull`、`duckGame/duckQuack`、`duckGame/errorPrompt`、`sceneTransition/duckDrop`。
2. `tools/generate-audio-usage-audit.js` 已新增“根层路径候选”输出，后续不用手工翻配置，也能直接看到还停留在 bundle 根层、最该继续分层的音频。
3. 当前 `audioBundle` 已收敛到 15 个根层候选，其中明确低可读遗留项仍为 `adz`、`bdz`、`ls`、`lz`、`gz`；其余 `clap/fail/win/fly/door/pop/over/levelup/show/bgm` 已进入下一轮优先判定清单。

## 最新沉淀（2026-04-08 第十九轮）
1. `audioBundle` 第四批 rename 已继续清理根层高频音效，把 `bgm`、`fail`、`clap` 收敛为 `bgm/defaultGameplay`、`ui/failurePrompt`、`ui/applause`。
2. 当前根层候选已进一步聚焦到“低可读遗留 + 未确认语义的未引用资源”，后续可优先继续处理 `win/fly/door/pop/over/levelup/show`，并保守挂账 `adz/bdz/ls/lz/gz`。

## 最新沉淀（2026-04-08 第二十轮）
1. `resources` 分包已完成第一批共享特效 rename，把 `彩带/cd1..7` 收敛为 `ribbonBurst/ribbon1..7`，并同步更新 `SpriteFrame` 名与 `game.js` 中的 `ribbon` 直接引用。
2. `resources` 分包第二批 rename 已继续清理 `粒子/*`、`lz/xg*`、`multTextures/*`、`DuckJson`，当前共享资源主前缀已收敛为 `particleEffects/`、`ribbonBurst/`、`multiTexture/`、`duck/`。
3. 本轮已通过“代码上下文 + 原始 atlas 视觉核对”双重确认语义：`deletePulseCircle` 对应删除脉冲圈、`fragmentShard` 对应刚体碎片、`colorMarker*` 对应按颜色区分的高亮粒子，不再保留 `lz/xg` 这类缩写。

## 最新沉淀（2026-04-08 第二十一轮）
1. 新增 `tools/generate-asset-readability-audit.js`，会自动扫描全部 bundle 的 canonical 路径，输出 `docs/asset-readability-audit.md` / `.json`，统一暴露短缩写、短缩写加序号、符号残留与中文目录等可读性候选。
2. `run-iteration-cycle.js` 已接入“素材可读性审计”，后续每轮都会自动刷新全项目候选清单，不再需要手工逐个 bundle 盘点。
3. `run-guardrails.js` 已接入该工具的语法检查，确保后续扩展审计规则时不会把迭代流水线带坏。
4. 当前报告已确认下一批优先对象可以聚焦三组：`DuckBundle` 的 `tex/wood/a..f/*` 木板缩写群、`HomeBundle` 的 `BgParticle/p1..p4` 与 `BgThings*/f1/m1/b1`、`audioBundle` 剩余 `gz/ls/lz` 三个低可读根层音频。

## 最新沉淀（2026-04-08 第二十二轮）
1. `DuckBundle` 木板配色族已完成第一批真实语义化 rename：`tex/wood/a..f/*` 统一收敛为 `grayWood`、`lightWood`、`redWood`、`brownWood`、`goldWood`、`yellowWood` 六组可读目录。
2. 本轮新增 `tools/semanticize-duckbundle-wood-assets.js`，可一次性同步 canonical 配置、微信开发者工具兼容配置副本、三套 `import` 元数据副本，以及 `game.js` 中的 `woodColorArr` / `singleColorArr`。
3. 当前木板族运行时命名已与 canonical 路径直接对齐，不再保留 `a/a1` 这类缩写路径；后续继续治理 `DuckBundle` 时，应优先沿用“颜色族目录 + 同名前缀叶子”的结构。
4. `run-guardrails.js` 已接入该迁移工具的语法检查，后续如果继续扩展木板或其它 bundle 的批量语义化脚本，护栏会先挡住语法层面的错误。

## 最新沉淀（2026-04-08 第二十三轮）
1. `HomeBundle` 的 `BgParticle/p1..p4` 已完成第一批真实语义化 rename，统一收敛到 `tex/backgroundParticles/` 目录。
2. 当前四个大厅背景粒子已分别定名为 `whiteGlowParticle`、`orangeGlowParticle`、`greenLeafParticle`、`orangeLeafParticle`，并同步更新 canonical 配置、开发者工具兼容配置副本与三套 `import` 元数据名。
3. 本轮暂不深改 `BgThings0..5` 主题目录，只先把已经能从原图稳定判断语义的粒子资产独立收口，避免在还没判清整套主题分层前把大厅背景结构改乱。
4. 下一批 `HomeBundle` 治理应优先围绕 `BgThings0..5` 的主题名和 `front/back/middle/last/bottom` 分层语义继续推进，保持“先定主题，再定层级叶子”的节奏。

## 最新沉淀（2026-04-08 第二十四轮）
1. `HomeBundle` 背景主题目录已完成第一批结构语义化：`tex/BgThings0..5/*` 统一收敛为 `tex/homeTheme0..5/*`。
2. 背景分层目录已从 `front/middle/back/last` 统一收敛为 `foreground/midground/background/distant`，当前配置层级已能直接表达景深语义。
3. 新增 `tools/semanticize-homebundle-assets.js`，用于统一执行 `HomeBundle` 背景目录与背景粒子的语义化迁移，避免后续继续手工替换。
4. `run-guardrails.js` 已接入该工具的语法检查，后续扩展 `HomeBundle` 叶子名语义化（如 `f1/m1/b1/l1`）时可以复用同一脚本继续迭代。

## 最新沉淀（2026-04-08 第二十五轮）
1. `HomeBundle` 背景主题叶子已完成第二批语义化：`f1..f5`、`m1..m2`、`b1..b2`、`l1` 分别收敛为 `foregroundLayer*`、`midgroundLayer*`、`backgroundLayer*`、`distantLayer1`。
2. `homeBg0..5` 与 `bottom0..5` 已分别收敛为 `themeBackground` 与 `bottomOverlay`；`雾` 已收敛为 `fogOverlay`。
3. `tools/semanticize-homebundle-assets.js` 已升级为“配置路径 + SpriteFrame 名称”双向迁移脚本，并内建旧命名残留校验，防止半迁移状态。
4. 本轮自动迁移结果：三套配置各改写 `207` 条路径，三套 `import` 各更新 `68` 个文件、改写 `72` 处 `SpriteFrame` 名称，且旧 token 扫描已清零。
5. `HomeBundle` 当前已完成“主题目录语义化 + 分层目录语义化 + 叶子命名语义化”三步闭环，后续可把治理重心平滑切换到 `uiBundle` 中文目录与短 token 清理。

## 最新沉淀（2026-04-08 第二十六轮）
1. `uiBundle` 已完成图鉴皮肤页第一批语义化：`tex/book/鸽鸽图鉴/皮肤图鉴/p1..p10` 收敛为 `tex/book/pigeonGallery/skinCollection/skinPage1..10`。
2. 对应 `SpriteFrame.name` 已同步从 `p1..p10` 收敛为 `skinPage1..skinPage10`，并在三套 import 元数据副本保持一致。
3. 新增 `tools/semanticize-uibundle-book-skin-assets.js`，用于专门治理 `uiBundle` 图鉴皮肤页编号命名；脚本内带旧 token 残留校验。
4. `run-guardrails.js` 已接入该脚本语法检查，后续继续扩展 `uiBundle` 语义化批次时可沿用同一治理模式。
5. 本轮自动迁移结果：三套配置各改写 `10` 条路径，三套 import 各更新 `4` 个文件、改写 `10` 处名称，旧路径与旧名称扫描均为 0。

## 最新沉淀（2026-04-08 第二十七轮）
1. 已确认并修复 `HomeBundle` 运行时兼容缺口：业务代码仍在请求旧路径 `tex/BgThings*/...`，而配置已语义化为 `tex/homeTheme*/...`，导致 DevTools 持续报 `Bundle HomeBundle doesn't contain ...`。
2. `boot/asset-path-normalizer.js` 新增 `applyHomeBundleLegacyPathPatch(engineModule)`，优先代理 `assetManager.loadAny/preloadAny` 做兜底路径归一化；若运行时存在 `Bundle.prototype`，再额外代理 `load/preload/loadDir/preloadDir/get`。
3. 归一化规则已覆盖 `front/f*`、`middle/m*`、`back/b*`、`last/l*`、`homeBg*`、`bottom*`、`雾`，统一映射到 `foregroundLayer*`、`midgroundLayer*`、`backgroundLayer*`、`distantLayer*`、`themeBackground`、`bottomOverlay`、`fogOverlay`。
4. `app-lifecycle.js` 已在 `application.init()` 前接入该补丁，和 root bundle 归一化、扁平目录补丁同阶段启用，确保兼容链路稳定。
5. 本轮本地校验已通过：`node -c game.js`、`node architecture/tools/run-guardrails.js`、`node architecture/tools/run-iteration-cycle.js`。

## 最新沉淀（2026-04-08 第二十八轮）
1. 运行时报错已从 `HomeBundle` 收敛到 `uiBundle` 历史路径：`tex/book/鸽鸽图鉴/皮肤图鉴/p1..p10/spriteFrame`。
2. `boot/asset-path-normalizer.js` 的旧路径兼容已扩展到 `uiBundle`，新增 `p1..p10 -> skinPage1..skinPage10` 路径归一化：`tex/book/pigeonGallery/skinCollection/skinPage*`。
3. `assetManager.loadAny/preloadAny` 的入参归一化升级为深度递归扫描（含数组与嵌套对象），并加入循环引用保护，避免不同调用形态漏网。
4. 旧路径检测同时支持 URI 解码场景，兼容 devtools 可能输出的编码路径。
5. 本轮本地校验已通过：`node -c architecture/boot/asset-path-normalizer.js`、`node -c game.js`、`node architecture/tools/run-guardrails.js`。

## 最新沉淀（2026-04-08 第二十九轮）
1. 本次故障教训已固化：语义化 rename 完成后，不能只看配置层“无旧路径”，还必须校验 `game.js` 运行时字符串是否仍引用旧路径。
2. 新增 `architecture/tools/check-legacy-runtime-compat.js`，统一执行三类防回归检查：
   - canonical 配置是否残留旧路径；
   - `game.js` 是否仍含旧路径调用；
   - 若运行时仍有旧路径，`asset-path-normalizer.js` 是否具备对应归一化逻辑与启动接入。
3. `run-guardrails.js` 已接入该检查（含语法检查 + 执行检查），后续每轮迭代会自动阻断“改名成功但运行时缺兼容”的回归。
4. 后续语义化迭代的固定流程更新为：`改配置/元数据 -> 扫描 runtime 旧路径 -> 补齐启动层归一化 -> DevTools 回归`，四步缺一不可。

## 最新沉淀（2026-04-08 第三十轮）
1. `uiBundle` 设置模块已完成首批语义化：`tex/设置/*`、`tex/设置二级/*` 收敛为 `tex/settings/*`、`tex/settingsDialog/*`，并同步更新三套配置副本。
2. 新增 `architecture/tools/semanticize-uibundle-settings-assets.js`，用于批量迁移设置路径与对应 `SpriteFrame` 名称，并内置旧路径残留校验。
3. `architecture/boot/asset-path-normalizer.js` 已新增设置模块旧路径兼容映射，运行时若仍请求 `tex/设置*` 将自动归一化到语义化目录，保持重构与稳定性并存。
4. `architecture/tools/check-legacy-runtime-compat.js` 已新增“`uiBundle` 设置模块旧路径”规则，且规则升级为 `enforceNormalizerAlways`，避免后续误删兼容逻辑。
5. 本轮新增教训：`SpriteFrame` 名称迁移不能只靠全局 token 替换，需避免跨模块同名误伤（已收紧高风险 token 替换范围）。

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
1. 继续按 `asset-readability-audit.md` 的高优先级候选逐批清理缩写资产，优先从 `DuckBundle` 木板资源群开始，保持每次只处理一组可闭环 rename。
2. 继续处理 `HomeBundle` / `uiBundle` 中“语义明确但命名语言不统一”的目录，优先从 `homeTheme0..5` 下的叶子名（`f1/m1/b1/l1`）和 `uiBundle` 的高优先级中文目录开始。
3. 在 `architecture/boot` 中继续拆分更细粒度策略模块（首屏加载资源策略、异常恢复策略）。
4. 对高频改动逻辑优先做“可维护层替换”。
