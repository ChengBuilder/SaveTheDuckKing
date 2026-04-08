# 常用命令

## 1) 重新桥接入口到可维护启动层
```bash
node architecture/tools/patch-entry-bootstrap.js
```

## 2) 重新生成模块索引
```bash
node architecture/tools/generate-module-index.js
```

## 3) 检查 architecture 层命名与中文注释规范
```bash
node architecture/tools/check-architecture-style.js
```

## 4) 检查关键文件语法
```bash
node -c architecture/boot/game-bootstrap.js
node -c game.js
```

## 5) 一键运行全部护栏检查
```bash
node architecture/tools/run-guardrails.js
```

## 6) 检查素材与代码是否分离
```bash
node architecture/tools/check-asset-code-separation.js
```

## 7) 生成素材与代码分层报告
```bash
node architecture/tools/generate-asset-code-report.js
```

## 8) 生成本轮优化迭代报告（含架构/入口/使用说明）
```bash
node architecture/tools/generate-iteration-report.js
```

## 9) 一键执行完整迭代闭环（推荐）
```bash
node architecture/tools/run-iteration-cycle.js
```

## 10) 启动调试日志开关（代码片段）
```js
globalThis.__DUCK_BOOT_DEBUG = true;
```

## 11) 查看最近一次护栏报告
```bash
sed -n '1,220p' architecture/docs/guardrail-report.md
```

## 12) 查看最新迭代报告中的策略快照
```bash
ls -1t architecture/docs/iterations | head -n 3
sed -n '1,260p' architecture/docs/iterations/$(ls -1t architecture/docs/iterations | head -n 1)
```

## 13) 运行时查看启动观测快照
```js
globalThis.__DUCK_BOOT_INFO
```
