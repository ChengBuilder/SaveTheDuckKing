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
