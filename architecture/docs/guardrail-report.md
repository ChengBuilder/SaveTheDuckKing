# 护栏检查报告（自动生成）

> 本文件由 `architecture/tools/run-guardrails.js` 生成。

## 总览
- 最近执行时间：2026-04-08T07:56:16.276Z
- 项目目录：`./`
- 已执行步骤：24
- 通过步骤：24
- 失败步骤：0

## 步骤明细
| 步骤 | 状态 | 耗时（ms） | 命令 |
| --- | --- | ---: | --- |
| 主入口语法检查 | 通过 | 83 | `node -c game.js` |
| 启动编排语法检查 | 通过 | 48 | `node -c architecture/boot/game-bootstrap.js` |
| 启动配置语法检查 | 通过 | 50 | `node -c architecture/boot/config.js` |
| 启动安全语法检查 | 通过 | 51 | `node -c architecture/boot/boot-safety.js` |
| 启动观测语法检查 | 通过 | 49 | `node -c architecture/boot/boot-observer.js` |
| 启动恢复策略语法检查 | 通过 | 51 | `node -c architecture/boot/recovery-strategy.js` |
| 运行时上下文语法检查 | 通过 | 47 | `node -c architecture/boot/global-context.js` |
| 启动日志语法检查 | 通过 | 49 | `node -c architecture/boot/boot-logger.js` |
| 平台策略语法检查 | 通过 | 49 | `node -c architecture/boot/platform-strategy.js` |
| 性能策略语法检查 | 通过 | 50 | `node -c architecture/boot/performance-strategy.js` |
| 系统信息语法检查 | 通过 | 48 | `node -c architecture/boot/system-info.js` |
| 渲染策略语法检查 | 通过 | 49 | `node -c architecture/boot/render-policies.js` |
| 运行桥接语法检查 | 通过 | 47 | `node -c architecture/boot/runtime-bridge.js` |
| 应用生命周期语法检查 | 通过 | 64 | `node -c architecture/boot/app-lifecycle.js` |
| 项目路径策略语法检查 | 通过 | 49 | `node -c architecture/tools/project-paths.js` |
| 关键 JSON 格式化工具语法检查 | 通过 | 49 | `node -c architecture/tools/format-project-json.js` |
| Bundle 资产目录工具语法检查 | 通过 | 48 | `node -c architecture/tools/generate-bundle-asset-catalog.js` |
| 素材可读性审计工具语法检查 | 通过 | 48 | `node -c architecture/tools/generate-asset-readability-audit.js` |
| 音频使用审计工具语法检查 | 通过 | 47 | `node -c architecture/tools/generate-audio-usage-audit.js` |
| 迭代报告生成器语法检查 | 通过 | 49 | `node -c architecture/tools/generate-iteration-report.js` |
| 迭代流水线语法检查 | 通过 | 47 | `node -c architecture/tools/run-iteration-cycle.js` |
| 架构风格检查 | 通过 | 55 | `node architecture/tools/check-architecture-style.js` |
| 素材分层检查 | 通过 | 77 | `node architecture/tools/check-asset-code-separation.js` |
| 运行安全校验 | 通过 | 62 | `node architecture/tools/verify-runtime-safety.js` |

## 失败信息
- 无

