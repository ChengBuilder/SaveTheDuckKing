# UUID 资产审计报告（自动生成）

> 本文件由 `architecture/tools/generate-uuid-asset-report.js` 生成。

## 总览
- 生成时间：2026-04-08T15:18:23.759Z
- Bundle 数：10
- canonical 资产记录数：2293
- config UUID 记录数：3027
- import 编译文件数：1299
- native 编译文件数：660
- 直连 import JSON：0
- pack 承载资产数：968
- 缺失 import JSON 映射：1325
- 已命中 native 文件：0
- 未命中 import 文件：1233
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
| `DuckBundle` | 1227 | 1251 | 708 | 335 | 12 | 820 | 696 | 335 |
| `Game2Bundle` | 161 | 175 | 67 | 15 | 5 | 73 | 62 | 15 |
| `HomeBundle` | 231 | 239 | 149 | 74 | 4 | 149 | 145 | 74 |
| `aniBundle` | 156 | 159 | 86 | 42 | 2 | 134 | 84 | 42 |
| `audioBundle` | 65 | 65 | 65 | 65 | 0 | 65 | 65 | 65 |
| `main` | 5 | 523 | 122 | 99 | 21 | 0 | 117 | 99 |
| `resources` | 27 | 39 | 11 | 3 | 5 | 3 | 7 | 3 |
| `uiBundle` | 400 | 538 | 89 | 24 | 37 | 81 | 57 | 24 |

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
- pack 承载资产：407
- 缺失 import JSON：820
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
- pack 文件样例：
  - `01853a000` -> `import/01853a000.6934c.json` / 资产数 2
  - `0227bf610` -> `import/0227bf610.11f04.json` / 资产数 3
  - `045b20c10` -> `import/045b20c10.e4f07.json` / 资产数 7
  - `063e0e14c` -> `import/063e0e14c.01d40.json` / 资产数 2
  - `06de34f87` -> `import/06de34f87.9473a.json` / 资产数 36
- 未命中 import 文件样例：`import/02cc6743-eb92-47b2-bd0a-c3bc58df2455.a2533.json`，`import/02cc6743-eb92-47b2-bd0a-c3bc58df2455@f9941.50eff.json`，`import/036443be-b646-4581-af1d-b0905c25a9bb.a2533.json`，`import/036443be-b646-4581-af1d-b0905c25a9bb@f9941.b11d2.json`，`import/04ab37f9-e6df-4484-8acf-c37edd95bc26.a2533.json`，`import/04ab37f9-e6df-4484-8acf-c37edd95bc26@f9941.60bf0.json`，`import/0798ff36-6460-4cc2-94a3-462024eaa7c0.f242b.json`，`import/07e9a187-8f4e-445a-85f2-34df1ecdc7ce.a2533.json`
- 未命中 native 文件样例：`native/02cc6743-eb92-47b2-bd0a-c3bc58df2455.65d8e.png`，`native/036443be-b646-4581-af1d-b0905c25a9bb.da5af.png`，`native/04ab37f9-e6df-4484-8acf-c37edd95bc26.99681.png`，`native/07e9a187-8f4e-445a-85f2-34df1ecdc7ce.e4c49.png`，`native/085c930f-0233-42dd-954f-ed398494f9ff.b7a25.png`，`native/086e0f59-d5ae-4610-b388-5b44c2f3fa05.76a8c.png`，`native/0878eef6-bcc6-4dc0-8eb8-1f2b2bad4935.166ce.png`，`native/0ae9a4bb-15a4-4800-9869-300f5e89c683.f4904.png`

## Game2Bundle
- 配置：`subpackages/Game2Bundle/config.game2-bundle.json`
- 目录：`subpackages/Game2Bundle`
- 资产记录：161
- UUID 记录：175
- 直连 import JSON：0
- pack 承载资产：88
- 缺失 import JSON：73
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
- pack 文件样例：
  - `018ba27f0` -> `import/018ba27f0.b241d.json` / 资产数 15
  - `064e4764d` -> `import/064e4764d.af1d3.json` / 资产数 36
  - `094fe2b70` -> `import/094fe2b70.6217c.json` / 资产数 32
  - `097fea458` -> `import/097fea458.3a271.json` / 资产数 7
  - `0f648df8a` -> `import/0f648df8a.bc71f.json` / 资产数 2
- 未命中 import 文件样例：`import/04347e9f-92dc-4a0d-8650-1a2e1a5676f1.8d917.json`，`import/0ab23018-5863-4aa5-9a81-98767146624b.d7508.json`，`import/1024541f-022d-4a4a-819a-e04b2fddb93b.8958a.json`，`import/13fe0656-aa95-45bb-ac0d-01c749038722.bab33.json`，`import/164e4764d.890c7.json`，`import/1673fb44-6b76-40f8-a0d4-13b4dc742b6b.3b3b6.json`，`import/194fe2b70.fe3de.json`，`import/197fea458.55534.json`
- 未命中 native 文件样例：`native/164e4764d.8140c.png`，`native/194fe2b70.99882.png`，`native/197fea458.91bf5.png`，`native/1c169947-9a9e-480e-ae4a-140c6c43d8aa.adf70.png`，`native/1f648df8a.8e64d.png`，`native/27e589a4-4bc4-440b-a9fd-ad188eba74f1.abf46.png`，`native/2e6e94df-891a-4b01-8693-507ae2e8ffb8.02720.jpg`，`native/461ede23-9d67-4e1d-b5fa-54a0f67cd3f8.8a031.png`

## HomeBundle
- 配置：`subpackages/HomeBundle/config.home-bundle.json`
- 目录：`subpackages/HomeBundle`
- 资产记录：231
- UUID 记录：239
- 直连 import JSON：0
- pack 承载资产：82
- 缺失 import JSON：149
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
- pack 文件样例：
  - `03924e66f` -> `import/03924e66f.34cb2.json` / 资产数 2
  - `07efff0f9` -> `import/07efff0f9.9f8f9.json` / 资产数 5
  - `0aab58136` -> `import/0aab58136.84ea8.json` / 资产数 3
  - `0de7fa31f` -> `import/0de7fa31f.ef3cc.json` / 资产数 74
- 未命中 import 文件样例：`import/00b2f448-fd39-4b00-a1fa-42528b6752ca.a2533.json`，`import/00b2f448-fd39-4b00-a1fa-42528b6752ca@f9941.9cade.json`，`import/01457198-91b3-4563-a986-6d565250f877.a2533.json`，`import/037589a7-07a8-4c55-99aa-782590c0cff2.a2533.json`，`import/037589a7-07a8-4c55-99aa-782590c0cff2@f9941.e20f7.json`，`import/04566ce2-0854-4a7d-80cc-14e1a6cf668b.c16a8.json`，`import/04566ce2-0854-4a7d-80cc-14e1a6cf668b@f9941.6c22c.json`，`import/0d1516fd-e805-48a6-971d-2d50055e97c1.a2533.json`
- 未命中 native 文件样例：`native/00b2f448-fd39-4b00-a1fa-42528b6752ca.a9e2f.png`，`native/01457198-91b3-4563-a986-6d565250f877.fcb5c.png`，`native/037589a7-07a8-4c55-99aa-782590c0cff2.aa254.png`，`native/04566ce2-0854-4a7d-80cc-14e1a6cf668b.3e2c9.jpg`，`native/0d1516fd-e805-48a6-971d-2d50055e97c1.c4b2a.png`，`native/116a25be3.d6eeb.png`，`native/149f66e7-869d-4be7-99cb-8e9c92321525.89125.png`，`native/1721d8ac-4cf9-4893-bd87-ad44595ad1e1.917ee.png`

## aniBundle
- 配置：`subpackages/aniBundle/config.animation-bundle.json`
- 目录：`subpackages/aniBundle`
- 资产记录：156
- UUID 记录：159
- 直连 import JSON：0
- pack 承载资产：22
- 缺失 import JSON：134
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
- pack 文件样例：
  - `0a3d48d62` -> `import/0a3d48d62.f4943.json` / 资产数 17
  - `0f70c22cd` -> `import/0f70c22cd.3965d.json` / 资产数 5
- 未命中 import 文件样例：`import/00748592-63a6-4108-a839-69028365dd22.a2533.json`，`import/00748592-63a6-4108-a839-69028365dd22@f9941.1fd31.json`，`import/0599c030-38ec-4e55-8ec6-e400c1f90e7d@f9941.59117.json`，`import/07ced7bf-caa1-4d01-96df-b286a9fa9924.621e2.json`，`import/090b3eee-0a78-4e40-96f8-f4b42cef2146.a2533.json`，`import/090b3eee-0a78-4e40-96f8-f4b42cef2146@f9941.000ef.json`，`import/09d91ef2-7134-4514-a845-dfb11a5846cb.a2533.json`，`import/09d91ef2-7134-4514-a845-dfb11a5846cb@f9941.bd616.json`
- 未命中 native 文件样例：`native/00748592-63a6-4108-a839-69028365dd22.43e91.png`，`native/07ced7bf-caa1-4d01-96df-b286a9fa9924.1d751.atlas`，`native/090b3eee-0a78-4e40-96f8-f4b42cef2146.58c31.png`，`native/09d91ef2-7134-4514-a845-dfb11a5846cb.3c7d7.png`，`native/0c037270-d1a8-4b36-81af-908e7350f5cb.24685.atlas`，`native/14609467-055d-4d63-8af1-406a624f9889.67f0b.atlas`，`native/24966e82-a9b5-4fbd-8b16-3c7d4ba20fc4.e9d07.atlas`，`native/2dba4078-9361-4d12-bd36-3fa59e21875b.01f3d.atlas`

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
- 未命中 import 文件样例：`import/05f0576d-20ca-45e5-8cac-7bde0505a9ef.7447a.json`，`import/099bc925-a0f0-485a-be12-49e4e0b69297.7cc67.json`，`import/0b114abf-f089-44f0-9904-c46a707e665d.205d7.json`，`import/0d4b6f77-3e37-433d-a761-d2301d183f8d.89c2f.json`，`import/12c1b8af-48d2-46ee-a695-c172e4402e83.05ac1.json`，`import/198fd24d-fe85-473b-a3c3-e4715b9a8da9.20804.json`，`import/22a6dd72-d08b-46c9-9da5-5d2a4fefacc2.a0322.json`，`import/22ab7843-385b-4773-ab9b-1adce8b8584a.ca4d9.json`
- 未命中 native 文件样例：`native/05f0576d-20ca-45e5-8cac-7bde0505a9ef.55bc0.mp3`，`native/099bc925-a0f0-485a-be12-49e4e0b69297.a30dd.mp3`，`native/0b114abf-f089-44f0-9904-c46a707e665d.9f029.mp3`，`native/0d4b6f77-3e37-433d-a761-d2301d183f8d.2db3c.mp3`，`native/12c1b8af-48d2-46ee-a695-c172e4402e83.aed63.mp3`，`native/198fd24d-fe85-473b-a3c3-e4715b9a8da9.e3362.mp3`，`native/22a6dd72-d08b-46c9-9da5-5d2a4fefacc2.79192.mp3`，`native/22ab7843-385b-4773-ab9b-1adce8b8584a.5d1ca.mp3`

## main
- 配置：`subpackages/main/config.main.json`
- 目录：`subpackages/main`
- 资产记录：5
- UUID 记录：523
- 直连 import JSON：0
- pack 承载资产：5
- 缺失 import JSON：0
- native 命中：0
- 主要资产类型：cc.SceneAsset x 5
- 样例资产映射：
  - `db:/assets/scene/DuckScene` / cc.SceneAsset / packed-import-json / import -> `import/03f2b8907.9b682.json`
  - `db:/assets/scene/FruitScene` / cc.SceneAsset / packed-import-json / import -> `import/0749c9f40.f0bee.json`
  - `db:/assets/scene/PigeonScene` / cc.SceneAsset / packed-import-json / import -> `import/01bfaaa23.70d60.json`
  - `db:/assets/scene/Game2Scene` / cc.SceneAsset / packed-import-json / import -> `import/04e7c26e4.34704.json`
  - `db:/assets/scene/HomeScene` / cc.SceneAsset / packed-import-json / import -> `import/0642fb2f4.5c3df.json`
- pack 文件样例：
  - `015216800` -> `import/015216800.ab208.json` / 资产数 8
  - `01bfaaa23` -> `import/01bfaaa23.70d60.json` / 资产数 7
  - `01d37c23d` -> `import/01d37c23d.a271f.json` / 资产数 37
  - `0353ef82c` -> `import/0353ef82c.cc362.json` / 资产数 10
  - `0361f2d0d` -> `import/0361f2d0d.36476.json` / 资产数 15
- 未命中 import 文件样例：`import/00a7ff24-ffbd-42d7-8597-8d1d451f0256.a2533.json`，`import/015216800.ab208.json`，`import/01d37c23d.a271f.json`，`import/02a38064-da00-4ca7-a93b-3e53c6ce5879.c16a8.json`，`import/02c960b2-a56d-4aab-a517-3ba441a0a458.a2533.json`，`import/0353ef82c.cc362.json`，`import/0361f2d0d.36476.json`，`import/039c4b6f8.04133.json`
- 未命中 native 文件样例：`native/00a7ff24-ffbd-42d7-8597-8d1d451f0256.aefba.png`，`native/02a38064-da00-4ca7-a93b-3e53c6ce5879.f4890.jpg`，`native/02c960b2-a56d-4aab-a517-3ba441a0a458.5e971.png`，`native/0599c030-38ec-4e55-8ec6-e400c1f90e7d.4a56d.png`，`native/062b1717-90b0-4678-aec0-84cced2a3125.d699c.png`，`native/0b5ae392-fde5-47c3-be1d-684f495939fb.4f74e.png`，`native/115216800.b4036.png`，`native/11d37c23d.04f4b.png`

## resources
- 配置：`subpackages/resources/config.resources.json`
- 目录：`subpackages/resources`
- 资产记录：27
- UUID 记录：39
- 直连 import JSON：0
- pack 承载资产：24
- 缺失 import JSON：3
- native 命中：0
- 主要资产类型：cc.SpriteFrame x 21，cc.Prefab x 3，cc.EffectAsset x 1，cc.JsonAsset x 1，cc.Material x 1
- 样例资产映射：
  - `particleEffects/colorMarker2/spriteFrame` / cc.SpriteFrame / packed-import-json / import -> `import/0ff002d21.804a9.json`
  - `particleEffects/colorMarkerParticle` / cc.Prefab / missing-import-json
  - `ribbonBurst/ribbon5/spriteFrame` / cc.SpriteFrame / packed-import-json / import -> `import/08a2f272f.11063.json`
  - `particleEffects/fragmentShard` / cc.Prefab / missing-import-json
  - `particleEffects/colorMarker3/spriteFrame` / cc.SpriteFrame / packed-import-json / import -> `import/0ff002d21.804a9.json`
  - `particleEffects/colorMarker9/spriteFrame` / cc.SpriteFrame / packed-import-json / import -> `import/0ff002d21.804a9.json`
  - `multiTexture/multiTextureMaterial` / cc.Material / packed-import-json / import -> `import/03ccd410a.a3f7a.json`
  - `particleEffects/colorMarker12/spriteFrame` / cc.SpriteFrame / packed-import-json / import -> `import/0ff002d21.804a9.json`
- pack 文件样例：
  - `03ccd410a` -> `import/03ccd410a.a3f7a.json` / 资产数 2
  - `0895e4eee` -> `import/0895e4eee.ba01e.json` / 资产数 3
  - `08a2f272f` -> `import/08a2f272f.11063.json` / 资产数 7
  - `09efe5537` -> `import/09efe5537.f73e5.json` / 资产数 2
  - `0ff002d21` -> `import/0ff002d21.804a9.json` / 资产数 14
- 未命中 import 文件样例：`import/0895e4eee.ba01e.json`，`import/1863cabe-3984-478c-81c9-d17b5d5e7585.374d4.json`，`import/18a2f272f.a69ef.json`，`import/1ff002d21.bb82a.json`，`import/2d216e91-2320-4f38-b8f8-6518920a83af.04064.json`，`import/4423cbfc-6924-404e-b6c4-505fb57e25e7.a2533.json`，`import/57bbc929-3902-4764-a818-a30c094275b7.6d82b.json`
- 未命中 native 文件样例：`native/18a2f272f.53b29.png`，`native/1ff002d21.02b34.png`，`native/4423cbfc-6924-404e-b6c4-505fb57e25e7.84bd9.png`

## uiBundle
- 配置：`subpackages/uiBundle/config.ui-bundle.json`
- 目录：`subpackages/uiBundle`
- 资产记录：400
- UUID 记录：538
- 直连 import JSON：0
- pack 承载资产：319
- 缺失 import JSON：81
- native 命中：0
- 主要资产类型：cc.SpriteFrame x 336，cc.Prefab x 28，cc.ImageAsset x 18，cc.Texture2D x 18
- 样例资产映射：
  - `tex/过关页面/还差/spriteFrame` / cc.SpriteFrame / packed-import-json / import -> `import/052454659.70912.json`
  - `tex/book/duck/y30/spriteFrame` / cc.SpriteFrame / packed-import-json / import -> `import/0f39bd2b3.1b964.json`
  - `tex/过关页面/成功进度/只鸭解锁百鸭朝雀/spriteFrame` / cc.SpriteFrame / packed-import-json / import -> `import/0756253c6.7ea42.json`
  - `tex/settings/giveUpChallengeText/spriteFrame` / cc.SpriteFrame / packed-import-json / import -> `import/010f053dc.147d8.json`
  - `tex/更多玩法/图标算数/spriteFrame` / cc.SpriteFrame / packed-import-json / import -> `import/0e7790d59.eb634.json`
  - `tex/book/tex/全部/spriteFrame` / cc.SpriteFrame / packed-import-json / import -> `import/0d8faeafa.f5f0a.json`
  - `tex/主页素材/排行榜/名次底2/spriteFrame` / cc.SpriteFrame / packed-import-json / import -> `import/0b11118e2.28a6b.json`
  - `tex/失败页面/继续挑战/spriteFrame` / cc.SpriteFrame / packed-import-json / import -> `import/01775311c.4f4ad.json`
- pack 文件样例：
  - `010f053dc` -> `import/010f053dc.147d8.json` / 资产数 17
  - `01775311c` -> `import/01775311c.4f4ad.json` / 资产数 6
  - `018f90870` -> `import/018f90870.fbeef.json` / 资产数 2
  - `02300d1e9` -> `import/02300d1e9.ec414.json` / 资产数 3
  - `028d38f65` -> `import/028d38f65.dfa3c.json` / 资产数 2
- 未命中 import 文件样例：`import/018f90870.fbeef.json`，`import/0494ec16-4da2-4b69-b7ec-b42b369e33f7.e8f5b.json`，`import/08df2582e.7b181.json`，`import/09c0a018-4991-4b44-8f30-0783f03ffa16@f9941.4983f.json`，`import/0a10d91be.16d4a.json`，`import/0a38894c-9efd-4112-8fc6-1d772ce7cf70.a2533.json`，`import/0c25ecc07.130da.json`，`import/0e8aed288.d7fa8.json`
- 未命中 native 文件样例：`native/0a38894c-9efd-4112-8fc6-1d772ce7cf70.612a0.png`，`native/110f053dc.60f9d.png`，`native/11775311c.7f6b6.png`，`native/12300d1e9.f211e.png`，`native/128d38f65.97cc6.png`，`native/152454659.56575.png`，`native/1624fb9f0.ec36f.png`，`native/17fa6a7f4.9a077.png`

## 结果文件
- Markdown：`architecture/docs/uuid-asset-report.md`
- JSON：`architecture/docs/uuid-asset-report.json`

