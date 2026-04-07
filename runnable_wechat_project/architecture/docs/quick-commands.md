# 常用命令

## 1) 重新桥接入口到可维护启动层
```bash
node runnable_wechat_project/architecture/tools/patch-entry-bootstrap.js
```

## 2) 重新生成模块索引
```bash
node runnable_wechat_project/architecture/tools/generate-module-index.js
```

## 3) 检查 architecture 层命名与中文注释规范
```bash
node runnable_wechat_project/architecture/tools/check-architecture-style.js
```

## 4) 检查关键文件语法
```bash
node -c runnable_wechat_project/architecture/boot/game-bootstrap.js
node -c runnable_wechat_project/game.js
```

## 5) 一键运行全部护栏检查
```bash
node runnable_wechat_project/architecture/tools/run-guardrails.js
```

## 6) 检查素材与代码是否分离
```bash
node runnable_wechat_project/architecture/tools/check-asset-code-separation.js
```

## 7) 生成素材与代码分层报告
```bash
node runnable_wechat_project/architecture/tools/generate-asset-code-report.js
```
