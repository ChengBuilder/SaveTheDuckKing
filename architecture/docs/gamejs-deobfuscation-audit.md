# game.js 反混淆审计报告

> 本文件由 `architecture/tools/generate-gamejs-deobfuscation-audit.js` 生成。

## 总览
- 来源：`game.js`
- define 模块总数：51
- 严格根模块数（仅顶层 require）：1
- 启发式根模块数（小游戏运行入口补齐）：50
- 分析根模块数（严格 + 启发式）：51
- 严格可达模块数：1
- 严格不可达模块数：50
- 保守不可达模块数（剔除动态入口后仍不可达）：0
- 壳模块候选数：0
- 高混淆热点数：14
- 硬编码死分支模块数：0

## 严格 Root Modules
- `game.js`

## 启发式 Root Modules
- `@babel/runtime/helpers/Arrayincludes.js`
- `@babel/runtime/helpers/Objectentries.js`
- `@babel/runtime/helpers/arrayLikeToArray.js`
- `@babel/runtime/helpers/createForOfIteratorHelper.js`
- `@babel/runtime/helpers/regeneratorRuntime.js`
- `@babel/runtime/helpers/typeof.js`
- `@babel/runtime/helpers/unsupportedIterableToArray.js`
- `application-main.js`
- `assets/DuckBundlebundle/index.js`
- `assets/Game2Bundlebundle/index.js`
- `assets/HomeBundlebundle/index.js`
- `assets/aniBundlebundle/index.js`
- `assets/anibundle/index.js`
- `assets/audioBundlebundle/index.js`
- `assets/audiobundle/index.js`
- `assets/duckbundle/index.js`
- `assets/game2bundle/index.js`
- `assets/homebundle/index.js`
- `assets/internal/index.internal.js`
- `assets/internal/index.js`
- `assets/internalbundle/index.js`
- `assets/mainbundle/index.js`
- `assets/resourcesbundle/index.js`
- `assets/start-scene/index.js`
- `assets/start-scene/index.start-scene.js`
- `assets/start-scenebundle/index.js`
- `assets/uiBundlebundle/index.js`
- `assets/uibundle/index.js`
- `cocos-js/_virtual_cc-cf1p7Jgo.js`
- `cocos-js/cc.1e1cd.js`
- `cocos-js/spine-BGFFnNyc.js`
- `cocos-js/spine.asm-DxRECbrD.js`
- `cocos-js/spine.js-1Pcan4ap.js`
- `cocos-js/spine.wasm-CKrzExoH.js`
- `engine-adapter.js`
- `first-screen.js`
- `src/chunks/game-scripts.js`
- `src/import-map.ae243.js`
- `src/polyfills.bundle.43263.js`
- `src/system.bundle.f45da.js`
- `subpackages-bootstrap.js`
- `subpackages/DuckBundle/game.js`
- `subpackages/Game2Bundle/game.js`
- `subpackages/HomeBundle/game.js`
- `subpackages/aniBundle/game.js`
- `subpackages/audioBundle/game.js`
- `subpackages/main/game.js`
- `subpackages/resources/game.js`
- `subpackages/uiBundle/game.js`
- `web-adapter.js`

## 保守不可达模块（高优先级候选死代码）
- 无

## 壳模块候选
- 无

## 硬编码死分支信号
- 无

## 高混淆热点
| 模块 | 声明变量数 | 短变量数 | 短变量比例 | 最大行长 |
| --- | ---: | ---: | ---: | ---: |
| `engine-adapter.js` | 135 | 135 | 1 | 20317 |
| `assets/internal/index.internal.js` | 76 | 76 | 1 | 8040 |
| `src/polyfills.bundle.43263.js` | 166 | 165 | 0.994 | 8507 |
| `src/system.bundle.f45da.js` | 144 | 143 | 0.9931 | 8589 |
| `@babel/runtime/helpers/regeneratorRuntime.js` | 73 | 72 | 0.9863 | 6771 |
| `cocos-js/spine.wasm-CKrzExoH.js` | 214 | 209 | 0.9766 | 22284 |
| `assets/start-scene/index.start-scene.js` | 6224 | 6060 | 0.9737 | 360034 |
| `src/chunks/game-scripts.js` | 31 | 30 | 0.9677 | 3757 |
| `cocos-js/_virtual_cc-cf1p7Jgo.js` | 21778 | 20329 | 0.9335 | 1886612 |
| `application-main.js` | 14 | 13 | 0.9286 | 1641 |
| `subpackages-bootstrap.js` | 128 | 118 | 0.9219 | 6851 |
| `@babel/runtime/helpers/createForOfIteratorHelper.js` | 8 | 7 | 0.875 | 806 |
| `first-screen.js` | 39 | 32 | 0.8205 | 3675 |
| `web-adapter.js` | 595 | 488 | 0.8202 | 87313 |

