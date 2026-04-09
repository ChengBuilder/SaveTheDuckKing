# Subpackages 结构审计（自动生成）

> 本文件由 `architecture/tools/generate-subpackage-structure-audit.js` 生成。

## 结论

- `subpackages/*/import/*.json` 与 `subpackages/*/native/*` 依然是运行时刚需编译产物，不适合按源码目录思路做大规模删改。
- 本次检查结果：`unused import JSON = 0`，`unused native files = 0`。
- 路径卫生结果：`empty directories = 0`，`URL-encoded paths = 0`。
- 当前 JSON 输出模式：`summary`。
- 因此可以继续清理命名与治理索引，但不建议直接删除 `subpackages` 里的编译 JSON。
- 若要“看懂”这些文件，优先查看本审计、bundle 配置和语义别名清单。

## 汇总

| 项目 | 数量 |
| --- | ---: |
| Bundle 数 | 8 |
| 标准子包 game.js 占位文件 | 8 |
| import JSON 总数 | 1296 |
| 直接 import JSON | 1213 |
| pack 容器 JSON | 83 |
| 配置 pack 条目总数 | 86 |
| 配置 path 条目总数 | 2272 |
| 配置 uuid 条目总数 | 2989 |
| 空目录 | 0 |
| URL 编码路径 | 0 |
| native 文件总数 | 657 |
| 可删 import JSON | 0 |
| 可删 native 文件 | 0 |

## Bundle 明细

### aniBundle

- 配置：`subpackages/aniBundle/config.animation-bundle.json`
- 子包入口：`subpackages/aniBundle/game.js`（root game.js 接管启动）
- 语义别名清单：`architecture/generated/subpackage-semantic-aliases/aniBundle.json`
- 依赖 bundle：main，start-scene
- scene 入口：无
- 配置体量：packs 2，paths 156，uuids 159，versions import，native
- Bundle 根文件：config.animation-bundle.json, game.js
- import JSON：86（direct 84，pack 2）
- native 文件：42
- 可删运行时文件：import 0，native 0
- 空目录：0；URL 编码路径：0
- import 顶层命名空间样例：mythicBeastAnimations (24)，xiaoSanVideo (11)，skeletalAnimations (9)，breakDoorAnimation (5)，fullAnimation (4)，gyroscope (4)
- native 顶层命名空间样例：mythicBeastAnimations (12)，xiaoSanVideo (6)，breakDoorAnimation (3)，fullAnimation (2)，gooseTrapAnimation (2)，gyroscope (2)
- 空目录样例：无
- URL 编码路径样例：无
- direct import 样例：`subpackages/aniBundle/import/bibiLabu/skeleton.json` {canonical=比比拉布/skeleton, class=cc.Asset, deps=0}；`subpackages/aniBundle/import/bibiLabu/skeleton/spriteFrame.json` {canonical=比比拉布/skeleton/spriteFrame, class=cc.SpriteFrame, name=skeleton, deps=1}；`subpackages/aniBundle/import/breakDoorAnimation/skeleton.json` {canonical=破门动画/skeleton, class=cc.Asset, deps=0}；`subpackages/aniBundle/import/breakDoorAnimation/skeleton/spriteFrame__2.json` {canonical=破门动画/skeleton/spriteFrame, class=cc.SpriteFrame, name=skeleton, deps=1}；`subpackages/aniBundle/import/breakDoorAnimation/skeleton/spriteFrame.json` {canonical=破门动画/skeleton/spriteFrame, class=cc.ImageAsset, deps=0}；`subpackages/aniBundle/import/breakDoorAnimation/skeleton2/spriteFrame__2.json` {canonical=破门动画/skeleton2/spriteFrame, class=cc.SpriteFrame, name=skeleton2, deps=1}
- pack 样例：`subpackages/aniBundle/import/_packs/pack/goose__pack_179.json` {class=cc.Node/cc.Widget/cc.UITransform/cc.Sprite/sp.Skeleton/cc.Prefab, name=default, deps=16}；`subpackages/aniBundle/import/_packs/pack/skeleton__pack_17.json` {deps=0}
- native 样例：`subpackages/aniBundle/native/bibiLabu/skeleton.atlas` {canonical=比比拉布/skeleton, ext=.atlas}；`subpackages/aniBundle/native/breakDoorAnimation/skeleton.atlas` {canonical=破门动画/skeleton, ext=.atlas}；`subpackages/aniBundle/native/breakDoorAnimation/skeleton/spriteFrame.png` {canonical=破门动画/skeleton/spriteFrame, ext=.png}；`subpackages/aniBundle/native/breakDoorAnimation/skeleton2/spriteFrame.png` {canonical=破门动画/skeleton2/spriteFrame, ext=.png}；`subpackages/aniBundle/native/daily/skeleton.atlas` {canonical=每日/skeleton, ext=.atlas}；`subpackages/aniBundle/native/dave/skeleton.atlas` {canonical=戴夫/skeleton, ext=.atlas}

### audioBundle

- 配置：`subpackages/audioBundle/config.audio-bundle.json`
- 子包入口：`subpackages/audioBundle/game.js`（root game.js 接管启动）
- 语义别名清单：`architecture/generated/subpackage-semantic-aliases/audioBundle.json`
- 依赖 bundle：无
- scene 入口：无
- 配置体量：packs 0，paths 65，uuids 65，versions import，native
- Bundle 根文件：config.audio-bundle.json, game.js
- import JSON：65（direct 65，pack 0）
- native 文件：65
- 可删运行时文件：import 0，native 0
- 空目录：0；URL 编码路径：0
- import 顶层命名空间样例：fruitGame (16)，legacy (12)，comboMusic (10)，ui (10)，duckGame (9)，sceneTransition (3)
- native 顶层命名空间样例：fruitGame (16)，legacy (12)，comboMusic (10)，ui (10)，duckGame (9)，sceneTransition (3)
- 空目录样例：无
- URL 编码路径样例：无
- direct import 样例：`subpackages/audioBundle/import/bgm/defaultGameplay.json` {canonical=bgm/defaultGameplay, class=cc.AudioClip, deps=0}；`subpackages/audioBundle/import/bgm/pureColor.json` {canonical=bgm/pureColor, class=cc.AudioClip, deps=0}；`subpackages/audioBundle/import/comboMusic/combo_1.json` {canonical=comboMusic/combo_1, class=cc.AudioClip, deps=0}；`subpackages/audioBundle/import/comboMusic/combo_10.json` {canonical=comboMusic/combo_10, class=cc.AudioClip, deps=0}；`subpackages/audioBundle/import/comboMusic/combo_2.json` {canonical=comboMusic/combo_2, class=cc.AudioClip, deps=0}；`subpackages/audioBundle/import/comboMusic/combo_3.json` {canonical=comboMusic/combo_3, class=cc.AudioClip, deps=0}
- pack 样例：无
- native 样例：`subpackages/audioBundle/native/bgm/defaultGameplay.mp3` {canonical=bgm/defaultGameplay, ext=.mp3}；`subpackages/audioBundle/native/bgm/pureColor.mp3` {canonical=bgm/pureColor, ext=.mp3}；`subpackages/audioBundle/native/comboMusic/combo_1.mp3` {canonical=comboMusic/combo_1, ext=.mp3}；`subpackages/audioBundle/native/comboMusic/combo_10.mp3` {canonical=comboMusic/combo_10, ext=.mp3}；`subpackages/audioBundle/native/comboMusic/combo_2.mp3` {canonical=comboMusic/combo_2, ext=.mp3}；`subpackages/audioBundle/native/comboMusic/combo_3.mp3` {canonical=comboMusic/combo_3, ext=.mp3}

### DuckBundle

- 配置：`subpackages/DuckBundle/config.duck-bundle.json`
- 子包入口：`subpackages/DuckBundle/game.js`（root game.js 接管启动）
- 语义别名清单：`architecture/generated/subpackage-semantic-aliases/DuckBundle.json`
- 依赖 bundle：main，resources
- scene 入口：无
- 配置体量：packs 12，paths 1227，uuids 1251，versions import，native
- Bundle 根文件：config.duck-bundle.json, game.js
- import JSON：708（direct 696，pack 12）
- native 文件：335
- 可删运行时文件：import 0，native 0
- 空目录：0；URL 编码路径：0
- import 顶层命名空间样例：tex (650)，prefab (44)，_packs (12)，gyroscope (1)，restoredNames (1)
- native 顶层命名空间样例：tex (333)，gyroscope (1)，restoredNames (1)
- 空目录样例：无
- URL 编码路径样例：无
- direct import 样例：`subpackages/DuckBundle/import/gyroscope/skeleton.json` {canonical=陀螺仪/skeleton, class=cc.ImageAsset, deps=0}；`subpackages/DuckBundle/import/prefab/adGrid1.json` {canonical=prefab/adGrid1, class=cc.Node/cc.Sprite/cc.Prefab/cc.UITransform/cc.CompPrefabInfo/cc.PrefabInfo, deps=2}；`subpackages/DuckBundle/import/prefab/highLight.json` {canonical=prefab/highLight, class=cc.Prefab/cc.Node/cc.UITransform/cc.CompPrefabInfo/cc.Sprite/cc.UIOpacity, deps=1}；`subpackages/DuckBundle/import/prefab/lockSprite.json` {canonical=prefab/lockSprite, class=cc.Node/cc.Prefab/cc.UITransform/cc.CompPrefabInfo/cc.Sprite/cc.PrefabInfo, deps=2}；`subpackages/DuckBundle/import/prefab/nailShadow.json` {canonical=prefab/nailShadow, class=cc.Prefab/cc.Node/cc.UITransform/cc.CompPrefabInfo/cc.Sprite/cc.UIOpacity, deps=1}；`subpackages/DuckBundle/import/prefab/wood/wood1.json` {canonical=prefab/wood/wood1, class=cc.Node/cc.Prefab/cc.UITransform/cc.CompPrefabInfo/cc.Sprite/cc.PrefabInfo, deps=1}
- pack 样例：`subpackages/DuckBundle/import/_packs/pack/bottom__pack_13.json` {class=cc.SpriteFrame/cc.Node/cc.Sprite/cc.UITransform/cc.Widget/cc.UIOpacity, name=上层阴影/飙升2/飙升/通关数量/底/滑动条, deps=13}；`subpackages/DuckBundle/import/_packs/pack/grayWood22__pack_3.json` {class=cc.SpriteFrame/cc.Prefab/cc.Node/cc.UITransform/cc.CompPrefabInfo/cc.Sprite, name=grayWood22, deps=2}；`subpackages/DuckBundle/import/_packs/pack/nailHalo__pack_10.json` {class=cc.Node/cc.SpriteFrame/cc.Sprite/cc.Prefab/cc.UITransform/cc.CompPrefabInfo, name=dingZi/baia/钉子光圈/bain, deps=9}；`subpackages/DuckBundle/import/_packs/pack/slotFull__pack_5.json` {class=cc.SpriteFrame/cc.Node/cc.Sprite/cc.Prefab/cc.UITransform/cc.CompPrefabInfo, name=无法消除/槽位已满, deps=4}；`subpackages/DuckBundle/import/_packs/pack/star__pack_3.json` {class=cc.SpriteFrame/cc.Prefab/cc.Node/cc.UITransform/cc.CompPrefabInfo/cc.Sprite, name=星星, deps=2}；`subpackages/DuckBundle/import/_packs/pack/wood20__pack_3.json` {class=cc.Node/cc.Sprite/cc.SpriteFrame/cc.Prefab/cc.UITransform/cc.CompPrefabInfo, name=grayWood20, deps=3}
- native 样例：`subpackages/DuckBundle/native/gyroscope/skeleton.png` {canonical=陀螺仪/skeleton, ext=.png}；`subpackages/DuckBundle/native/restoredNames/cyanShadowNumberStrip.png` {canonical=恢复命名/青色阴影数字条, ext=.png}；`subpackages/DuckBundle/native/tex/background/spriteFrame.jpg` {canonical=tex/背景/spriteFrame, ext=.jpg}；`subpackages/DuckBundle/native/tex/cannotClear/spriteFrame.png` {canonical=tex/无法消除/spriteFrame, ext=.png}；`subpackages/DuckBundle/native/tex/difficultySpike/bottom/spriteFrame.png` {canonical=tex/难度飙升/底/spriteFrame, ext=.png}；`subpackages/DuckBundle/native/tex/difficultySpike/completedLevelCount/spriteFrame.png` {canonical=tex/难度飙升/通关数量/spriteFrame, ext=.png}

### Game2Bundle

- 配置：`subpackages/Game2Bundle/config.game2-bundle.json`
- 子包入口：`subpackages/Game2Bundle/game.js`（root game.js 接管启动）
- 语义别名清单：`architecture/generated/subpackage-semantic-aliases/Game2Bundle.json`
- 依赖 bundle：main
- scene 入口：无
- 配置体量：packs 5，paths 161，uuids 175，versions import，native
- Bundle 根文件：config.game2-bundle.json, game.js
- import JSON：67（direct 62，pack 5）
- native 文件：15
- 可删运行时文件：import 0，native 0
- 空目录：0；URL 编码路径：0
- import 顶层命名空间样例：prefab (36)，tex (26)，_packs (5)
- native 顶层命名空间样例：tex (15)
- 空目录样例：无
- URL 编码路径样例：无
- direct import 样例：`subpackages/Game2Bundle/import/prefab/fruit.json` {canonical=prefab/fruit, class=cc.Prefab/cc.Node/cc.UITransform/cc.CompPrefabInfo/cc.Sprite/bf6c10fc7lIiqjgyUCFDIFM, deps=1}；`subpackages/Game2Bundle/import/prefab/fruit1.json` {canonical=prefab/fruit1, class=cc.Node/cc.Sprite/cc.Prefab/cc.UITransform/cc.CompPrefabInfo/cc.PrefabInfo, deps=2}；`subpackages/Game2Bundle/import/prefab/fruit10.json` {canonical=prefab/fruit10, class=cc.Node/cc.Sprite/cc.Prefab/cc.UITransform/cc.CompPrefabInfo/cc.PrefabInfo, deps=2}；`subpackages/Game2Bundle/import/prefab/fruit11.json` {canonical=prefab/fruit11, class=cc.Node/cc.Sprite/cc.Prefab/cc.UITransform/cc.CompPrefabInfo/cc.PrefabInfo, deps=2}；`subpackages/Game2Bundle/import/prefab/fruit12.json` {canonical=prefab/fruit12, class=cc.Node/cc.Sprite/cc.Prefab/cc.UITransform/cc.CompPrefabInfo/cc.PrefabInfo, deps=2}；`subpackages/Game2Bundle/import/prefab/fruit13.json` {canonical=prefab/fruit13, class=cc.Node/cc.Sprite/cc.Prefab/cc.UITransform/cc.CompPrefabInfo/cc.PrefabInfo, deps=2}
- pack 样例：`subpackages/Game2Bundle/import/_packs/tex/fruit/randomFruit__pack_72.json` {class=cc.SpriteFrame, name=fruit17/fruit21/fruit25/fruit10/随机问号/fruit32, deps=1}；`subpackages/Game2Bundle/import/_packs/tex/fruitShadow/fruitShadow1__pack_64.json` {class=cc.SpriteFrame, name=fruitShadow23/fruitShadow2/fruitShadow15/fruitShadow31/fruitShadow24/fruitShadow4, deps=1}；`subpackages/Game2Bundle/import/_packs/tex/fruitShadow/fruitShadow16__pack_4.json` {class=cc.SpriteFrame, name=fruitShadow16/fruitShadow20, deps=1}；`subpackages/Game2Bundle/import/_packs/tex/remaining__pack_11.json` {deps=0}；`subpackages/Game2Bundle/import/_packs/tex/unlockProgress/game2_s1__pack_14.json` {class=cc.SpriteFrame, name=game2_s1/game2_s7/game2_s4/game2_s3/game2_s6/game2_s2, deps=1}
- native 样例：`subpackages/Game2Bundle/native/tex/background/game2_bg1/spriteFrame.jpg` {canonical=tex/背景/game2_bg1/spriteFrame, ext=.jpg}；`subpackages/Game2Bundle/native/tex/background/game2_bg2/spriteFrame.jpg` {canonical=tex/背景/game2_bg2/spriteFrame, ext=.jpg}；`subpackages/Game2Bundle/native/tex/background/game2_bg3/spriteFrame.jpg` {canonical=tex/背景/game2_bg3/spriteFrame, ext=.jpg}；`subpackages/Game2Bundle/native/tex/background/game2_bg4/spriteFrame.jpg` {canonical=tex/背景/game2_bg4/spriteFrame, ext=.jpg}；`subpackages/Game2Bundle/native/tex/background/game2_bg5/spriteFrame.jpg` {canonical=tex/背景/game2_bg5/spriteFrame, ext=.jpg}；`subpackages/Game2Bundle/native/tex/fruit/randomFruit__texture_72.png` {ext=.png}

### HomeBundle

- 配置：`subpackages/HomeBundle/config.home-bundle.json`
- 子包入口：`subpackages/HomeBundle/game.js`（root game.js 接管启动）
- 语义别名清单：`architecture/generated/subpackage-semantic-aliases/HomeBundle.json`
- 依赖 bundle：main
- scene 入口：无
- 配置体量：packs 4，paths 231，uuids 239，versions import，native
- Bundle 根文件：config.home-bundle.json, game.js
- import JSON：149（direct 145，pack 4）
- native 文件：74
- 可删运行时文件：import 0，native 0
- 空目录：0；URL 编码路径：0
- import 顶层命名空间样例：tex (143)，_packs (4)，midgroundLayer2 (1)，prefab (1)
- native 顶层命名空间样例：tex (73)，midgroundLayer2 (1)
- 空目录样例：无
- URL 编码路径样例：无
- direct import 样例：`subpackages/HomeBundle/import/midgroundLayer2/midgroundLayer2__texture_1.json` {class=cc.ImageAsset, deps=0}；`subpackages/HomeBundle/import/prefab/bgThing.json` {canonical=prefab/bgThing, class=cc.Prefab/cc.Node/cc.UITransform/cc.CompPrefabInfo/cc.Sprite/cc.PrefabInfo, deps=0}；`subpackages/HomeBundle/import/tex/backgroundParticles/greenLeafParticle/spriteFrame.json` {canonical=tex/backgroundParticles/greenLeafParticle/spriteFrame, class=cc.ImageAsset, deps=0}；`subpackages/HomeBundle/import/tex/backgroundParticles/orangeGlowParticle/spriteFrame__2.json` {canonical=tex/backgroundParticles/orangeGlowParticle/spriteFrame, class=cc.SpriteFrame, name=orangeGlowParticle, deps=1}；`subpackages/HomeBundle/import/tex/backgroundParticles/orangeGlowParticle/spriteFrame.json` {canonical=tex/backgroundParticles/orangeGlowParticle/spriteFrame, class=cc.ImageAsset, deps=0}；`subpackages/HomeBundle/import/tex/backgroundParticles/orangeLeafParticle/spriteFrame__2.json` {canonical=tex/backgroundParticles/orangeLeafParticle/spriteFrame, class=cc.SpriteFrame, name=orangeLeafParticle, deps=1}
- pack 样例：`subpackages/HomeBundle/import/_packs/pack/gooseTip__pack_5.json` {class=cc.SpriteFrame/cc.Node/cc.Sprite/cc.Prefab/cc.UITransform/cc.CompPrefabInfo, name=获得100只鸭子解锁/获得100只鹅解锁, deps=4}；`subpackages/HomeBundle/import/_packs/pack/home_particle__pack_3.json` {class=cc.SpriteFrame/cc.Prefab/cc.Node/cc.UITransform/cc.CompPrefabInfo/cc.Sprite, name=greenLeafParticle, deps=2}；`subpackages/HomeBundle/import/_packs/tex/homeTheme0/foreground/foregroundLayer1__pack_10.json` {class=cc.SpriteFrame, name=foregroundLayer2/foregroundLayer1/foregroundLayer4/foregroundLayer5/foregroundLayer3, deps=1}；`subpackages/HomeBundle/import/_packs/tex/unlockAt100Geese__pack_72.json` {deps=0}
- native 样例：`subpackages/HomeBundle/native/midgroundLayer2/midgroundLayer2__texture_1.png` {ext=.png}；`subpackages/HomeBundle/native/tex/backgroundParticles/greenLeafParticle/spriteFrame.png` {canonical=tex/backgroundParticles/greenLeafParticle/spriteFrame, ext=.png}；`subpackages/HomeBundle/native/tex/backgroundParticles/orangeGlowParticle/spriteFrame.png` {canonical=tex/backgroundParticles/orangeGlowParticle/spriteFrame, ext=.png}；`subpackages/HomeBundle/native/tex/backgroundParticles/orangeLeafParticle/spriteFrame.png` {canonical=tex/backgroundParticles/orangeLeafParticle/spriteFrame, ext=.png}；`subpackages/HomeBundle/native/tex/backgroundParticles/whiteGlowParticle/spriteFrame.png` {canonical=tex/backgroundParticles/whiteGlowParticle/spriteFrame, ext=.png}；`subpackages/HomeBundle/native/tex/homeTheme0/background/backgroundLayer1/spriteFrame.png` {canonical=tex/homeTheme0/background/backgroundLayer1/spriteFrame, ext=.png}

### main

- 配置：`subpackages/main/config.main.json`
- 子包入口：`subpackages/main/game.js`（root game.js 接管启动）
- 语义别名清单：`architecture/generated/subpackage-semantic-aliases/main.json`
- 依赖 bundle：start-scene
- scene 入口：`db://assets/scene/DuckScene.scene` -> 0；`db://assets/scene/FruitScene.scene` -> 1；`db://assets/scene/Game2Scene.scene` -> 3；`db://assets/scene/HomeScene.scene` -> 4；`db://assets/scene/PigeonScene.scene` -> 2
- 配置体量：packs 21，paths 5，uuids 523，versions import，native
- Bundle 根文件：config.main.json, game.js
- import JSON：122（direct 102，pack 20）
- native 文件：99
- 可删运行时文件：import 0，native 0
- 空目录：0；URL 编码路径：0
- import 顶层命名空间样例：tex (42)，_packs (20)，texture (16)，skeletalAnimations (7)，utility (6)，ui (5)
- native 顶层命名空间样例：tex (40)，texture (15)，skeletalAnimations (7)，utility (6)，ui (5)，scene (4)
- 空目录样例：无
- URL 编码路径样例：无
- direct import 样例：`subpackages/main/import/background/cloud.json` {canonical=background/cloud, class=cc.ImageAsset, deps=0}；`subpackages/main/import/background/lightGradient.json` {canonical=background/lightGradient, class=cc.ImageAsset, deps=0}；`subpackages/main/import/background/skyGradient.json` {canonical=background/skyGradient, class=cc.ImageAsset, deps=0}；`subpackages/main/import/bibiLabu/skeleton.json` {canonical=比比拉布/skeleton, class=cc.ImageAsset, deps=0}；`subpackages/main/import/daily/skeleton.json` {canonical=每日/skeleton, class=cc.ImageAsset, deps=0}；`subpackages/main/import/dave/skeleton.json` {canonical=戴夫/skeleton, class=cc.ImageAsset, deps=0}
- pack 样例：`subpackages/main/import/_packs/db/assets/scene/DuckScene/2__pack_1674.json` {class=cc.SpriteFrame/cc.Node/cc.Widget/cc.Sprite/cc.Label/cc.Button, name=木桩/背景, deps=113}；`subpackages/main/import/_packs/db/assets/scene/FruitScene/randomQuestionMark__pack_88.json` {class=cc.SpriteFrame/cc.Node/cc.Widget/cc.Label/cc.Sprite/cc.UITransform, deps=35}；`subpackages/main/import/_packs/db/assets/scene/Game2Scene/hole__pack_5.json` {class=cc.Widget/cc.Node/cc.Sprite/cc.Label/cc.Button/cc.RigidBody2D, name=洞/default_btn_pressed/default_btn_disabled, deps=50}；`subpackages/main/import/_packs/db/assets/scene/HomeScene/3__pack_124.json` {class=cc.Node/cc.Widget/cc.Sprite/cc.SpriteFrame/cc.Label/cc.Button, name=洞/default/底/火龙果鸭/柠檬鸭/西瓜鸭, deps=59}；`subpackages/main/import/_packs/db/assets/scene/PigeonScene/background__pack_7.json` {class=cc.Node/cc.SpriteFrame/cc.Widget/cc.UITransform/cc.Label/cc.Sprite, name=玉米心, deps=15}；`subpackages/main/import/_packs/pack/banner__pack_11.json` {class=cc.SpriteFrame, name=图标算数/p10/百鸭朝雀/p9/求助/鸽鸽图鉴, deps=1}
- native 样例：`subpackages/main/native/background/cloud.png` {canonical=background/cloud, ext=.png}；`subpackages/main/native/background/lightGradient.jpg` {canonical=background/lightGradient, ext=.jpg}；`subpackages/main/native/background/skyGradient.jpeg` {canonical=background/skyGradient, ext=.jpeg}；`subpackages/main/native/bibiLabu/skeleton.png` {canonical=比比拉布/skeleton, ext=.png}；`subpackages/main/native/daily/skeleton.png` {canonical=每日/skeleton, ext=.png}；`subpackages/main/native/dave/skeleton.png` {canonical=戴夫/skeleton, ext=.png}

### resources

- 配置：`subpackages/resources/config.resources.json`
- 子包入口：`subpackages/resources/game.js`（root game.js 接管启动）
- 语义别名清单：`architecture/generated/subpackage-semantic-aliases/resources.json`
- 依赖 bundle：无
- scene 入口：无
- 配置体量：packs 5，paths 27，uuids 39，versions import，native
- Bundle 根文件：config.resources.json, game.js
- import JSON：11（direct 7，pack 4）
- native 文件：3
- 可删运行时文件：import 0，native 0
- 空目录：0；URL 编码路径：0
- import 顶层命名空间样例：_packs (4)，particleEffects (3)，duck (1)，multiTexture (1)，ribbonBurst (1)，tex (1)
- native 顶层命名空间样例：particleEffects (1)，ribbonBurst (1)，tex (1)
- 空目录样例：无
- URL 编码路径样例：无
- direct import 样例：`subpackages/resources/import/duck/duckLevelTemplates.json` {canonical=duck/duckLevelTemplates, class=cc.JsonAsset, deps=0}；`subpackages/resources/import/multiTexture/sharedTextureCollection.json` {canonical=multiTexture/sharedTextureCollection, deps=0}；`subpackages/resources/import/particleEffects/colorMarker1__texture_28.json` {class=cc.ImageAsset, deps=0}；`subpackages/resources/import/particleEffects/colorMarkerParticle.json` {canonical=particleEffects/colorMarkerParticle, class=cc.Prefab/cc.Node/cc.UITransform/cc.CompPrefabInfo/cc.Sprite/cc.UIOpacity, deps=0}；`subpackages/resources/import/particleEffects/fragmentShard.json` {canonical=particleEffects/fragmentShard, class=cc.Prefab/cc.Node/cc.UITransform/cc.CompPrefabInfo/cc.Sprite/cc.RigidBody2D, deps=0}；`subpackages/resources/import/ribbonBurst/ribbon1__texture_14.json` {class=cc.ImageAsset, deps=0}
- pack 样例：`subpackages/resources/import/_packs/multiTexture/a_color__pack_59.json` {class=cc.Material/cc.EffectAsset, name=../resources/multiTexture/multiTextureEffect|sprite-vs:vert|sprite-fs:frag/USE_LOCAL/SAMPLE_FROM_RT/USE_PIXEL_ALIGNMENT/CC_USE_EMBEDDED_ALPHA/USE_ALPHA_TEST, deps=1}；`subpackages/resources/import/_packs/particleEffects/colorMarker1__pack_28.json` {class=cc.SpriteFrame, name=colorMarker2/colorMarker3/colorMarker9/colorMarker12/colorMarker8/colorMarker6, deps=1}；`subpackages/resources/import/_packs/particleEffects/deletePulseCircle/deletePulseCircle__pack_2.json` {class=cc.SpriteFrame/cc.Prefab/cc.Node/cc.UITransform/cc.CompPrefabInfo/cc.Sprite, name=deletePulseCircle, deps=2}；`subpackages/resources/import/_packs/ribbonBurst/ribbon1__pack_14.json` {class=cc.SpriteFrame, name=ribbon5/ribbon4/ribbon7/ribbon6/ribbon1/ribbon3, deps=1}
- native 样例：`subpackages/resources/native/particleEffects/colorMarker1__texture_28.png` {ext=.png}；`subpackages/resources/native/ribbonBurst/ribbon1__texture_14.png` {ext=.png}；`subpackages/resources/native/tex/circle/DeleteCircle.png` {canonical=tex/circle/DeleteCircle, ext=.png}

### uiBundle

- 配置：`subpackages/uiBundle/config.ui-bundle.json`
- 子包入口：`subpackages/uiBundle/game.js`（root game.js 接管启动）
- 语义别名清单：`architecture/generated/subpackage-semantic-aliases/uiBundle.json`
- 依赖 bundle：main
- scene 入口：无
- 配置体量：packs 37，paths 400，uuids 538，versions import，native
- Bundle 根文件：config.ui-bundle.json, game.js
- import JSON：88（direct 52，pack 36）
- native 文件：24
- 可删运行时文件：import 0，native 0
- 空目录：0；URL 编码路径：0
- import 顶层命名空间样例：_packs (36)，prefab (26)，tex (20)，restoredNames (5)，fullAnimation (1)
- native 顶层命名空间样例：tex (19)，restoredNames (4)，fullAnimation (1)
- 空目录样例：无
- URL 编码路径样例：无
- direct import 样例：`subpackages/uiBundle/import/fullAnimation/Done_for_eat.json` {canonical=吃饱动画/Done for eat, class=cc.ImageAsset, deps=0}；`subpackages/uiBundle/import/prefab/AddPowerPanel.json` {canonical=prefab/AddPowerPanel, class=cc.Node/cc.Sprite/cc.Widget/cc.Button/cc.Prefab/cc.UITransform, deps=11}；`subpackages/uiBundle/import/prefab/AddProgramPanel.json` {canonical=prefab/AddProgramPanel, class=cc.Node/cc.Sprite/cc.Widget/cc.Button/cc.Prefab/cc.UITransform, deps=6}；`subpackages/uiBundle/import/prefab/AddTableUI.json` {canonical=prefab/AddTableUI, class=cc.Node/cc.Sprite/cc.UITransform/cc.Widget/cc.Button/cc.Prefab, deps=11}；`subpackages/uiBundle/import/prefab/AwemeUI.json` {canonical=prefab/AwemeUI, class=cc.Node/cc.Sprite/cc.UITransform/cc.Widget/cc.Button/cc.Prefab, deps=10}；`subpackages/uiBundle/import/prefab/BookPigeonUI.json` {canonical=prefab/BookPigeonUI, class=cc.Node/cc.Sprite/cc.UITransform/cc.Widget/cc.PrefabInfo/cc.Prefab, deps=4}
- pack 样例：`subpackages/uiBundle/import/_packs/gooseSuccessNumber/gooseSuccessNumber__pack_1.json` {class=cc.SpriteFrame/cc.LabelAtlas, name=成功成鹅数字, deps=2}；`subpackages/uiBundle/import/_packs/pack/callFriend__pack_15.json` {class=cc.SpriteFrame, name=百鸭朝雀/百鹅朝鹏/更多玩法/百鹅朝麟/鸽鸽图鉴/添加桌面, deps=1}；`subpackages/uiBundle/import/_packs/prefab/OverUI/reviveNumber__pack_2.json` {class=cc.Node/cc.Sprite/cc.Widget/cc.UITransform/cc.Label/cc.UIOpacity, name=复活数字, deps=29}；`subpackages/uiBundle/import/_packs/prefab/SuccessUI/arm__pack_21.json` {class=cc.Node/cc.Sprite/cc.Widget/sp.Skeleton/cc.UITransform/cc.UIOpacity, name=face1/default, deps=35}；`subpackages/uiBundle/import/_packs/settingsDialogNumber/settingsDialogNumber__pack_1.json` {class=cc.SpriteFrame/cc.LabelAtlas, name=设置二级数字, deps=2}；`subpackages/uiBundle/import/_packs/staminaCount/staminaCount__pack_1.json` {class=cc.SpriteFrame/cc.LabelAtlas, name=体力数, deps=2}
- native 样例：`subpackages/uiBundle/native/fullAnimation/Done_for_eat.png` {canonical=吃饱动画/Done for eat, ext=.png}；`subpackages/uiBundle/native/restoredNames/blackOutlineNumberStrip.png` {canonical=恢复命名/黑边数字条, ext=.png}；`subpackages/uiBundle/native/restoredNames/whiteBlockStrip.png` {canonical=恢复命名/白色块状条, ext=.png}；`subpackages/uiBundle/native/restoredNames/whiteHorizontalBar.png` {canonical=恢复命名/白色横线条, ext=.png}；`subpackages/uiBundle/native/restoredNames/whiteNumberStrip.png` {canonical=恢复命名/白色数字条, ext=.png}；`subpackages/uiBundle/native/tex/autoUi/frame__texture_12.png` {ext=.png}

