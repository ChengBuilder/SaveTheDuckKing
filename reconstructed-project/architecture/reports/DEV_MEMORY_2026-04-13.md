# SaveTheDuckKing 开发记忆（2026-04-13）

## 当前目标与状态
- 目标：项目在 Cocos Creator 可构建，导入微信开发者工具后可正常游玩主流程（拆木板拆钉子）。
- 当前状态：主流程可玩，`reconstructed-project/` 已收口为后续唯一维护入口；工程仍处于持续重构阶段（去混淆、瘦身、语义化命名进行中）。

## 当前可用运行入口
1. Cocos 构建命令：`npm run cocos:build:wechat`
2. 微信开发者工具导入目录：`build/wechatgame`
3. 项目开发根目录：`reconstructed-project/`

## 本阶段已确认
- `npm run cocos:build:wechat` 可执行并生成 `build/wechatgame`。
- `npm run guardrails` 通过。
- `npm run wechat:official:check -- --skip-cli --skip-package-check` 通过。
- 主流程资源完整性校验通过（无 import/native 缺失）。
- `DuckController.CreateWoodInformation` 已对齐到命名 helper 流程，修正 revive 木板规划中的反编译残留分支（`case 8` 漏 `break`、`37/42` 分支误写为赋值）。
- `reconstructed-project/` 与仓库根目录中的核心资产和运行时代码已完成对齐；`assets/`、`subpackages/`、`runtime/`、`source-project/runtime-modules/` 当前一致。
- 已建立新的 Creator 源目录骨架：`assets/scripts/`、`assets/audio/`、`assets/prefabs/`、`assets/scenes/`、`assets/textures/`、`assets/spine/`。
- revive 第一批语义源码已落地到 `assets/scripts/gameplay/revive/`，并新增 `source:materialize-assets` 工具从 bundle config 导出语义素材。
- revive 第一批合法语义素材已落地：`assets/audio/gameplay/revive/` 下 3 段音频。
- 木板 prefab 已完成第一轮语义化提取：`source:extract-wood-blueprints` 会产出 `assets/data/gameplay/wood/wood-prefab-blueprints.json` 和 `assets/scripts/gameplay/wood/WoodPrefabBlueprintCatalog.ts`。
- 木板蓝图已继续补全：当前 `WoodPrefabBlueprint` / `WoodPrefabBlueprintCatalog` 已包含 `nailPrefabAssetPath`、nail prefab 蓝图与可读依赖信息。
- 木板语义依赖已继续补齐：`source:extract-wood-blueprints` 现在会为 wood 补出六色 `woodSpriteDependencies` 候选，为 nail 补出 4 个 spriteFrame 依赖。
- Creator 原生木板重建入口已建立：`assets/scripts/gameplay/wood/WoodPrefabNodeFactory.ts`、`WoodPrefabRuntimeBuilder.ts`、`WoodBlueprintPreview.ts`、`WoodPrefabAuthoringHost.ts`、`WoodPrefabGalleryAuthoring.ts` 已可基于蓝图创建木板节点树并在 Creator 中预览/作者化。
- `source:generate-wood-prefabs` 已落地，当前会从木板蓝图生成四个正式 Creator `wood prefab`：`wood2`、`wood11`、`wood37`、`wood42`。
- `assets/scenes/WoodGallery.scene` 已继续扩成“木板画廊 + revive 可玩切片”实验场景；即使没有接上真实贴图，也能通过占位矩形/钉子圆点直接看见木板版型与 revive 动效链。
- `assets/scripts/gameplay/revive/RevivePlayableSlice.ts` 已落地，当前已把 revive 木板规划、wood prefab 实例化、钉子飞入槽位这一小段玩法接入 Creator 原生场景。
- `assets/scripts/gameplay/revive/ReviveSemanticAudio.ts` 已落地，当前通过 main bundle 语义路径加载 `woodAssembleLead / woodAssembleFollow / woodCollision`，避免 revive 音效继续回到旧 runtime 找入口。
- `assets/scripts/gameplay/revive/ShowcaseChromeAuthoring.ts` 已落地，当前给 `WoodGallery.scene` / `Game.scene` 的迁移样板场景补展示标题、说明和引导文案。
- `assets/scripts/gameplay/wood/WoodSemanticVisuals.ts` 已落地，当前负责把木板和 revive nail 的语义视觉绑定到 Creator 节点；wood 会优先尝试加载 `assets/textures/gameplay/wood/` 下的语义贴图，找不到时再回退到旧 `DuckBundle`。
- `assets/textures/gameplay/wood/grayWood/` 当前已落地 `grayWood2`、`grayWood11`、`grayWood37`、`grayWood42` 四张第一批可直接导入 Creator 的木板纹理。
- `RevivePlayableSlice` 本轮已对齐到旧 runtime 的核心节奏：木板按 `0.05s` 错峰弹入、embedded nails 延迟显露、revive nails 按 `0.1 + 0.1n` 错峰飞入槽位并旋转退场。
- `RevivePlayableSlice` 本轮继续补上了 Creator 原生基础音效：第一块木板入场播放 `woodAssembleLead`，第一枚 revive nail 飞入时播放 `woodAssembleFollow`，木板落位后播放 `woodCollision`。
- `assets/scenes/Game.scene` 已落地为第一版正式玩法骨架，当前先固定 `GameplayRoot / BoardRoot / ReviveSliceHost / FXRoot / UIRoot / DebugRoot` 分层，并把 revive 切片正式接入这条场景链。
- `assets/scenes/WoodGallery.scene` / `assets/scenes/Game.scene` 本轮都已挂上 `ShowcaseChromeAuthoring`，打开场景时不再只是裸节点层。
- 已确认旧 bundle 直接导出的 `wood*.prefab` 不是合法 Creator 源 prefab；正确路线是“旧 prefab -> 语义蓝图 -> 作者化 prefab -> 最终可编辑 prefab”。
- `assets/scene/LoadScene.scene` 的 4 个历史缺失引用已清理；最新 Creator 构建日志中不再出现这些缺失 UUID 警告。
- 最新 Creator 构建日志里，`WoodPrefabAuthoringHost` 与 `RevivePlayableSlice` 已能正常注册，不再出现当前迁移新增组件的 `Missing class` 报错。
- 最新 Creator 构建日志里，`ShowcaseChromeAuthoring` 也已完成注册，不再需要手工担心新场景展示组件的 `Missing class`。
- 最新 Creator 构建日志里，`Game.scene` 已被正式收进场景列表，说明新的玩法骨架场景已被 Cocos 资产系统接受。
- 本地 `cocoscreator` MCP 已连通：`codex` 配置指向 `http://127.0.0.1:3000/mcp`，并已成功调用 `scene_get_scene_list`、`scene_open_scene`、`assetAdvanced_validate_asset_references`。

## 重要说明
- `reconstructed-project/` 不再是“重建中间产物”，而是当前唯一维护的源工程。
- 运行、联调、继续重构，均优先使用 `reconstructed-project/` + `build/wechatgame`。
- `source-project/runtime-modules/` 是唯一运行时代码编辑区，不再维护 `source/` 镜像、`assets-restored/` 参考树和其他旧重建报告。
- `source-project/runtime-modules/` 现在是 runtime 过渡翻译层；新的语义化逻辑应优先落到 `assets/scripts/`。
- `build-cocos-wechat-runtime.js` 已调整为只同步 runtime 所需的 `assets/internal`、`assets/start-scene` 等兼容目录，避免把新的 Creator 源资产原样拷进微信包体。
- `build-cocos-wechat-runtime.js` 已继续放宽 Creator 非零状态的容错：在 `build/wechatgame` 已生成时，常见的 35/36/37 网络/登录类返回码不再中断脚本。
- `source:materialize-assets` 现阶段只导出合法的直接素材（如音频）；旧 prefab 序列化不会再被当作 Creator 源资产复制进 `assets/prefabs/`。
- `source:materialize-assets` 本轮已增加 `imageAsset` 导出能力，后续可以继续把首批直接贴图安全落到 `assets/textures/` 语义目录。
- Creator 仍可能返回状态码 `36`，但当前已不再是 `LoadScene` 缺失引用或 `WoodGallery.scene` 缺类导致；最新日志里主要剩网络/登录接口超时噪声，现阶段构建产物 `build/wechatgame` 仍稳定可生成。
- Creator 资产体系中的 `.meta` / `.scene` / `.prefab` 保留 `uuid` 属正常现象；当前真正需要避免的是继续依赖旧 bundle 的 `uuid / pack / hash` 当长期维护入口。
- 当前 `assets/prefabs/gameplay/wood/*.prefab` 属于第一阶段“作者化 prefab”：它们已经是正式 Creator prefab，但内部木板节点树仍由 `WoodPrefabAuthoringHost` 生成，还不是最终静态 prefab。
- 当前 Creator 侧验证可以同时走两条链：CLI 构建日志 + 本地 MCP 场景/资产校验；后续新增 scene/prefab 优先两边都过一遍。
- MiniGameTest 自动化脚本已接入，但本机若未提供官方 SDK tgz，则无法执行用例。

## 当前坑点 / 风险
1. 当前 revive 切片已经能在 Creator 原生场景里跑，并补进了基础音效和展示层，但视觉上仍有大量占位渲染；和原游戏效果差距主要在真实贴图覆盖率、阴影、高光、粒子和更细的节奏还原。
2. `Game.scene` 虽然已经建立正式玩法骨架，但它当前仍只接进 revive 切片，还没有接入真正的玩法控制器、UI 和结果流转。
3. `WoodGallery.scene` 目前仍是迁移实验场景，不是正式启动入口；默认构建仍从 `assets/scene/LoadScene.scene` 起。
4. 这轮确认了一个关键坑：Cocos 自定义脚本类的短 UUID 压缩规则不能错，错误规则会直接导致 prefab/scene 中的脚本组件 `Missing class`。
5. 主玩法的大量真实逻辑仍在 `assets/start-scene/index.start-scene.js` / `source-project/runtime-modules/`，新的 Creator 场景现在只接进了一段 revive 切片。

## MiniGameTest 自动化测试使用说明
1. 将 `mini_game_test-*.tgz` 放到：`wechat-test/minigametest/vendor/`
2. 环境检查：`npm run wechat:test:doctor`
3. 执行测试：`npm run wechat:test:run`
4. 可选环境变量：
   - `WECHAT_DEVTOOLS_CLI`
   - `WECHAT_DEVTOOLS_SERVICE_PORT`
   - `WECHAT_MINIGAME_TEST_PORT`
   - `WECHAT_MINIGAME_TEST_CASE`
   - `WECHAT_MINIGAME_TEST_SDK_TGZ`

## 下阶段优先级（建议）
1. 优先把 revive 切片里的木板、钉子和阴影继续替换成真实 sprite 资产，把当前“有真实语义资产但仍会 fallback 占位”的状态收成接近原游戏观感。
2. 把 `Game.scene` 里的 `BoardRoot / UIRoot / FXRoot / DebugRoot` 接上真正的玩法控制器、UI 和特效层，让它逐步取代纯实验场景。
3. 把 `wood prefab` 从当前作者化 prefab 继续收束为更静态、更接近最终成品的可编辑 prefab。
4. 继续把 revive 切片从 `source-project/runtime-modules` 翻到 `assets/scripts` + `assets/data` + `assets/audio` + `assets/prefabs` 的 Creator 源结构。
5. runtime 模块主流程去混淆：优先 `game`、`application-main`、`subpackages/main`。
6. 继续定位 Creator 返回码 `36` 的剩余来源，争取把 CLI 构建状态也压到 `0`。
7. 建立“构建 -> 结构校验 -> 自动化用例”的单命令流水线。
8. 预留微信登录与广告 SDK 接入位（接口层先行，不引入复杂兼容层）。

## 回滚策略
- 已使用 git 管理，重构策略为“做减法 + 小步提交 + 可回滚”。
- 若出现运行异常，优先回退到上一个“可构建可玩”提交点。
