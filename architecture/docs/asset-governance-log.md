# 素材治理记录

## 2026-04-08 `audioBundle` 第一批语义化 rename

本轮目标不是“重建 Cocos 编译产物”，而是在保证微信小游戏继续稳定运行的前提下，把最确定的一批平铺音频路径收敛成可读目录结构。

本轮已落地的 canonical 路径：
- `fruit_click` 收敛为 `fruitGame/fruitClick`
- `colide` 收敛为 `duckGame/woodCollision`
- `colliderStone` 收敛为 `duckGame/stoneCollision`
- `nailPop` 收敛为 `duckGame/nailPop`
- `breakDoor` 收敛为 `duckGame/cageBreak`
- `winDuck` 收敛为 `duckGame/duckVictory`
- `colorBgm` 收敛为 `bgm/pureColor`
- `showGame2` 收敛为 `sceneTransition/fruitGameReveal`
- `qt` 收敛为 `ui/powerConsume`

## 2026-04-08 `audioBundle` 第二批语义化 rename

本轮继续沿用“先稳定运行、再逐批语义化”的策略，只处理已经能从代码用途或成对命名关系稳定判断的音频。

本轮新增落地的 canonical 路径：
- `p1` 收敛为 `duckGame/woodAssembleLead`
- `p2` 收敛为 `duckGame/woodAssembleFollow`
- `plateUnlock` 收敛为 `fruitGame/plateUnlock`
- `showGame` 收敛为 `sceneTransition/duckGameReveal`

本轮新增治理基础设施：
- 新增 `architecture/tools/generate-audio-usage-audit.js`
- 新增 `architecture/docs/audio-usage-audit.md`
- 迭代流水线已接入音频使用审计，后续每轮都会自动刷新直接引用、动态前缀引用和未引用候选

本轮暂缓处理的遗留项：
- `adz`
- `bdz`
- `ls`
- `lz`

暂缓原因：
- 这些名字虽然明显不规范，但当前仅靠压缩产物上下文还不能稳定判断真实语义。
- 在没有百分百把握前，先不做硬改，避免把项目重新改回白屏或卡启动。

治理原则：
- 运行时不维护映射表。
- canonical 名字一旦确认，直接改配置、改引用、改元数据。
- `import/`、`native/` 下的 UUID 编译产物文件名暂不硬改；后续只有在确认完整重建链路后，才继续推进。

## 2026-04-08 `audioBundle` 第三批语义化 rename

本轮继续清理“虽然不是乱码，但还停留在 bundle 根层、分层不清晰”的高频音效，并把音频审计升级为能直接暴露根层候选。

本轮新增落地的 canonical 路径：
- `click` 收敛为 `ui/buttonClick`
- `getDuck` 收敛为 `ui/duckUnlock`
- `success1` 收敛为 `ui/levelComplete`
- `lose` 收敛为 `ui/failureStinger`
- `warning` 收敛为 `ui/warningPrompt`
- `success` 收敛为 `ui/victoryStinger`
- `ribbon` 收敛为 `ui/ribbonBurst`
- `full` 收敛为 `fruitGame/slotFull`
- `duck` 收敛为 `duckGame/duckQuack`
- `error` 收敛为 `duckGame/errorPrompt`
- `duckDrop` 收敛为 `sceneTransition/duckDrop`

本轮新增治理基础设施：
- `architecture/tools/generate-audio-usage-audit.js` 新增“根层路径候选”统计
- `architecture/docs/audio-usage-audit.md` 现在会直接列出仍停留在根层的 canonical 路径，便于逐批继续收敛

本轮确认的剩余根层候选：
- `clap`
- `fail`
- `win`
- `fly`
- `door`
- `pop`
- `over`
- `levelup`
- `show`
- `bgm`

本轮仍暂缓的低可读遗留项：
- `adz`
- `bdz`
- `ls`
- `lz`
- `gz`

暂缓原因：
- `clap/fail/win/fly/door/pop/over/levelup/show/bgm` 已能被报告稳定识别，但还缺少足够场景语义，不急于硬改。
- `adz/bdz/ls/lz/gz` 依旧属于明确低可读命名，但当前没有新的运行时证据可以支持安全命名。

## 2026-04-08 `audioBundle` 第四批语义化 rename

本轮在第三批审计结果基础上，继续清理最稳的根层高频音效，目标是优先消掉“已经有明确播放语义”的根层路径。

本轮新增落地的 canonical 路径：
- `bgm` 收敛为 `bgm/defaultGameplay`
- `fail` 收敛为 `ui/failurePrompt`
- `clap` 收敛为 `ui/applause`

本轮选择依据：
- `bgm` 在大厅、鸭子主玩法和部分恢复流程中作为默认主背景音乐反复直接调用，已可稳定判断为主循环背景乐。
- `fail` 在鸭子玩法和水果玩法的失败反馈里都会配合红闪提示触发，属于通用失败提示音。
- `clap` 仅在一次击打命中特效回调中触发，语义已经收敛为鼓掌/喝彩反馈音。

## 2026-04-08 `resources` 第一批语义化 rename

本轮先收敛最稳的一组共享特效资源，只处理已经能从视觉和运行时调用同时确认语义的彩带序列。

本轮新增落地的 canonical 路径：
- `彩带/cd1` 收敛为 `ribbonBurst/ribbon1`
- `彩带/cd2` 收敛为 `ribbonBurst/ribbon2`
- `彩带/cd3` 收敛为 `ribbonBurst/ribbon3`
- `彩带/cd4` 收敛为 `ribbonBurst/ribbon4`
- `彩带/cd5` 收敛为 `ribbonBurst/ribbon5`
- `彩带/cd6` 收敛为 `ribbonBurst/ribbon6`
- `彩带/cd7` 收敛为 `ribbonBurst/ribbon7`

本轮同步调整：
- `SpriteFrame` 名从 `cd1..7` 统一改为 `ribbon1..7`
- `game.js` 中的 `getSpriteFrame("cd"+...)` 已同步改为 `getSpriteFrame("ribbon"+...)`

本轮选择依据：
- 运行时 `playRibbonAni` 的直接调用语义已经明确指向结算彩带特效。
- 对应 atlas 视觉上就是一组彩带碎片，适合直接收敛到 `ribbonBurst/` 目录。

## 2026-04-08 `resources` 第二批语义化 rename

本轮继续清理 `resources` 分包中最零散、最难读的一批共享特效资源，把中文目录、缩写目录和语义不清的资产名一起收敛到稳定结构。

本轮新增落地的 canonical 路径：
- `粒子/lz` 收敛为 `particleEffects/colorMarkerParticle`
- `lz/xg1..14` 收敛为 `particleEffects/colorMarker1..14`
- `粒子/circle` 收敛为 `particleEffects/deletePulseCircle`
- `粒子/fragment` 收敛为 `particleEffects/fragmentShard`
- `multTextures/Mult-material` 收敛为 `multiTexture/multiTextureMaterial`
- `multTextures/Mult-effect` 收敛为 `multiTexture/multiTextureEffect`
- `DuckJson` 收敛为 `duck/duckLevelTemplates`

本轮同步调整：
- `game.js` 中的 `getPrefab("lz")` 已同步改为 `getPrefab("colorMarkerParticle")`
- `game.js` 中的 `getSpriteFrame("xg"+...)` 与 `getSpriteFrame("xg2")` 已同步改为 `colorMarker` 语义名
- `game.js` 中的 `getPrefab("circle")`、`getPrefab("fragment")`、`getJsonAsset("DuckJson")`、`f.load("multTextures/Mult-material")` 已全部同步改名
- canonical bundle 配置、微信开发者工具兼容配置副本、对应 import 元数据已全部同步

本轮选择依据：
- `DeleteCircle` 贴图名与运行时着色逻辑共同表明 `circle` 是删除/命中脉冲圈特效。
- `fragmentEffect()` 的上下文明确表明 `fragment` 是带刚体下落的碎片 prefab。
- `xg1..14` atlas 经过原图核对后，确认是一组按颜色区分的小型高亮粒子，不再保留 `lz/xg` 这类无语义缩写。
- `MultTextures` 模块会直接 `resources.load()` 这组材质与 effect，属于共享渲染基础设施，适合收敛为 `multiTexture/` 目录。

## 2026-04-08 `DuckBundle` 木板配色族第一批语义化 rename

本轮优先处理 `asset-readability-audit` 里最密集、且运行时语义最稳定的一组缩写资源，只收敛木板“配色族目录 + 同名前缀叶子”这一层，不冒进猜测每一块木板图案的细粒度含义。

本轮新增落地的 canonical 路径：
- `tex/wood/a/a1..a43` 收敛为 `tex/wood/grayWood/grayWood1..grayWood43`
- `tex/wood/b/b1..b43` 收敛为 `tex/wood/lightWood/lightWood1..lightWood43`
- `tex/wood/c/c1..c43` 收敛为 `tex/wood/redWood/redWood1..redWood43`
- `tex/wood/d/d1..d43` 收敛为 `tex/wood/brownWood/brownWood1..brownWood43`
- `tex/wood/e/e1..e43` 收敛为 `tex/wood/goldWood/goldWood1..goldWood43`
- `tex/wood/f/f1..f43` 收敛为 `tex/wood/yellowWood/yellowWood1..yellowWood43`

本轮同步调整：
- `subpackages/DuckBundle/config.duck-bundle.json`
- `assets/duckbundle/config.json`
- `assets/DuckBundlebundle/config.json`
- `subpackages/DuckBundle/import/*` 中 258 个木板 `SpriteFrame` 元数据名
- `assets/duckbundle/import/*` 与 `assets/DuckBundlebundle/import/*` 中对应兼容副本
- `game.js` 中的 `woodColorArr` 与 `singleColorArr`

本轮新增治理基础设施：
- 新增 `architecture/tools/semanticize-duckbundle-wood-assets.js`
- `architecture/tools/run-guardrails.js` 已接入该工具的语法检查

本轮选择依据：
- `Wood.initWood()` 的运行时路径拼接已经稳定表明 `a..f` 是“木板配色族”，不是随机 UUID 片段。
- 通过抽样核对原图后，六组配色可稳定判定为灰木、浅木、红木、棕木、金木、亮黄木六类。
- 叶子资源统一收敛为 `grayWood1` 这类“目录名即前缀名”的结构，便于后续继续细化，但不引入额外映射层。

## 2026-04-08 `HomeBundle` 背景粒子第一批语义化 rename

本轮只处理 `HomeBundle` 里最容易判清语义、且完全不依赖运行时代码字符串的一组大厅背景粒子，先把粒子目录独立收口，再继续拆更复杂的主题背景层。

本轮新增落地的 canonical 路径：
- `tex/BgParticle/p1` 收敛为 `tex/backgroundParticles/whiteGlowParticle`
- `tex/BgParticle/p2` 收敛为 `tex/backgroundParticles/orangeGlowParticle`
- `tex/BgParticle/p3` 收敛为 `tex/backgroundParticles/greenLeafParticle`
- `tex/BgParticle/p4` 收敛为 `tex/backgroundParticles/orangeLeafParticle`

本轮同步调整：
- `subpackages/HomeBundle/config.home-bundle.json`
- `assets/homebundle/config.json`
- `assets/HomeBundlebundle/config.json`
- 三套 `import` 元数据副本中的四个对应 `SpriteFrame` 名

本轮选择依据：
- `p3` 与 `p4` 经过原图核对后，已能稳定确认分别是绿色叶片粒子与橙色叶片粒子。
- `p1` 与 `p2` 虽然尺寸小，但原图已经足以判断为两类背景发光粒子，用 `whiteGlowParticle` / `orangeGlowParticle` 这类中性语义名更稳妥。
- 这四个资产当前只在 `HomeBundle` 内部以资源路径和元数据名存在，没有额外运行时代码直连字符串，因此先收敛这一层风险最低。

## 2026-04-08 `HomeBundle` 背景主题目录第一批语义化 rename

本轮继续沿用“先目录语义化、后叶子细化”的治理节奏，只收敛主题目录与分层目录，不在同一批里同时硬改 `f1/m1/b1/l1` 叶子名，确保每次改动都可快速回归验证。

本轮新增落地的 canonical 路径规则：
- `tex/BgThings0..5/*` 收敛为 `tex/homeTheme0..5/*`
- `front` 收敛为 `foreground`
- `middle` 收敛为 `midground`
- `back` 收敛为 `background`
- `last` 收敛为 `distant`

本轮同步调整：
- `subpackages/HomeBundle/config.home-bundle.json`
- `assets/homebundle/config.json`
- `assets/HomeBundlebundle/config.json`

本轮新增治理基础设施：
- 新增 `architecture/tools/semanticize-homebundle-assets.js`，统一治理 `HomeBundle` 的背景主题目录与背景粒子目录
- `architecture/tools/run-guardrails.js` 已接入该脚本语法检查

本轮选择依据：
- 当前 `BgThings0..5` 与 `front/middle/back/last` 是 `HomeBundle` 最大规模的目录噪声来源，且纯配置路径改名不会直接引入运行时字符串依赖风险。
- 先把主题和层级语义补齐后，再处理 `f1/m1/b1/l1` 这类叶子名时，重命名边界会更清晰，出错面也更小。

## 2026-04-08 `HomeBundle` 背景主题叶子第二批语义化 rename

本轮在主题目录语义化完成后，继续处理 `homeTheme*` 下可稳定判定的一组短叶子命名，目标是彻底移除 `f/m/b/l`、`homeBg*`、`bottom*` 与中文单字目录残留。

本轮新增落地的 canonical 路径规则：
- `tex/homeTheme*/foreground/f1..f5` 收敛为 `tex/homeTheme*/foreground/foregroundLayer1..5`
- `tex/homeTheme*/midground/m1..m2` 收敛为 `tex/homeTheme*/midground/midgroundLayer1..2`
- `tex/homeTheme*/background/b1..b2` 收敛为 `tex/homeTheme*/background/backgroundLayer1..2`
- `tex/homeTheme*/distant/l1` 收敛为 `tex/homeTheme*/distant/distantLayer1`
- `tex/homeTheme*/homeBg0..5` 收敛为 `tex/homeTheme*/themeBackground`
- `tex/homeTheme*/bottom0..5` 收敛为 `tex/homeTheme*/bottomOverlay`
- `tex/homeTheme*/雾` 收敛为 `tex/homeTheme*/fogOverlay`

本轮同步调整：
- `subpackages/HomeBundle/config.home-bundle.json`
- `assets/homebundle/config.json`
- `assets/HomeBundlebundle/config.json`
- 三套 `import` 元数据中的 `SpriteFrame.name`：
  - `f1..f5 -> foregroundLayer1..5`
  - `m1..m2 -> midgroundLayer1..2`
  - `b1..b2 -> backgroundLayer1..2`
  - `l1 -> distantLayer1`
  - `homeBg0..5 -> themeBackground`
  - `bottom0..5 -> bottomOverlay`
  - `雾 -> fogOverlay`

本轮新增治理基础设施：
- `architecture/tools/semanticize-homebundle-assets.js` 已扩展为“路径 + SpriteFrame 名称”双向语义化工具
- 脚本内新增旧命名残留校验，确保迁移后不再残留上述短 token

本轮结果摘要：
- 三套配置共完成路径改写 `621` 次（每套 `207`）
- 三套 `import` 共更新文件 `204` 个（每套 `68`）
- 三套 `import` 共完成名称改写 `216` 次（每套 `72`）

## 2026-04-09 `main` 复用书册展示图集第一批语义化 rename

本轮不再新增任何运行时兼容，而是直接收敛主包里几组仍沿用解包名的复用图集元数据，让 `main` 与 `uiBundle` 使用同一套 canonical 命名。

本轮新增落地的 canonical 名称：
- `banner__pack_11`：`p10/p9/p6` 收敛为 `skinPage10/skinPage9/skinPage6`
- `banner__pack_11`：`鸽鸽图鉴` 收敛为 `titleBanner`
- `banner__pack_11`：`视频2` 收敛为 `videoBadge`
- `banner__pack_11`：`旋转光` 收敛为 `rotatingGlow`
- `callFriend__pack_18`：`鸽鸽图鉴` 收敛为 `titleBanner`
- `callFriend__pack_18`：`图鉴` 收敛为 `collectionTitle`
- `bottom__pack_15`：`p8/p1` 收敛为 `skinPage8/skinPage1`
- `bottom__pack_15`：`底2/框/底` 收敛为 `pillBase/selectionHalo/infoBarBase`
- `bottom__pack_15`：`领取按钮/已领取按钮` 收敛为 `claimButton/claimedButton`
- `share__pack_11`：`p2/p3/p4/p5` 收敛为 `skinPage2/skinPage3/skinPage4/skinPage5`
- `bottom__pack_17`：`p7` 收敛为 `skinPage7`

本轮同步调整：
- 新增 `architecture/tools/semanticize-main-book-display-assets.js`
- `subpackages/main/import/_packs/pack/banner__pack_11.json`
- `subpackages/main/import/_packs/pack/callFriend__pack_18.json`
- `subpackages/main/import/_packs/pack/bottom__pack_15.json`
- `subpackages/main/import/_packs/pack/share__pack_11.json`
- `subpackages/main/import/_packs/pack/bottom__pack_17.json`
- `architecture/tools/check-legacy-runtime-compat.js`
- `architecture/tools/run-guardrails.js`

本轮选择依据：
- 这些 pack 与 `uiBundle` 中已治理完成的图集共享同一 `_textureSource`，能够一一对应到既有 canonical 名称。
- 这批改动仅触及 source-of-truth 元数据，不引入新的 alias、镜像或补丁，更符合当前“删兼容、做正构”的目标。

## 2026-04-08 `uiBundle` 图鉴皮肤页第一批语义化 rename

本轮先处理 `uiBundle` 中最集中、语义边界最明确的一组短 token：`book/鸽鸽图鉴/皮肤图鉴/p1..p10`。这批资源全部用于图鉴皮肤页，不依赖运行时映射，适合低风险先收口。

本轮新增落地的 canonical 路径规则：
- `tex/book/鸽鸽图鉴/皮肤图鉴/p1..p10`
- 收敛为 `tex/book/pigeonGallery/skinCollection/skinPage1..10`

本轮同步调整：
- `subpackages/uiBundle/config.ui-bundle.json`
- `assets/uibundle/config.json`
- `assets/uiBundlebundle/config.json`
- 三套 `import` 元数据中对应 `SpriteFrame.name`
  - `p1..p10 -> skinPage1..skinPage10`

本轮新增治理基础设施：
- 新增 `architecture/tools/semanticize-uibundle-book-skin-assets.js`
- `architecture/tools/run-guardrails.js` 已接入该脚本语法检查

本轮结果摘要：
- 三套配置共完成路径改写 `30` 次（每套 `10`）
- 三套 `import` 共更新文件 `12` 个（每套 `4`）
- 三套 `import` 共完成名称改写 `30` 次（每套 `10`）

## 2026-04-08 `HomeBundle` 旧路径运行时兼容补丁

本轮问题定位：
- `HomeBundle` 配置已语义化为 `tex/homeTheme*/...`，但运行时代码仍在请求历史路径 `tex/BgThings*/...`。
- 微信开发者工具中表现为持续报错：`Bundle HomeBundle doesn't contain tex/BgThings*/.../spriteFrame`。
- 该错误会在首页背景更新流程内重复触发，导致日志刷屏与加载稳定性下降。

本轮治理策略：
- 不回退语义化 rename 结果，不恢复旧命名配置。
- 在启动层增加“仅 HomeBundle 生效”的运行时入参归一化，保持业务逻辑与语义化资产命名解耦。
- 兼容补丁放在 `architecture/boot/asset-path-normalizer.js`，与现有 root bundle/扁平目录补丁同一治理层维护。

本轮新增能力：
- 新增 `applyHomeBundleLegacyPathPatch(engineModule)`。
- 优先代理 `assetManager.loadAny/preloadAny` 作为稳定入口兜底归一化；若运行时存在 `Bundle.prototype`，再额外代理 `load/preload/loadDir/preloadDir/get`。
- 对于缺失 `options.bundle` 的历史调用，只要请求命中 `tex/BgThings{N}/...` 也会触发路径归一化。
- 路径规则：
  - `tex/BgThings{N}/front/f{K}` -> `tex/homeTheme{N}/foreground/foregroundLayer{K}`
  - `tex/BgThings{N}/middle/m{K}` -> `tex/homeTheme{N}/midground/midgroundLayer{K}`
  - `tex/BgThings{N}/back/b{K}` -> `tex/homeTheme{N}/background/backgroundLayer{K}`
  - `tex/BgThings{N}/last/l{K}` -> `tex/homeTheme{N}/distant/distantLayer{K}`
  - `tex/BgThings{N}/homeBg*` -> `tex/homeTheme{N}/themeBackground`
  - `tex/BgThings{N}/bottom*` -> `tex/homeTheme{N}/bottomOverlay`
  - `tex/BgThings{N}/雾` -> `tex/homeTheme{N}/fogOverlay`

本轮同步调整：
- `architecture/boot/asset-path-normalizer.js`
- `architecture/boot/app-lifecycle.js`

本轮验证：
- `node -c architecture/boot/asset-path-normalizer.js`
- `node -c architecture/boot/app-lifecycle.js`
- `node -c game.js`
- `node architecture/tools/run-guardrails.js`
- `node architecture/tools/run-iteration-cycle.js`

## 2026-04-08 `uiBundle` 图鉴旧路径运行时兼容补丁

本轮问题定位：
- `uiBundle` 图鉴皮肤页路径已语义化为 `tex/book/pigeonGallery/skinCollection/skinPage*`。
- 运行时仍在请求历史路径 `tex/book/鸽鸽图鉴/皮肤图鉴/p1..p10/spriteFrame`，导致打开手册时持续报 `Bundle uiBundle doesn't contain ...`。

本轮治理策略：
- 不回退 `uiBundle` 语义化 rename 结果。
- 沿用启动层路径归一化策略，继续在 `asset-path-normalizer.js` 扩展兼容规则，不改压缩业务主干。

本轮新增能力：
- `normalizeLegacyBundleRequestInput()` 已扩展为同时处理 `HomeBundle + uiBundle` 历史路径。
- 新增 `uiBundle` 路径规则：
  - `tex/book/鸽鸽图鉴/皮肤图鉴/p{1..10}` -> `tex/book/pigeonGallery/skinCollection/skinPage{1..10}`
- `assetManager.loadAny/preloadAny` 参数归一化升级为深度递归扫描（支持数组、嵌套对象），并加入循环引用保护。
- 路径识别支持 URI 安全解码，兼容编码后的中文目录路径。

本轮同步调整：
- `architecture/boot/asset-path-normalizer.js`

本轮验证：
- `node -c architecture/boot/asset-path-normalizer.js`
- `node -c game.js`
- `node architecture/tools/run-guardrails.js`

## 2026-04-08 旧路径兼容防回归护栏（教训固化）

本轮教训：
- 仅依赖“配置文件已无旧路径”不足以保证运行稳定，压缩产物 `game.js` 仍可能保留历史字符串路径。
- 若缺少运行时兼容层，语义化命名会在真实设备/DevTools 中触发 `Bundle doesn't contain ...`。

本轮新增治理基础设施：
- 新增 `architecture/tools/check-legacy-runtime-compat.js`，自动校验：
  - canonical 配置是否残留旧路径；
  - `game.js` 是否仍含旧路径调用；
  - 当运行时仍有旧路径时，`asset-path-normalizer.js` 是否存在对应归一化逻辑与启动接入。
- `architecture/tools/run-guardrails.js` 已接入该脚本（语法 + 执行双检查）。

本轮流程规范升级：
- 语义化改名后必须执行固定四步：
  1. 改配置/改 import 元数据；
  2. 扫描 `game.js` 运行时旧路径；
  3. 补齐 `asset-path-normalizer.js` 启动层兼容；
  4. DevTools 关键场景回归（至少覆盖首页、手册、场景切换）。

## 2026-04-08 `uiBundle` 设置模块语义化与兼容补丁

本轮治理目标：
- 把 `uiBundle` 设置相关中文路径从 `tex/设置/*`、`tex/设置二级/*` 收敛到可读英文目录；
- 同时保留运行时旧路径兼容，避免“配置改名成功但运行时报错”。

本轮新增落地的 canonical 路径规则：
- `tex/设置/* -> tex/settings/*`
- `tex/设置二级/* -> tex/settingsDialog/*`

本轮同步调整：
- `subpackages/uiBundle/config.ui-bundle.json`
- `assets/uibundle/config.json`
- `assets/uiBundlebundle/config.json`
- 三套 `import` 元数据副本中的设置资产 `SpriteFrame` 名称
- `architecture/boot/asset-path-normalizer.js`（新增设置模块旧路径归一化）

本轮新增治理基础设施：
- 新增 `architecture/tools/semanticize-uibundle-settings-assets.js`
- `architecture/tools/run-guardrails.js` 新增该脚本语法检查
- `architecture/tools/check-legacy-runtime-compat.js` 新增“设置模块旧路径”规则，并启用 `enforceNormalizerAlways`

本轮经验补丁：
- 已收紧高风险同名 token 替换（避免跨模块误伤 `返回主页`、`%` 这类通用名称）。
- 后续若继续做 `SpriteFrame` 批量改名，优先采用“路径域 + token”双重约束，不做纯全局 token 替换。

## 2026-04-09 停止新增运行时兼容，切换到源头重构

本轮策略切换：
- 不再新增任何玩法层、Home/ui 层运行时兼容补丁。
- 已经证明“语义化后再靠 boot/runtime 兜底”会让工程持续背着历史债，和正规项目目标相冲突。
- 后续所有旧路径报错，统一回到 `game.js`、bundle config、import 元数据源头修复。

本轮已固化的新规则：
- `architecture/memory/project-memory.md` 明确禁止新增运行时兼容补丁、镜像兜底、legacy alias。
- `architecture/docs/project-structure.md` 与 `architecture/docs/wechat-official-project-guide.md` 已同步改成“旧路径源头消除”策略。
- `architecture/tools/check-legacy-runtime-compat.js` 继续作为反回退护栏，后续会优先拦截旧路径字符串重新进入 `game.js` 或 bundle config。

本轮已直接改到源头的 canonical 路径：
- `tex/book/分享鸭/* -> tex/book/shareCollection/*`
- `tex/book/大胃王鸭/* -> tex/book/bigEaterCollection/*`
- `tex/book/水果鸭/* -> tex/book/fruitCollection/*`
- `tex/book/特殊图鉴/* -> tex/book/specialCollection/*`
- `tex/领取按钮/spriteFrame -> tex/rewardActions/claimButton/spriteFrame`
- `tex/已领取按钮/spriteFrame -> tex/rewardActions/claimedButton/spriteFrame`

本轮对历史策略的处理原则：
- 历史日志保留事实，不篡改过去。
- 但从本条开始，旧条目中涉及的“运行时兼容”只作为阶段性过渡记录，不再作为当前推荐做法。

## 2026-04-09 继续源头收敛书册展示资源命名

本轮继续直接修 bundle 配置与 import 元数据，不再给图鉴展示资源补运行时别名。

本轮新增 canonical 命名：
- `tex/book/tex/全部/spriteFrame -> tex/book/ui/filterAll/spriteFrame`
- `tex/book/tex/100/spriteFrame -> tex/book/ui/completion100Label/spriteFrame`
- `tex/book/tex/标签/spriteFrame -> tex/book/ui/itemBadge/spriteFrame`
- `tex/book/tex/底/spriteFrame -> tex/book/ui/panelBackground/spriteFrame`
- `tex/book/tex/框2/spriteFrame -> tex/book/ui/itemCardInactiveFrame/spriteFrame`
- `tex/book/tex/特殊/spriteFrame -> tex/book/ui/filterSpecial/spriteFrame`
- `tex/book/tex/图鉴/spriteFrame -> tex/book/ui/collectionTitle/spriteFrame`
- `tex/book/tex/框1/spriteFrame -> tex/book/ui/itemCardActiveFrame/spriteFrame`
- `tex/book/tex/使用中/spriteFrame -> tex/book/ui/equippedBadge/spriteFrame`
- `tex/book/tex/旋转光/spriteFrame -> tex/book/ui/rotatingGlow/spriteFrame`
- `tex/book/tex/NO/spriteFrame -> tex/book/ui/numberPrefix/spriteFrame`
- `tex/book/tex/稀有/spriteFrame -> tex/book/ui/filterRare/spriteFrame`
- `tex/book/tex/已收集/spriteFrame -> tex/book/ui/collectedLabel/spriteFrame`
- `tex/book/tex/条2/spriteFrame -> tex/book/ui/progressTrack/spriteFrame`
- `tex/book/tex/条1/spriteFrame -> tex/book/ui/progressFill/spriteFrame`
- `tex/book/鸽鸽图鉴/视频/* -> tex/book/ui/videoBadge/*`
- `tex/book/鸽鸽图鉴/底2/spriteFrame -> tex/book/ui/pillBase/spriteFrame`
- `tex/book/鸽鸽图鉴/框/spriteFrame -> tex/book/ui/selectionHalo/spriteFrame`
- `tex/book/鸽鸽图鉴/底/spriteFrame -> tex/book/ui/infoBarBase/spriteFrame`
- `tex/book/鸽鸽图鉴/鸽鸽图鉴/spriteFrame -> tex/book/pigeonGallery/titleBanner/spriteFrame`

本轮沉淀的治理手段：
- 新增 `architecture/tools/semanticize-uibundle-book-display-assets.js`，把书册通用 UI 与鸽子图鉴展示资源改名固化成可重复执行脚本。
- `architecture/tools/check-legacy-runtime-compat.js` 新增书册展示旧路径与 pack 名称护栏，防止 `tex/book/tex/*`、`tex/book/鸽鸽图鉴/*` 再次回流。

## 2026-04-10 `uiBundle` / `main` 共享展示图集继续源头收敛

本轮继续沿用“改 canonical 源头，不加运行时兜底”的策略，把已经开始语义化、但仍处于新旧命名混杂状态的一组共享展示资源整域收口。

本轮新增 canonical 路径：
- `tex/喊人页面/横幅/spriteFrame -> tex/sharePage/banner/spriteFrame`
- `tex/喊人页面/旋转光/spriteFrame -> tex/sharePage/rotatingGlow/spriteFrame`
- `tex/视频2/* -> tex/sharePage/videoBadge/*`
- `tex/视频/* -> tex/sharePage/videoIcon/*`
- `tex/视频(分享)/spriteFrame -> tex/sharePage/videoShareBadge/spriteFrame`
- `tex/喊人页面/邀请好友/spriteFrame -> tex/sharePage/inviteFriendsButton/spriteFrame`
- `tex/喊人页面/进度条2/spriteFrame -> tex/sharePage/progressBarBackground/spriteFrame`
- `tex/喊人页面/进度条/spriteFrame -> tex/sharePage/progressBarForeground/spriteFrame`
- `tex/投诉页面/提交/spriteFrame -> tex/reportDialog/submitButton/spriteFrame`
- `tex/投诉页面/已提交/spriteFrame -> tex/reportDialog/submittedBanner/spriteFrame`
- `tex/投诉页面/×/spriteFrame -> tex/reportDialog/close/spriteFrame`
- `tex/投诉页面/底2/spriteFrame -> tex/reportDialog/panelBackground/spriteFrame`
- `tex/投诉页面/圆2/spriteFrame -> tex/reportDialog/highlightHalo/spriteFrame`
- `tex/投诉页面/底/spriteFrame -> tex/reportDialog/pillBase/spriteFrame`
- `tex/投诉页面/圆1/spriteFrame -> tex/reportDialog/progressDot/spriteFrame`
- `tex/投诉页面/线/spriteFrame -> tex/reportDialog/dividerLine/spriteFrame`
- `tex/底/spriteFrame -> tex/powerPanel/baseBackground/spriteFrame`
- `tex/过关页面/成功进度/光圈/* -> tex/levelCompletePage/successProgress/selectionHalo/*`
- `tex/过关页面/成功进度/条2/spriteFrame -> tex/levelCompletePage/successProgress/progressBarFill/spriteFrame`
- `tex/过关页面/成功进度/条1/spriteFrame -> tex/levelCompletePage/successProgress/progressBarTrack/spriteFrame`
- `tex/过关页面/成功进度/剪影/spriteFrame -> tex/levelCompletePage/successProgress/silhouette/spriteFrame`
- `tex/过关页面/成功进度/再救/spriteFrame -> tex/levelCompletePage/successProgress/reviveAgainLabel/spriteFrame`
- `tex/自动ui/框/spriteFrame -> tex/autoUi/frame/spriteFrame`

本轮同步调整：
- `subpackages/uiBundle/config.ui-bundle.json`
- `subpackages/uiBundle/import/_packs/tex/banner__pack_20.json`
- `subpackages/uiBundle/import/_packs/tex/bottom__pack_30.json`
- `subpackages/uiBundle/import/_packs/tex/bottom__pack_32.json`
- `subpackages/uiBundle/import/_packs/tex/close__pack_28.json`
- `subpackages/uiBundle/import/_packs/tex/levelCompletePage/halo__pack_12.json`
- `subpackages/uiBundle/import/_packs/tex/levelCompletePage/successProgress/silhouette__pack_34.json`
- `subpackages/uiBundle/import/_packs/tex/autoUi/frame__pack_12.json`
- `subpackages/main/import/_packs/pack/banner__pack_11.json`
- `subpackages/main/import/_packs/pack/bottom__pack_17.json`
- `subpackages/main/import/_packs/pack/close__pack_18.json`
- `subpackages/main/import/_packs/pack/halo__pack_18.json`
- `subpackages/main/import/_packs/pack/percent__pack_10.json`

本轮新增治理基础设施：
- `architecture/tools/semanticize-uibundle-book-display-assets.js` 已从“只覆盖图鉴展示”扩展为“图鉴 + 分享页 + 投诉弹窗 + 过关进度 + 自动 UI”的可重复治理脚本。
- `architecture/tools/semanticize-main-book-display-assets.js` 已补齐主包共享横幅与复活/结算相关 atlas 的语义化规则。
- `architecture/tools/check-legacy-runtime-compat.js` 已新增这批旧路径与旧 `SpriteFrame.name` 的反回退护栏。

本轮验证结果：
- 相关 pack/config JSON 已逐个解析通过。
- `npm run guardrails` 已通过。
- 微信官方检查链路已纳入本轮回归。

## 2026-04-10 `DuckBundle fragment` 元数据命名第一批收敛

本轮继续沿用“只改已证实维度，不硬猜业务含义”的治理原则，先把 `fragment` 这组资源里最影响可读性的裸数字 `SpriteFrame.name` 清掉，不在证据不足时冒进改 canonical 路径。

本轮新增元数据命名：
- `tex/fragment/a/1/spriteFrame -> fragmentVariantAShape1`
- `tex/fragment/a/2/spriteFrame -> fragmentVariantAShape2`
- `tex/fragment/a/3/spriteFrame -> fragmentVariantAShape3`
- `tex/fragment/a/4/spriteFrame -> fragmentVariantAShape4`
- `tex/fragment/a/5/spriteFrame -> fragmentVariantAShape5`
- `tex/fragment/a/6/spriteFrame -> fragmentVariantAShape6`
- `tex/fragment/b/1/spriteFrame -> fragmentVariantBShape1`
- `tex/fragment/b/2/spriteFrame -> fragmentVariantBShape2`
- `tex/fragment/b/3/spriteFrame -> fragmentVariantBShape3`
- `tex/fragment/b/4/spriteFrame -> fragmentVariantBShape4`
- `tex/fragment/b/5/spriteFrame -> fragmentVariantBShape5`
- `tex/fragment/b/6/spriteFrame -> fragmentVariantBShape6`
- `tex/fragment/c/1/spriteFrame -> fragmentVariantCShape1`
- `tex/fragment/c/2/spriteFrame -> fragmentVariantCShape2`
- `tex/fragment/c/3/spriteFrame -> fragmentVariantCShape3`
- `tex/fragment/c/4/spriteFrame -> fragmentVariantCShape4`
- `tex/fragment/c/5/spriteFrame -> fragmentVariantCShape5`
- `tex/fragment/c/6/spriteFrame -> fragmentVariantCShape6`
- `tex/fragment/d/1/spriteFrame -> fragmentVariantDShape1`
- `tex/fragment/d/2/spriteFrame -> fragmentVariantDShape2`
- `tex/fragment/d/3/spriteFrame -> fragmentVariantDShape3`
- `tex/fragment/d/4/spriteFrame -> fragmentVariantDShape4`
- `tex/fragment/d/5/spriteFrame -> fragmentVariantDShape5`
- `tex/fragment/d/6/spriteFrame -> fragmentVariantDShape6`
- `tex/fragment/e/1/spriteFrame -> fragmentVariantEShape1`
- `tex/fragment/e/2/spriteFrame -> fragmentVariantEShape2`
- `tex/fragment/e/3/spriteFrame -> fragmentVariantEShape3`
- `tex/fragment/e/4/spriteFrame -> fragmentVariantEShape4`
- `tex/fragment/e/5/spriteFrame -> fragmentVariantEShape5`
- `tex/fragment/e/6/spriteFrame -> fragmentVariantEShape6`

本轮同步调整：
- `game.js` 中确认无调用方的 `Util.fragmentEffect()` 死 helper 已删除
- `subpackages/DuckBundle/import/tex/fragment/*/*/spriteFrame__2.json` 中 30 个 `cc.SpriteFrame` 名

本轮新增治理基础设施：
- 新增 `architecture/tools/semanticize-duckbundle-fragment-assets.js`，把这组命名收敛固化为可重复执行脚本。
- `architecture/tools/check-legacy-runtime-compat.js` 已新增 `fragment` 裸数字名称护栏，禁止 `"name":"1".."6"` 再次回流。
- `architecture/tools/check-legacy-runtime-compat.js` 已新增 `fragmentEffect=function` 护栏，防止无调用死 helper 回流到主入口。
- `architecture/tools/run-guardrails.js` 已接入该脚本的语法检查。

本轮选择依据：
- `game.js` 中原有 `Util.fragmentEffect()` 已确认没有任何调用方，属于可直接删除的死逻辑。
- `game.js` 中 `Util.fragmentEffect()` 的动态路径只稳定证明了两条轴：`a..e` 是变体族、`1..6` 是形状槽位。
- 当前还没有足够运行时证据证明 `a..e` 可以安全收敛为某个现成木板颜色或业务语义，因此本轮不改 `tex/fragment/a..e/*` canonical 路径。
- 先把 `SpriteFrame.name` 从全局重名的 `1..6` 收敛为唯一且可检索的 `fragmentVariantXShapeY`，能立即降低维护噪音，同时不给未来路径级治理制造错误语义债。
