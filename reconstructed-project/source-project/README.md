# Runtime Source

该目录是 `reconstructed-project/` 内的 runtime 过渡翻译层，不直接改 `runtime/gamejs-modules/`。
新的语义化玩法逻辑优先沉淀到 `assets/scripts/`，这里只继续承接尚未完成拆分的旧 runtime 模块。

## Workflow

1. 修改 `runtime-modules/` 内源码。
2. 执行 `npm run runtime:repack-from-source` 同步到运行目录。
3. 执行 `npm run guardrails` 校验完整性。
4. 需要微信产物时执行 `npm run cocos:build:wechat`。

## Snapshot

- Manifest: `runtime/gamejs-modules/manifest.json`
- Runtime Source Root: `source-project/runtime-modules`
- Total Modules: 48
- Unwrapped Modules: 46
- Passthrough Modules: 2
