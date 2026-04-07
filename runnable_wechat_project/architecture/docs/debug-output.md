# 启动调试输出说明

## 目标
在不影响线上性能的前提下，提供可开关的中文调试日志，便于快速定位启动与平台兼容问题。

## 日志特性
- 默认仅输出关键信息/警告/错误。
- 详细调试日志默认关闭，避免控制台噪声。
- 日志统一前缀：`[DuckBoot][级别]`，方便筛选。

## 开启详细调试日志
在启动前设置任一全局变量为 `true`：

```js
globalThis.__DUCK_BOOT_DEBUG = true;
// 或
globalThis.__DUCK_DEBUG = true;
```

## 推荐观察点
1. 启动状态流转（pending/running/completed/failed）
2. 运行时依赖加载与 System 预热
3. 渲染分辨率策略（DPR、画布尺寸）
4. 帧率策略（benchmarkLevel 与目标 FPS）

