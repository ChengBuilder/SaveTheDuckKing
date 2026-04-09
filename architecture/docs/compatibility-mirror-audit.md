# 兼容镜像审计（自动生成）

> 本文件由 `architecture/tools/generate-compatibility-mirror-audit.js` 生成。

## 结论

- `assets/*bundle` / `assets/*Bundlebundle` 当前主要承担微信开发者工具兼容入口角色。
- 若 `import/native` 文件都能通过运行时重定向落到 canonical 目录，则这些镜像目录可以收缩为“只保留 config/index 的薄壳目录”。
- 本次检查结果：`unresolved files = 0`。

## 汇总

| 项目 | 数量 |
| --- | ---: |
| 兼容镜像目录数 | 16 |
| import 镜像文件数 | 0 |
| native 镜像文件数 | 0 |
| import 镜像体积（bytes） | 0 |
| native 镜像体积（bytes） | 0 |
| 未覆盖文件数 | 0 |

## 目录明细

### assets/duckbundle

- 类型：subpackage-compat-mirror
- canonical 前缀：`subpackages/DuckBundle/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/DuckBundlebundle

- 类型：subpackage-compat-mirror
- canonical 前缀：`subpackages/DuckBundle/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/game2bundle

- 类型：subpackage-compat-mirror
- canonical 前缀：`subpackages/Game2Bundle/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/Game2Bundlebundle

- 类型：subpackage-compat-mirror
- canonical 前缀：`subpackages/Game2Bundle/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/homebundle

- 类型：subpackage-compat-mirror
- canonical 前缀：`subpackages/HomeBundle/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/HomeBundlebundle

- 类型：subpackage-compat-mirror
- canonical 前缀：`subpackages/HomeBundle/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/anibundle

- 类型：subpackage-compat-mirror
- canonical 前缀：`subpackages/aniBundle/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/aniBundlebundle

- 类型：subpackage-compat-mirror
- canonical 前缀：`subpackages/aniBundle/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/audiobundle

- 类型：subpackage-compat-mirror
- canonical 前缀：`subpackages/audioBundle/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/audioBundlebundle

- 类型：subpackage-compat-mirror
- canonical 前缀：`subpackages/audioBundle/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/mainbundle

- 类型：subpackage-compat-mirror
- canonical 前缀：`subpackages/main/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/resourcesbundle

- 类型：subpackage-compat-mirror
- canonical 前缀：`subpackages/resources/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/uibundle

- 类型：subpackage-compat-mirror
- canonical 前缀：`subpackages/uiBundle/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/uiBundlebundle

- 类型：subpackage-compat-mirror
- canonical 前缀：`subpackages/uiBundle/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/internalbundle

- 类型：root-bundle-compat-mirror
- canonical 前缀：`assets/internal/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

### assets/start-scenebundle

- 类型：root-bundle-compat-mirror
- canonical 前缀：`assets/start-scene/`
- 保留顶层文件：`config.json`，`index.js`
- import 目录：不存在
- import 目标样例：无
- import 未覆盖样例：无
- native 目录：不存在
- native 目标样例：无
- native 未覆盖样例：无
- 可删目录：无

