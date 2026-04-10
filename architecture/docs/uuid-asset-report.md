# UUID 资产审计报告（自动生成）

> 本文件由 `architecture/tools/generate-uuid-asset-report.js` 生成。

## 总览
- JSON 输出模式：`summary`
- Bundle 数：10
- canonical 资产记录数：2293
- config UUID 记录数：3027
- import 编译文件数：1299
- native 编译文件数：660
- 直连 import JSON：0
- pack 承载资产数：21
- 缺失 import JSON 映射：2272
- 已命中 native 文件：0
- 未命中 import 文件：1297
- 未命中 native 文件：660

## 判读规则
- `direct-import-json`：该 UUID 资产有独立 import 元数据文件，可直接映射到语义路径。
- `packed-import-json`：该 UUID 资产被 pack 文件承载，没有独立 import JSON；这是 Cocos 的正常打包结果。
- `missing-import-json`：配置路径存在，但未在当前 bundle import 目录里找到对应直连文件或 pack 文件，需要人工复核。
- UUID 文件默认都视为运行时编译产物；在没有完整重建链路前，不直接改这些文件名。

## 分 Bundle 摘要
| Bundle | 资产数 | UUID 数 | import 文件 | native 文件 | pack 文件 | 缺失 import | 未命中 import | 未命中 native |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `internal` | 18 | 19 | 1 | 0 | 1 | 0 | 0 | 0 |
| `start-scene` | 3 | 19 | 1 | 3 | 1 | 0 | 0 | 3 |
| `DuckBundle` | 1227 | 1251 | 708 | 335 | 0 | 1227 | 708 | 335 |
| `Game2Bundle` | 161 | 175 | 67 | 15 | 0 | 161 | 67 | 15 |
| `HomeBundle` | 231 | 239 | 149 | 74 | 0 | 231 | 149 | 74 |
| `aniBundle` | 156 | 159 | 86 | 42 | 0 | 156 | 86 | 42 |
| `audioBundle` | 65 | 65 | 65 | 65 | 0 | 65 | 65 | 65 |
| `main` | 5 | 523 | 122 | 99 | 0 | 5 | 122 | 99 |
| `resources` | 27 | 39 | 11 | 3 | 0 | 27 | 11 | 3 |
| `uiBundle` | 400 | 538 | 89 | 24 | 0 | 400 | 89 | 24 |

## internal
- 配置：`assets/internal/config.internal.json`
- 目录：`assets/internal`
- 资产记录：18
- UUID 记录：19
- 直连 import JSON：0
- pack 承载资产：18
- 缺失 import JSON：0
- native 命中：0
- 主要资产类型：cc.Material x 11，cc.EffectAsset x 7
- 样例资产映射：
  - `db:/internal/effects/internal/builtin-graphics` / cc.EffectAsset / packed-import-json / import -> `import/0ca60d3e4.ea248.json`
  - `db:/internal/default_materials/ui-alpha-test-material` / cc.Material / packed-import-json / import -> `import/0ca60d3e4.ea248.json`
  - `db:/internal/effects/for2d/builtin-sprite` / cc.EffectAsset / packed-import-json / import -> `import/0ca60d3e4.ea248.json`
  - `db:/internal/effects/internal/builtin-clear-stencil` / cc.EffectAsset / packed-import-json / import -> `import/0ca60d3e4.ea248.json`
  - `db:/internal/effects/util/profiler` / cc.EffectAsset / packed-import-json / import -> `import/0ca60d3e4.ea248.json`
  - `db:/internal/default_materials/default-clear-stencil` / cc.Material / packed-import-json / import -> `import/0ca60d3e4.ea248.json`
  - `db:/internal/effects/util/splash-screen` / cc.EffectAsset / packed-import-json / import -> `import/0ca60d3e4.ea248.json`
  - `db:/internal/effects/builtin-unlit` / cc.EffectAsset / packed-import-json / import -> `import/0ca60d3e4.ea248.json`
- pack 文件样例：
  - `0ca60d3e4` -> `import/0ca60d3e4.ea248.json` / 资产数 18

## start-scene
- 配置：`assets/start-scene/config.start-scene.json`
- 目录：`assets/start-scene`
- 资产记录：3
- UUID 记录：19
- 直连 import JSON：0
- pack 承载资产：3
- 缺失 import JSON：0
- native 命中：0
- 主要资产类型：cc.PhysicsMaterial x 1，cc.RenderPipeline x 1，cc.SceneAsset x 1
- 样例资产映射：
  - `db:/assets/scene/LoadScene` / cc.SceneAsset / packed-import-json / import -> `import/0cd5fa212.c4590.json`
  - `db:/internal/physics/default-physics-material` / cc.PhysicsMaterial / packed-import-json / import -> `import/0cd5fa212.c4590.json`
  - `db:/internal/default_renderpipeline/builtin-forward` / cc.RenderPipeline / packed-import-json / import -> `import/0cd5fa212.c4590.json`
- pack 文件样例：
  - `0cd5fa212` -> `import/0cd5fa212.c4590.json` / 资产数 18
- 未命中 native 文件样例：`native/14a6befbc.f5f92.png`，`native/dcf4a19a-368c-405f-b6e3-d8e9a729a4da.30c62.jpg`，`native/e89a716c-d5b8-4c6b-a418-a3425054af82.a0fe4.png`

## DuckBundle
- 配置：`subpackages/DuckBundle/config.duck-bundle.json`
- 目录：`subpackages/DuckBundle`
- 资产记录：1227
- UUID 记录：1251
- 直连 import JSON：0
- pack 承载资产：0
- 缺失 import JSON：1227
- native 命中：0
- 主要资产类型：cc.SpriteFrame x 423，cc.ImageAsset x 375，cc.Texture2D x 375，cc.Prefab x 54
- 样例资产映射：
  - `tex/nail/sfa` / cc.ImageAsset / missing-import-json
  - `tex/wood/goldWood/goldWood26` / cc.ImageAsset / missing-import-json
  - `tex/wood/lightWood/lightWood34` / cc.ImageAsset / missing-import-json
  - `tex/wood/brownWood/brownWood16` / cc.ImageAsset / missing-import-json
  - `tex/wood/grayWood/grayWood5` / cc.ImageAsset / missing-import-json
  - `tex/wood/goldWood/goldWood31` / cc.ImageAsset / missing-import-json
  - `tex/难度飙升/上层阴影` / cc.ImageAsset / missing-import-json
  - `tex/wood/goldWood/goldWood18` / cc.ImageAsset / missing-import-json
- 未命中 import 文件样例：`import/_packs/pack/bottom__pack_13.json`，`import/_packs/pack/grayWood22__pack_3.json`，`import/_packs/pack/nailHalo__pack_10.json`，`import/_packs/pack/slotFull__pack_5.json`，`import/_packs/pack/star__pack_3.json`，`import/_packs/pack/wood20__pack_3.json`，`import/_packs/pack/wood24__pack_3.json`，`import/_packs/prefab/GyroscopeTip/shake__pack_18.json`
- 其余未命中 import 文件：668 项（仅在 full-records 模式写入 JSON）。
- 未命中 native 文件样例：`native/gyroscope/skeleton.png`，`native/restoredNames/cyanShadowNumberStrip.png`，`native/tex/background/spriteFrame.jpg`，`native/tex/cannotClear/spriteFrame.png`，`native/tex/difficultySpike/bottom/spriteFrame.png`，`native/tex/difficultySpike/completedLevelCount/spriteFrame.png`，`native/tex/difficultySpike/slider/spriteFrame.png`，`native/tex/difficultySpike/spike/spriteFrame.png`
- 其余未命中 native 文件：295 项（仅在 full-records 模式写入 JSON）。

## Game2Bundle
- 配置：`subpackages/Game2Bundle/config.game2-bundle.json`
- 目录：`subpackages/Game2Bundle`
- 资产记录：161
- UUID 记录：175
- 直连 import JSON：0
- pack 承载资产：0
- 缺失 import JSON：161
- native 命中：0
- 主要资产类型：cc.SpriteFrame x 93，cc.Prefab x 36，cc.ImageAsset x 16，cc.Texture2D x 16
- 样例资产映射：
  - `tex/道具/移除槽位中的水果` / cc.ImageAsset / missing-import-json
  - `tex/道具/打乱水果位置` / cc.ImageAsset / missing-import-json
  - `tex/背景/game2_bg2` / cc.ImageAsset / missing-import-json
  - `tex/解锁进度2/game3_front` / cc.ImageAsset / missing-import-json
  - `tex/道具/消除2组水果` / cc.ImageAsset / missing-import-json
  - `tex/背景/game2_bg3` / cc.ImageAsset / missing-import-json
  - `tex/道具/剩余` / cc.ImageAsset / missing-import-json
  - `tex/背景/game2_bg1` / cc.ImageAsset / missing-import-json
- 未命中 import 文件样例：`import/_packs/tex/fruit/randomFruit__pack_72.json`，`import/_packs/tex/fruitShadow/fruitShadow16__pack_4.json`，`import/_packs/tex/fruitShadow/fruitShadow1__pack_64.json`，`import/_packs/tex/remaining__pack_11.json`，`import/_packs/tex/unlockProgress/game2_s1__pack_14.json`，`import/prefab/fruit.json`，`import/prefab/fruit1.json`，`import/prefab/fruit10.json`
- 其余未命中 import 文件：27 项（仅在 full-records 模式写入 JSON）。
- 未命中 native 文件样例：`native/tex/background/game2_bg1/spriteFrame.jpg`，`native/tex/background/game2_bg2/spriteFrame.jpg`，`native/tex/background/game2_bg3/spriteFrame.jpg`，`native/tex/background/game2_bg4/spriteFrame.jpg`，`native/tex/background/game2_bg5/spriteFrame.jpg`，`native/tex/fruit/randomFruit__texture_72.png`，`native/tex/fruitShadow/fruitShadow16__texture_4.png`，`native/tex/fruitShadow/fruitShadow1__texture_64.png`

## HomeBundle
- 配置：`subpackages/HomeBundle/config.home-bundle.json`
- 目录：`subpackages/HomeBundle`
- 资产记录：231
- UUID 记录：239
- 直连 import JSON：0
- pack 承载资产：0
- 缺失 import JSON：231
- native 命中：0
- 主要资产类型：cc.SpriteFrame x 80，cc.ImageAsset x 74，cc.Texture2D x 74，cc.Prefab x 3
- 样例资产映射：
  - `tex/homeTheme2/foreground/foregroundLayer5` / cc.ImageAsset / missing-import-json
  - `tex/获得100只鸭子解锁` / cc.ImageAsset / missing-import-json
  - `tex/homeTheme3/foreground/foregroundLayer3` / cc.ImageAsset / missing-import-json
  - `tex/homeTheme2/bottomOverlay` / cc.ImageAsset / missing-import-json
  - `tex/homeTheme1/midground/midgroundLayer2` / cc.ImageAsset / missing-import-json
  - `tex/homeTheme1/foreground/foregroundLayer4` / cc.ImageAsset / missing-import-json
  - `tex/homeTheme3/foreground/foregroundLayer1` / cc.ImageAsset / missing-import-json
  - `tex/homeTheme3/midground/midgroundLayer1` / cc.ImageAsset / missing-import-json
- 未命中 import 文件样例：`import/_packs/pack/gooseTip__pack_5.json`，`import/_packs/pack/home_particle__pack_3.json`，`import/_packs/tex/homeTheme0/foreground/foregroundLayer1__pack_10.json`，`import/_packs/tex/unlockAt100Geese__pack_72.json`，`import/midgroundLayer2/midgroundLayer2__texture_1.json`，`import/prefab/bgThing.json`，`import/tex/backgroundParticles/greenLeafParticle/spriteFrame.json`，`import/tex/backgroundParticles/orangeGlowParticle/spriteFrame.json`
- 其余未命中 import 文件：109 项（仅在 full-records 模式写入 JSON）。
- 未命中 native 文件样例：`native/midgroundLayer2/midgroundLayer2__texture_1.png`，`native/tex/backgroundParticles/greenLeafParticle/spriteFrame.png`，`native/tex/backgroundParticles/orangeGlowParticle/spriteFrame.png`，`native/tex/backgroundParticles/orangeLeafParticle/spriteFrame.png`，`native/tex/backgroundParticles/whiteGlowParticle/spriteFrame.png`，`native/tex/homeTheme0/background/backgroundLayer1/spriteFrame.png`，`native/tex/homeTheme0/background/backgroundLayer2/spriteFrame.png`，`native/tex/homeTheme0/bottomOverlay/spriteFrame.jpg`
- 其余未命中 native 文件：34 项（仅在 full-records 模式写入 JSON）。

## aniBundle
- 配置：`subpackages/aniBundle/config.animation-bundle.json`
- 目录：`subpackages/aniBundle`
- 资产记录：156
- UUID 记录：159
- 直连 import JSON：0
- pack 承载资产：0
- 缺失 import JSON：156
- native 命中：0
- 主要资产类型：cc.ImageAsset x 35，cc.SpriteFrame x 35，cc.Texture2D x 35，cc.Asset x 25，sp.SkeletonData x 25，cc.Prefab x 1
- 样例资产映射：
  - `神兽动画合集/百鹅朝麟/skeleton` / cc.ImageAsset / missing-import-json
  - `陀螺仪/skeleton` / cc.Asset / missing-import-json
  - `神兽动画合集/百鹅朝凤/skeleton` / cc.ImageAsset / missing-import-json
  - `小三视频/skeleton` / cc.ImageAsset / missing-import-json
  - `神兽动画合集/百鸭朝龙/skeleton` / cc.Asset / missing-import-json
  - `神兽动画合集/百鹅朝鹏/skeleton` / cc.Asset / missing-import-json
  - `破门动画/skeleton` / cc.Asset / missing-import-json
  - `开始动画/skeleton` / cc.Asset / missing-import-json
- 未命中 import 文件样例：`import/_packs/pack/goose__pack_179.json`，`import/_packs/pack/skeleton__pack_17.json`，`import/bibiLabu/skeleton.json`，`import/bibiLabu/skeleton/spriteFrame.json`，`import/breakDoorAnimation/skeleton.json`，`import/breakDoorAnimation/skeleton/spriteFrame.json`，`import/breakDoorAnimation/skeleton/spriteFrame__2.json`，`import/breakDoorAnimation/skeleton2/spriteFrame.json`
- 其余未命中 import 文件：46 项（仅在 full-records 模式写入 JSON）。
- 未命中 native 文件样例：`native/bibiLabu/skeleton.atlas`，`native/breakDoorAnimation/skeleton.atlas`，`native/breakDoorAnimation/skeleton/spriteFrame.png`，`native/breakDoorAnimation/skeleton2/spriteFrame.png`，`native/daily/skeleton.atlas`，`native/dave/skeleton.atlas`，`native/fruitBigEater/Kid-eating.atlas`，`native/fullAnimation/Done_for_eat.atlas`
- 其余未命中 native 文件：2 项（仅在 full-records 模式写入 JSON）。

## audioBundle
- 配置：`subpackages/audioBundle/config.audio-bundle.json`
- 目录：`subpackages/audioBundle`
- 资产记录：65
- UUID 记录：65
- 直连 import JSON：0
- pack 承载资产：0
- 缺失 import JSON：65
- native 命中：0
- 主要资产类型：cc.AudioClip x 65
- 样例资产映射：
  - `comboMusic/combo_3` / cc.AudioClip / missing-import-json
  - `fruitGame/eliminate3` / cc.AudioClip / missing-import-json
  - `fruitGame/eliminate8` / cc.AudioClip / missing-import-json
  - `duckGame/woodAssembleFollow` / cc.AudioClip / missing-import-json
  - `comboMusic/combo_4` / cc.AudioClip / missing-import-json
  - `ui/warningPrompt` / cc.AudioClip / missing-import-json
  - `win` / cc.AudioClip / missing-import-json
  - `ui/applause` / cc.AudioClip / missing-import-json
- 未命中 import 文件样例：`import/bgm/defaultGameplay.json`，`import/bgm/pureColor.json`，`import/comboMusic/combo_1.json`，`import/comboMusic/combo_10.json`，`import/comboMusic/combo_2.json`，`import/comboMusic/combo_3.json`，`import/comboMusic/combo_4.json`，`import/comboMusic/combo_5.json`
- 其余未命中 import 文件：25 项（仅在 full-records 模式写入 JSON）。
- 未命中 native 文件样例：`native/bgm/defaultGameplay.mp3`，`native/bgm/pureColor.mp3`，`native/comboMusic/combo_1.mp3`，`native/comboMusic/combo_10.mp3`，`native/comboMusic/combo_2.mp3`，`native/comboMusic/combo_3.mp3`，`native/comboMusic/combo_4.mp3`，`native/comboMusic/combo_5.mp3`
- 其余未命中 native 文件：25 项（仅在 full-records 模式写入 JSON）。

## main
- 配置：`subpackages/main/config.main.json`
- 目录：`subpackages/main`
- 资产记录：5
- UUID 记录：523
- 直连 import JSON：0
- pack 承载资产：0
- 缺失 import JSON：5
- native 命中：0
- 主要资产类型：cc.SceneAsset x 5
- 样例资产映射：
  - `db:/assets/scene/DuckScene` / cc.SceneAsset / missing-import-json
  - `db:/assets/scene/FruitScene` / cc.SceneAsset / missing-import-json
  - `db:/assets/scene/PigeonScene` / cc.SceneAsset / missing-import-json
  - `db:/assets/scene/Game2Scene` / cc.SceneAsset / missing-import-json
  - `db:/assets/scene/HomeScene` / cc.SceneAsset / missing-import-json
- 未命中 import 文件样例：`import/_packs/db/assets/scene/DuckScene/2__pack_1674.json`，`import/_packs/db/assets/scene/FruitScene/randomQuestionMark__pack_88.json`，`import/_packs/db/assets/scene/Game2Scene/hole__pack_5.json`，`import/_packs/db/assets/scene/HomeScene/3__pack_124.json`，`import/_packs/db/assets/scene/PigeonScene/background__pack_7.json`，`import/_packs/pack/banner__pack_11.json`，`import/_packs/pack/bottom__pack_15.json`，`import/_packs/pack/bottom__pack_17.json`
- 其余未命中 import 文件：82 项（仅在 full-records 模式写入 JSON）。
- 未命中 native 文件样例：`native/background/cloud.png`，`native/background/lightGradient.jpg`，`native/background/skyGradient.jpeg`，`native/bibiLabu/skeleton.png`，`native/daily/skeleton.png`，`native/dave/skeleton.png`，`native/digits/whiteDigitsStrip.png`，`native/digits/whiteDigitsStripWide.png`
- 其余未命中 native 文件：59 项（仅在 full-records 模式写入 JSON）。

## resources
- 配置：`subpackages/resources/config.resources.json`
- 目录：`subpackages/resources`
- 资产记录：27
- UUID 记录：39
- 直连 import JSON：0
- pack 承载资产：0
- 缺失 import JSON：27
- native 命中：0
- 主要资产类型：cc.SpriteFrame x 21，cc.Prefab x 3，cc.EffectAsset x 1，cc.JsonAsset x 1，cc.Material x 1
- 样例资产映射：
  - `particleEffects/colorMarker2/spriteFrame` / cc.SpriteFrame / missing-import-json
  - `particleEffects/colorMarkerParticle` / cc.Prefab / missing-import-json
  - `ribbonBurst/ribbon5/spriteFrame` / cc.SpriteFrame / missing-import-json
  - `particleEffects/fragmentShard` / cc.Prefab / missing-import-json
  - `particleEffects/colorMarker3/spriteFrame` / cc.SpriteFrame / missing-import-json
  - `particleEffects/colorMarker9/spriteFrame` / cc.SpriteFrame / missing-import-json
  - `multiTexture/multiTextureMaterial` / cc.Material / missing-import-json
  - `particleEffects/colorMarker12/spriteFrame` / cc.SpriteFrame / missing-import-json
- 未命中 import 文件样例：`import/_packs/multiTexture/a_color__pack_59.json`，`import/_packs/particleEffects/colorMarker1__pack_28.json`，`import/_packs/particleEffects/deletePulseCircle/deletePulseCircle__pack_2.json`，`import/_packs/ribbonBurst/ribbon1__pack_14.json`，`import/duck/duckLevelTemplates.json`，`import/multiTexture/sharedTextureCollection.json`，`import/particleEffects/colorMarker1__texture_28.json`，`import/particleEffects/colorMarkerParticle.json`
- 未命中 native 文件样例：`native/particleEffects/colorMarker1__texture_28.png`，`native/ribbonBurst/ribbon1__texture_14.png`，`native/tex/circle/DeleteCircle.png`

## uiBundle
- 配置：`subpackages/uiBundle/config.ui-bundle.json`
- 目录：`subpackages/uiBundle`
- 资产记录：400
- UUID 记录：538
- 直连 import JSON：0
- pack 承载资产：0
- 缺失 import JSON：400
- native 命中：0
- 主要资产类型：cc.SpriteFrame x 336，cc.Prefab x 28，cc.ImageAsset x 18，cc.Texture2D x 18
- 样例资产映射：
  - `tex/过关页面/还差/spriteFrame` / cc.SpriteFrame / missing-import-json
  - `tex/book/duck/y30/spriteFrame` / cc.SpriteFrame / missing-import-json
  - `tex/过关页面/成功进度/只鸭解锁百鸭朝雀/spriteFrame` / cc.SpriteFrame / missing-import-json
  - `tex/settings/giveUpChallengeText/spriteFrame` / cc.SpriteFrame / missing-import-json
  - `tex/更多玩法/图标算数/spriteFrame` / cc.SpriteFrame / missing-import-json
  - `tex/book/ui/filterAll/spriteFrame` / cc.SpriteFrame / missing-import-json
  - `tex/主页素材/排行榜/名次底2/spriteFrame` / cc.SpriteFrame / missing-import-json
  - `tex/失败页面/继续挑战/spriteFrame` / cc.SpriteFrame / missing-import-json
- 未命中 import 文件样例：`import/_packs/gooseSuccessNumber/gooseSuccessNumber__pack_1.json`，`import/_packs/pack/callFriend__pack_15.json`，`import/_packs/prefab/OverUI/reviveNumber__pack_2.json`，`import/_packs/prefab/SuccessUI/arm__pack_21.json`，`import/_packs/settingsDialogNumber/settingsDialogNumber__pack_1.json`，`import/_packs/staminaCount/staminaCount__pack_1.json`，`import/_packs/tex/autoUi/frame__pack_12.json`，`import/_packs/tex/banner__pack_20.json`
- 其余未命中 import 文件：49 项（仅在 full-records 模式写入 JSON）。
- 未命中 native 文件样例：`native/fullAnimation/Done_for_eat.png`，`native/restoredNames/blackOutlineNumberStrip.png`，`native/restoredNames/whiteBlockStrip.png`，`native/restoredNames/whiteHorizontalBar.png`，`native/restoredNames/whiteNumberStrip.png`，`native/tex/autoUi/frame__texture_12.png`，`native/tex/book/duck/y1__texture_48.png`，`native/tex/book/duck/y26__texture_12.png`

## 结果文件
- Markdown：`architecture/docs/uuid-asset-report.md`
- JSON：`architecture/docs/uuid-asset-report.json`

