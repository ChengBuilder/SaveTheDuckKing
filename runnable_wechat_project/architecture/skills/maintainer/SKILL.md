# Maintainer Skill

## 适用场景
- 继续迭代当前小游戏发布产物工程
- 需要“低风险改造 + 可运行性优先”

## 核心原则
1. 先在 `architecture/` 做可维护层改造，再桥接到 `game.js`
2. 不深改 `game.js` 压缩业务代码
3. 每次改动后必须执行运行安全检查

## 必跑命令
```bash
node -c runnable_wechat_project/game.js
node -c runnable_wechat_project/architecture/boot/game-bootstrap.js
node runnable_wechat_project/architecture/tools/check-architecture-style.js
node runnable_wechat_project/architecture/tools/verify-runtime-safety.js
```

## 标准迭代流程
1. 阅读 `architecture/memory/project-memory.md`
2. 仅修改本次目标相关模块
3. 运行必跑命令
4. 更新 `project-memory.md` 的“已落地决策/下阶段路线”

