# 性能优化手册（当前版本）

## 已落地策略
1. 渲染像素比上限：`2x`（避免高 DPR 设备直接 3x/4x 放大）
2. 低端机帧率策略：`benchmarkLevel <= 15` 时目标帧率 `45 FPS`
3. 启动链路缓存：系统信息只在启动时读取一次并复用
4. 渲染尺寸幂等：重复进入启动流程不会再次累乘画布尺寸

## 可调参数位置
- `architecture/boot/game-bootstrap.js`
  - 参数由 `architecture/boot/config.js` 管理

## 运行时覆盖（无需改代码）
可在启动前挂载全局对象：

```js
globalThis.__DUCK_BOOT_OVERRIDES = {
  renderPixelRatioCap: 2,
  lowEndBenchmarkLevel: 15,
  lowEndFps: 45,
  defaultFps: 60
};
```

## 调优建议
1. 如果画面糊：把 `RENDER_PIXEL_RATIO_CAP` 从 `2` 调到 `2.5`
2. 如果低端机掉帧：把 `LOW_END_FPS` 从 `45` 调到 `30`
3. 如果高端机发热：把 `DEFAULT_FPS` 从 `60` 调到 `50`
