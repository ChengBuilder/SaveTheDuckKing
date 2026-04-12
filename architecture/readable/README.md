# Readable Gameplay Mirrors

## Duck board/nail generation

- Readable module: `architecture/readable/duck-board-generation.js`
- Runtime source today:
  - `runtime/gamejs-modules/036__assets__start-scene__index.start-scene.js__c6e1947.js`
  - chunk `chunks:///_virtual/DuckController.ts`
  - chunk `chunks:///_virtual/Wood.ts`
  - chunk `chunks:///_virtual/Nail.ts`

### Method mapping

- `DuckController.initNailTypeArr` -> `buildInitialNailTypePlan`
- `DuckController.createNailArr` -> `buildNailTypeBuckets`
- `DuckController.diffForGroupIndex` -> `calcGroupIndexOffset`
- `DuckController.getWoodHoleNum` -> `getWoodHoleCount`
- `DuckController.setTidyMode` -> `buildTidyWoodTransform`
- `DuckController.isSingleWoodTypeLevel` -> `isSingleWoodTypeLevel`
- `DuckController.getSingleWoodTypeCount` -> `countSingleWoodTypeLevels`
- `DuckController.getRandWoodType` -> `pickSingleWoodType`
- `DuckController.isTidyLevel` -> `isTidyLevel`
- `DuckController.getTidyLevelCount` -> `countTidyLevels`
- `DuckController.getRandTidyType` -> `pickTidyWoodType`
- `DuckController.CreateWoodInformation` -> `buildReviveWoodInformation`

This mirror is intentionally runtime-independent and can be used as the migration target while we continue拆解 old bundled code.
