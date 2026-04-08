# architecture

这里是项目的可维护层入口，建议把后续迭代都放在这里。
当前工程已位于仓库根目录，工具脚本会自动兼容“仓库根目录 / 子目录项目”两种布局。

- 启动逻辑：`boot/`
- 规范与上手文档：`docs/`
- 自动化脚本：`tools/`
- 项目长期记忆：`memory/`
- 项目内技能说明：`skills/`

当前启动层已按职责拆到：
- `boot/config.js`：配置解析与兜底
- `boot/boot-safety.js`：状态机与重复启动保护
- `boot/platform-strategy.js`：平台启动调度策略
- `boot/performance-strategy.js`：渲染/帧率性能策略
- `boot/boot-observer.js`：运行时观测与阶段记录
- `boot/recovery-strategy.js`：启动失败归档与恢复策略

建议每次迭代后至少执行：

```bash
node architecture/tools/run-guardrails.js
node architecture/tools/generate-iteration-report.js
node architecture/tools/run-iteration-cycle.js
```
