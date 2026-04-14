# SaveTheDuckKing 开发记忆（2026-04-13）

## 当前目标与状态
- 目标：项目在 Cocos Creator 可构建，导入微信开发者工具后可正常游玩主流程（拆木板拆钉子）。
- 当前状态：主流程可玩，工程仍处于持续重构阶段（去混淆、瘦身、语义化命名进行中）。

## 当前可用运行入口
1. Cocos 构建命令：`npm run cocos:build:wechat`
2. 微信开发者工具导入目录：`build/wechatgame`
3. 项目开发根目录：仓库根目录 `SaveTheDuckKing`

## 本阶段已确认
- `npm run cocos:build:wechat` 可执行并生成 `build/wechatgame`。
- `npm run guardrails` 通过。
- `npm run wechat:official:check -- --skip-cli --skip-package-check` 通过。
- 主流程资源完整性校验通过（无 import/native 缺失）。
- `DuckController.CreateWoodInformation` 已对齐到命名 helper 流程，修正 revive 木板规划中的反编译残留分支（`case 8` 漏 `break`、`37/42` 分支误写为赋值）。

## 重要说明
- `reconstructed-project/` 是“重建中间产物”，用于还原分析与迁移，不是当前运行入口。
- 运行与联调优先使用仓库根目录 + `build/wechatgame`。
- MiniGameTest 自动化脚本已接入，但本机若未提供官方 SDK tgz，则无法执行用例。

## MiniGameTest 自动化测试使用说明
1. 将 `mini_game_test-*.tgz` 放到：`wechat-test/minigametest/vendor/`
2. 环境检查：`npm run wechat:test:doctor`
3. 执行测试：`npm run wechat:test:run`
4. 可选环境变量：
   - `WECHAT_DEVTOOLS_CLI`
   - `WECHAT_DEVTOOLS_SERVICE_PORT`
   - `WECHAT_MINIGAME_TEST_PORT`
   - `WECHAT_MINIGAME_TEST_CASE`
   - `WECHAT_MINIGAME_TEST_SDK_TGZ`

## 下阶段优先级（建议）
1. runtime 模块主流程去混淆：优先 `game`、`application-main`、`subpackages/main`。
2. 继续删除未使用资源和死分支，并保持每轮可构建可玩。
3. 建立“构建 -> 结构校验 -> 自动化用例”的单命令流水线。
4. 预留微信登录与广告 SDK 接入位（接口层先行，不引入复杂兼容层）。

## 回滚策略
- 已使用 git 管理，重构策略为“做减法 + 小步提交 + 可回滚”。
- 若出现运行异常，优先回退到上一个“可构建可玩”提交点。
