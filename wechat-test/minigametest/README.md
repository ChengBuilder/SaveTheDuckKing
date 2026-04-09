# MiniGameTest 本地自动化

本目录按微信小游戏官方 `MiniGameTest` 教程组织，用于本地自动化测试。

## 官方依据

- CLI：<https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html>
- 环境准备：<https://developers.weixin.qq.com/minigame/dev/minigame-testtool/setup.html>
- 第一个 Case：<https://developers.weixin.qq.com/minigame/dev/minigame-testtool/tutorial.html>

## 目录说明

- `sample/test.js`
  - 官方 JavaScript Case 模板的仓库落地版本。
- `vendor/`
  - 放官方下载的 `mini_game_test-*.tgz`。

## 使用方式

1. 下载最新版微信开发者工具，并在“设置 -> 安全设置 -> 安全”中开启服务端口。
2. 从官方提供的 MiniGameTest SDK 下载地址获取 `mini_game_test-*.tgz`。
3. 把 SDK tgz 放到 `wechat-test/minigametest/vendor/`。
4. 设置要点击的节点 Path：
   - `export WECHAT_MINIGAME_TEST_NODE_PATH='从 Game Inspector 复制出的节点 Path'`
5. 先跑 doctor：
   - `npm run wechat:test:doctor`
6. 再跑样例：
   - `npm run wechat:test:run`

## 端口约定

- `WECHAT_DEVTOOLS_SERVICE_PORT`
  - 开发者工具服务端口，默认 `9420`
- `WECHAT_MINIGAME_TEST_PORT`
  - MiniGameTest 自动化监听端口，默认 `9421`

注意：官方教程要求这两个端口不能相同。
