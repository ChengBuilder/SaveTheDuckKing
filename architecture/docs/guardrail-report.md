# 护栏检查报告（自动生成）

> 本文件由 `architecture/tools/run-guardrails.js` 生成。

## 总览
- 最近执行时间：2026-04-09T09:29:32.000Z
- 项目目录：`./`
- 已执行步骤：39
- 通过步骤：39
- 失败步骤：0

## 步骤明细
| 步骤 | 状态 | 耗时（ms） | 命令 |
| --- | --- | ---: | --- |
| 主入口语法检查 | 通过 | 85 | `node -c game.js` |
| 启动编排语法检查 | 通过 | 50 | `node -c architecture/boot/game-bootstrap.js` |
| 启动配置语法检查 | 通过 | 50 | `node -c architecture/boot/config.js` |
| 启动安全语法检查 | 通过 | 48 | `node -c architecture/boot/boot-safety.js` |
| 启动观测语法检查 | 通过 | 49 | `node -c architecture/boot/boot-observer.js` |
| 启动恢复策略语法检查 | 通过 | 50 | `node -c architecture/boot/recovery-strategy.js` |
| 运行时上下文语法检查 | 通过 | 51 | `node -c architecture/boot/global-context.js` |
| 启动日志语法检查 | 通过 | 50 | `node -c architecture/boot/boot-logger.js` |
| 平台策略语法检查 | 通过 | 52 | `node -c architecture/boot/platform-strategy.js` |
| 性能策略语法检查 | 通过 | 51 | `node -c architecture/boot/performance-strategy.js` |
| 运行时治理语法检查 | 通过 | 53 | `node -c architecture/boot/runtime-governance.js` |
| 系统信息语法检查 | 通过 | 50 | `node -c architecture/boot/system-info.js` |
| 渲染策略语法检查 | 通过 | 52 | `node -c architecture/boot/render-policies.js` |
| 运行桥接语法检查 | 通过 | 51 | `node -c architecture/boot/runtime-bridge.js` |
| 应用生命周期语法检查 | 通过 | 51 | `node -c architecture/boot/app-lifecycle.js` |
| 资源路径规范化语法检查 | 通过 | 51 | `node -c architecture/boot/asset-path-normalizer.js` |
| 项目路径策略语法检查 | 通过 | 51 | `node -c architecture/tools/project-paths.js` |
| 关键 JSON 格式化工具语法检查 | 通过 | 49 | `node -c architecture/tools/format-project-json.js` |
| Bundle 资产目录工具语法检查 | 通过 | 49 | `node -c architecture/tools/generate-bundle-asset-catalog.js` |
| UUID 资产审计工具语法检查 | 通过 | 50 | `node -c architecture/tools/generate-uuid-asset-report.js` |
| 素材可读性审计工具语法检查 | 通过 | 49 | `node -c architecture/tools/generate-asset-readability-audit.js` |
| 音频使用审计工具语法检查 | 通过 | 49 | `node -c architecture/tools/generate-audio-usage-audit.js` |
| 子包结构审计工具语法检查 | 通过 | 50 | `node -c architecture/tools/generate-subpackage-structure-audit.js` |
| 兼容镜像审计工具语法检查 | 通过 | 50 | `node -c architecture/tools/generate-compatibility-mirror-audit.js` |
| 微信小游戏结构校验语法检查 | 通过 | 50 | `node -c architecture/tools/verify-wechat-minigame-structure.js` |
| DuckBundle 木板语义化工具语法检查 | 通过 | 50 | `node -c architecture/tools/semanticize-duckbundle-wood-assets.js` |
| DuckBundle 背景语义化工具语法检查 | 通过 | 64 | `node -c architecture/tools/semanticize-duckbundle-background-assets.js` |
| DuckBundle 季节背景语义化工具语法检查 | 通过 | 50 | `node -c architecture/tools/semanticize-duckbundle-seasonal-background-assets.js` |
| HomeBundle 素材语义化工具语法检查 | 通过 | 51 | `node -c architecture/tools/semanticize-homebundle-assets.js` |
| uiBundle 图鉴皮肤页语义化工具语法检查 | 通过 | 49 | `node -c architecture/tools/semanticize-uibundle-book-skin-assets.js` |
| uiBundle 设置模块语义化工具语法检查 | 通过 | 49 | `node -c architecture/tools/semanticize-uibundle-settings-assets.js` |
| 旧路径兼容校验工具语法检查 | 通过 | 52 | `node -c architecture/tools/check-legacy-runtime-compat.js` |
| 迭代报告生成器语法检查 | 通过 | 50 | `node -c architecture/tools/generate-iteration-report.js` |
| 迭代流水线语法检查 | 通过 | 52 | `node -c architecture/tools/run-iteration-cycle.js` |
| 架构风格检查 | 通过 | 58 | `node architecture/tools/check-architecture-style.js` |
| 素材分层检查 | 通过 | 100 | `node architecture/tools/check-asset-code-separation.js` |
| 旧路径运行时兼容检查 | 通过 | 76 | `node architecture/tools/check-legacy-runtime-compat.js` |
| 微信小游戏结构校验 | 通过 | 67 | `node architecture/tools/verify-wechat-minigame-structure.js` |
| 运行安全校验 | 通过 | 66 | `node architecture/tools/verify-runtime-safety.js` |

## 失败信息
- 无

