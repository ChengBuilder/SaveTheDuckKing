# 资产命名优先级笔记

## 目标

把“哪些乱码资产现在就能改、哪些还不能动”明确下来，避免为了追求整洁直接去 rename 运行时高风险文件。

## 当前结论

### 1. `import/native` UUID 文件

- 默认不直接 rename。
- 原因：这些文件大多是 Cocos 编译产物、pack 容器或 native 资源文件名，当前已由 `uuid-asset-report` 证明其具有运行时作用。
- 入口证据见：`architecture/docs/uuid-asset-report.md`。

### 2. `audioBundle` 根层短名

- 当前脏名：`gz`、`ls`、`lz`
- 当前状态：`unreferenced`
- 结论：先不 rename。
- 原因：虽然命名不可读，但现有运行时引用审计没有给出足够语义证据；贸然改名只会把问题从“名字差”变成“证据链断”。

### 3. `DuckBundle` 的 `tex/fragment/a..e/*`

- 当前状态：高优先级 rename 候选。
- 结论：继续保持高优先级观察，但暂不直接 rename。
- 原因：
  - canonical 配置层里大量出现，属于真正的可维护命名治理对象；
  - 运行时代码会通过 `Util.fragmentEffect()` 动态拼接 `tex/fragment/${group}/...` 路径，说明这不是孤立脏路径，而是玩法视觉效果资源组；
  - `duck-fragment-usage-audit` 的静态扫描目前只找到 `fragmentEffect` 定义，没有找到任何调用点；同时 `Wood.update()` 的下落分支直接移除木板节点，说明这组碎片效果很可能已经是历史残留逻辑；
  - 当前只能确认 `a..e` 是“碎片效果分组”，但在没有运行时调用链之前，不应贸然把“高置信推断”当成最终 rename 指令。

### 4. `DuckBundle` fragment 组的当前推断

- 当前高置信映射：
  - `a -> redWoodFragments`
  - `b -> grayWoodFragments`
  - `c -> brownWoodFragments`
  - `d -> lightWoodFragments`
  - `e -> goldWoodFragments`
- 证据来源：
  - `Wood.ts` 的木板颜色目录：`grayWood/lightWood/redWood/brownWood/goldWood`
  - 五组碎片首张图片的平均色统计
- 约束：
  - 这份映射还属于“高置信推断”，不是最终 rename 指令；
  - 在定位 `groupKey` 生成点前，不直接改 canonical 路径。

## 建议顺序

1. 先看 `architecture/docs/duck-fragment-usage-audit.md`，确认当前仍是“有定义、无调用”的状态。
2. 继续补 `Util.ts` / `Wood.ts` / `DuckController.ts` 的语义还原，优先验证是否真的存在动态或间接调用链。
3. 只有在重新找到运行时入口后，才对 canonical 配置、`SpriteFrame.name` 与兼容规则做闭环 rename。
4. `audioBundle` 的 `gz/ls/lz` 只有在补出运行时或产品语义证据后才进入 rename。
