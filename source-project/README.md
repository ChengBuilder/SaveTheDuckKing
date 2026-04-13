# Source Project (Maintainable)

该目录作为可维护源码主编辑区，不直接改 `runtime/gamejs-modules`。

## Workflow

1. 修改 `runtime-modules/` 内源码。
2. 执行 `npm run runtime:repack-from-source` 回封装到运行目录。
3. 执行 `npm run guardrails` 校验完整性。

## Snapshot

- Manifest: `runtime/gamejs-modules/manifest.json`
- Runtime Source Output: `source-project/runtime-modules`
- Total Modules: 48
- Unwrapped Modules: 46
- Passthrough Modules: 2
