# 微信小游戏代码包体报告

> 本文件由 `architecture/tools/check-wechat-code-package-limits.js` 生成。

## 总览
- 生成时间：2026-04-09T16:10:24.422Z
- 项目目录：`./`
- 主包：`3.35 MiB / 4.00 MiB`
- 总包：`25.36 MiB / 30.00 MiB`
- 违规项：0

## 官方依据
- https://developers.weixin.qq.com/minigame/dev/guide/base-ability/code-package.html
- https://developers.weixin.qq.com/minigame/dev/guide/base-ability/subPackage/useSubPackage.html
- https://developers.weixin.qq.com/minigame/dev/guide/base-ability/workers.html

## 包体明细
| 包 | 类型 | 文件数 | 大小 | 上限 | 状态 |
| --- | --- | ---: | ---: | ---: | --- |
| 主包 | main | 35 | 3.35 MiB | 4.00 MiB | 通过 |
| resources | subpackage | 16 | 0.08 MiB | 无 | 通过 |
| main | subpackage | 223 | 9.57 MiB | 无 | 通过 |
| aniBundle | subpackage | 130 | 3.02 MiB | 无 | 通过 |
| audioBundle | subpackage | 132 | 1.78 MiB | 无 | 通过 |
| DuckBundle | subpackage | 1045 | 2.27 MiB | 无 | 通过 |
| Game2Bundle | subpackage | 84 | 0.46 MiB | 无 | 通过 |
| HomeBundle | subpackage | 225 | 2.78 MiB | 无 | 通过 |
| uiBundle | subpackage | 115 | 2.06 MiB | 无 | 通过 |

## 入口口径
- 主包入口：`app-config.json`
- 主包入口：`architecture/boot`
- 主包入口：`assets`
- 主包入口：`cocos-js`
- 主包入口：`game.js`
- 主包入口：`game.json`
- 主包入口：`runtime`
- 主包入口：`src`

## 说明
- 本报告按照当前小游戏运行入口、game.json 分包声明以及 worker 配置统计，用于本地快速护栏。
- 若需要上传口径的精确包体信息，可结合微信开发者工具 CLI 的 auto-preview/upload --info-output 二次验证。

## 失败信息
- 无

