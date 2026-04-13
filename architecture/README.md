# architecture

这里只保留两层：

- `boot/`：启动链路与运行治理。
- `tools/`：主流程必需的校验与微信检查脚本。

## 已收敛策略

- 不再维护历史语义映射、兼容镜像、迭代审计工具链。
- 资源完整性以 `config.*.json` 实际引用为准，直接校验真实文件是否存在。
- 目标是让工具链服务运行稳定，而不是制造更多中间层。

## 建议执行顺序

```bash
node architecture/tools/format-project-json.js
node architecture/tools/check-config-version-asset-integrity.js --strict-shard
node architecture/tools/verify-wechat-minigame-structure.js
node architecture/tools/verify-runtime-safety.js
node architecture/tools/check-legacy-runtime-compat.js
node architecture/tools/check-wechat-code-package-limits.js
```
