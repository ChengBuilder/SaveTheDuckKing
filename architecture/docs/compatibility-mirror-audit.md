# 兼容镜像审计（自动生成）

> 本文件由 `architecture/tools/generate-compatibility-mirror-audit.js` 生成。

## 结论

- 当前仅保留 root 兼容镜像目录：`assets/internalbundle`、`assets/start-scenebundle`。
- 若 `import/native` 文件都能通过运行时重定向落到 canonical 目录，则镜像目录可以继续收缩为“只保留 config/index 的薄壳目录”。
- 本次检查结果：`unresolved files = 0`。

## 汇总

| 项目 | 数量 |
| --- | ---: |
| 兼容镜像目录数 | 2 |
| import 镜像文件数 | 0 |
| native 镜像文件数 | 0 |
| import 镜像体积（bytes） | 0 |
| native 镜像体积（bytes） | 0 |
| 未覆盖文件数 | 0 |

## 目录明细

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

