# 音频使用审计（自动生成）

> 本文件由 `architecture/tools/generate-audio-usage-audit.js` 生成。

## 总览
- Bundle：`audioBundle`
- 音频 canonical 路径数：65
- 直接引用条目数：27
- 动态前缀匹配条目数：15
- 未引用候选数：23
- 低可读命名候选数：0
- 根层路径候选数：0

## 直接引用
- `bgm/defaultGameplay`：`playMusic` x 12
- `bgm/pureColor`：`playMusic` x 3
- `duckGame/cageBreak`：`playSound` x 2
- `duckGame/duckQuack`：`playSound` x 2
- `duckGame/duckVictory`：`playLongSound` x 1
- `duckGame/errorPrompt`：`playSound` x 3
- `duckGame/nailPop`：`playSound` x 1
- `duckGame/stoneCollision`：`playSound` x 2
- `duckGame/woodAssembleFollow`：`playSound` x 2
- `duckGame/woodAssembleLead`：`playSound` x 2
- `duckGame/woodCollision`：`playSound` x 1
- `fruitGame/fruitBgm`：`playMusic` x 5
- `fruitGame/fruitClick`：`playSound` x 2
- `fruitGame/FruitWin`：`playLongSound` x 1
- `fruitGame/slotFull`：`playSound` x 3
- `sceneTransition/duckDrop`：`playSound` x 1
- `sceneTransition/fruitGameReveal`：`playSound` x 1
- `ui/applause`：`playSound` x 1
- `ui/buttonClick`：`playSound` x 94
- `ui/duckUnlock`：`playSound` x 1
- `ui/failurePrompt`：`playSound` x 2
- `ui/failureStinger`：`playSound` x 2
- `ui/levelComplete`：`playSound` x 2
- `ui/powerConsume`：`playSound` x 2
- `ui/ribbonBurst`：`playSound` x 1
- `ui/victoryStinger`：`playSound` x 2
- `ui/warningPrompt`：`playSound` x 2

## 动态前缀引用
- `fruitGame/`：`playSound` x 1
- `woodDrop/woodDrop_`：`playSound` x 2

## 根层路径候选
- 无

## 低可读命名候选
- 无

## 未引用候选
- `comboMusic/combo_1`
- `comboMusic/combo_10`
- `comboMusic/combo_2`
- `comboMusic/combo_3`
- `comboMusic/combo_4`
- `comboMusic/combo_5`
- `comboMusic/combo_6`
- `comboMusic/combo_7`
- `comboMusic/combo_8`
- `comboMusic/combo_9`
- `legacy/door`
- `legacy/fly`
- `legacy/fruitBornDuplicateLz`
- `legacy/gameOver`
- `legacy/levelCompleteDuplicateGz`
- `legacy/levelCompleteDuplicateShow`
- `legacy/levelUp`
- `legacy/pop`
- `legacy/unknownAdz`
- `legacy/unknownBdz`
- `legacy/unknownLs`
- `legacy/victory`
- `sceneTransition/duckGameReveal`

## 结果文件
- Markdown：`architecture/docs/audio-usage-audit.md`
- JSON：`architecture/docs/audio-usage-audit.json`

