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
