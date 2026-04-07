# 依赖、插件与用户目录取证

## 1. 依赖补全结论

这份导出包里，真正需要额外补的外部依赖并不多，因为它本身就是发布后的运行时成品。

### 已内嵌到成品包中的运行时依赖

- Cocos Creator 运行时
  - `__APP__/cocos-js/assets/spine-CC34fKUR.wasm`
- Babel helper / polyfill
  - 位于 `__APP__/game.js` 顶部的 `define("@babel/runtime/helpers/...")`
- 微信小游戏适配层
  - `web-adapter`
  - `first-screen`
  - `engine-adapter`
- SystemJS / import map 相关运行时
- 途悦 SDK 封装逻辑
  - `TooYueManager.ts` 中引用的 `tysdk` 模块已编进产物

### 插件结论

从 `__APP__/src/settings.28e9d.json` 看：

- `plugins.jsList = []`

这表示当前包没有恢复到“必须另装的微信官方插件列表”。

虽然运行时代码里有通用的 `requirePlugin` shim，但当前 `pluginInfoMap` 没有实际插件映射，因此这里更像模板化保留，而不是当前项目真实依赖。

### npm / Node 依赖结论

这份导出包不是 npm 工程，不存在还原出完整 `node_modules` 的必要。

当前真正需要的只是：

- `Node.js >= 18`

用于执行附带的解包脚本：

- `tools/wechat_wxapkg_unpack.js`

## 2. 用户目录取证

本机微信容器里发现的 `radium/users` 目录只有一个：

- `1259216a2b497704dda1a52bb7a2c5f6`

在该目录下存在：

- `applet`
- `mmkv`
- `udr`
- `xworker`

对当前小游戏 `wx244b1cb66c8ac4b4` 的本地目录为：

- `project_bundle/local_metadata/`

其中包含：

- `adapter-config.json`
- `initial-rendering-cache-config.json`
- `launch.config`
- `store/images/...`
- `usr/gamecaches/cacheList.json`
- `mmkvadapterstorage/...`
- `usrmmkvstorage0/...`
- `usrmmkvstorage1/...`

## 3. “这个用户是不是你” 的结论

可以确认的只有：

- 这台 Mac 当前微信小游戏沙箱里，`radium/users` 下只发现了一个用户目录
- 当前小游戏缓存和包体都落在这个目录下

不能百分百确认的部分：

- 这个 hash 目录无法仅凭本地文件直接反推出真实微信号、手机号或昵称
- 所以无法用纯离线方式严格证明“这个 hash 用户一定就是你本人”

更准确的表述是：

- 这台机器当前可见的微信小游戏本地数据，只有这一位沙箱用户
- 当前找到的小游戏包和本地缓存都属于这一个沙箱用户

## 4. 导出内容完整性

当前导出包已经包含：

- 9 个原始 `wxapkg`
- 9 个解密后的 `wxapkg`
- 9 个拆包目录
- 1 份 local metadata
- 1 份 summary
- 1 份可复用解包脚本
- 1981 个拆包文件

## 5. 仍无法从成品包补全的内容

以下内容没有办法仅凭当前发布包完整恢复：

- 原始 Cocos Creator 项目目录
- 原始编辑器 `.meta` 文件
- 构建前 TypeScript 源文件树
- 构建前私有 npm 包
- 服务端代码和后台配置

所以这里的“补全”，已经做到的是：

- 把可恢复的运行时、资源、解密包、缓存、工具、架构说明全部补齐

但它依然不等价于开发团队手里的原始仓库。
