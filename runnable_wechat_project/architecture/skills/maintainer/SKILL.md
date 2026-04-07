# Maintainer Skill

## 适用场景
- 继续迭代当前小游戏发布产物工程
- 需要“低风险改造 + 可运行性优先”

## 核心原则
1. 先在 `architecture/` 做可维护层改造，再桥接到 `game.js`
2. 不深改 `game.js` 压缩业务代码
3. 每次改动后必须执行运行安全检查
4. 素材与代码目录必须保持分层，不在 `architecture/` 混入二进制素材
5. 每轮优化结束后必须生成迭代报告，记录架构/入口/使用方式
6. 优先使用一键迭代流水线，确保沉淀文档与校验步骤不遗漏
7. 控制台输出优先中文，可读性优先，调试日志默认关闭按需开启

## 必跑命令
```bash
node -c runnable_wechat_project/game.js
node -c runnable_wechat_project/architecture/boot/game-bootstrap.js
node -c runnable_wechat_project/architecture/boot/global-context.js
node -c runnable_wechat_project/architecture/boot/boot-logger.js
node -c runnable_wechat_project/architecture/boot/render-policies.js
node runnable_wechat_project/architecture/tools/check-architecture-style.js
node runnable_wechat_project/architecture/tools/check-asset-code-separation.js
node runnable_wechat_project/architecture/tools/verify-runtime-safety.js
node runnable_wechat_project/architecture/tools/generate-iteration-report.js
node runnable_wechat_project/architecture/tools/run-iteration-cycle.js
```

## 标准迭代流程
1. 阅读 `architecture/memory/project-memory.md`
2. 仅修改本次目标相关模块
3. 运行必跑命令
4. 更新 `project-memory.md` 的“已落地决策/下阶段路线”
