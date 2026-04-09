"use strict";

/**
 * Refined module (manual): chunks:///_virtual/GameData.ts
 * Source reference: restored/start-scene/GameData.ts.restored.js
 * NOTE:
 * - This file is for semantic restoration/readability only.
 * - It is not loaded by the runtime bundle pipeline.
 */

const DUCK_LEVEL_MODE = Object.freeze({
  LOCK_NAIL: "lockNail",
  FREEZE_NAIL: "freezeNail",
  SINGLE_WOOD_TYPE: "singleWoodType",
  SINGLE_WOOD_COLOR: "singleWoodColor",
  SNAG: "snag",
  COMBINATION: "combination",
  TIDY: "tidy",
  ROTATE: "rotate",
});

const REPEATING_STAGE_BASE_LEVEL = 21;
const REPEATING_STAGE_PERIOD = 10;

/**
 * @param {object} deps
 * deps.SingletonBase -> "./Singleton.ts" default export
 * deps.GameModel -> "./GameModel2.ts" exported GameModel
 */
function createGameDataModule(deps) {
  const SingletonBase = deps && deps.SingletonBase;
  const GameModel = deps && deps.GameModel;

  class GameData extends SingletonBase {
    constructor() {
      super();
      this.levelModeFlags = {
        [DUCK_LEVEL_MODE.LOCK_NAIL]: false,
        [DUCK_LEVEL_MODE.FREEZE_NAIL]: false,
        [DUCK_LEVEL_MODE.SINGLE_WOOD_TYPE]: false,
        [DUCK_LEVEL_MODE.SINGLE_WOOD_COLOR]: false,
        [DUCK_LEVEL_MODE.SNAG]: false,
        [DUCK_LEVEL_MODE.COMBINATION]: false,
        [DUCK_LEVEL_MODE.TIDY]: false,
        [DUCK_LEVEL_MODE.ROTATE]: false,
      };
    }

    setLevelModeEnabled(modeKey, enabled) {
      this.levelModeFlags[modeKey] = enabled;
    }

    getLevelModeEnabled(modeKey) {
      return this.levelModeFlags[modeKey];
    }

    onload() {
      this.refreshLevelModeFlags();
    }

    refreshLevelModeFlags() {
      this.setLevelModeEnabled(DUCK_LEVEL_MODE.LOCK_NAIL, this.isLockNailModeEnabled());
      this.setLevelModeEnabled(DUCK_LEVEL_MODE.FREEZE_NAIL, this.isFreezeNailModeEnabled());
      this.setLevelModeEnabled(DUCK_LEVEL_MODE.SINGLE_WOOD_COLOR, this.isSingleWoodColorModeEnabled());
      this.setLevelModeEnabled(DUCK_LEVEL_MODE.SINGLE_WOOD_TYPE, this.isSingleWoodTypeModeEnabled());
      this.setLevelModeEnabled(DUCK_LEVEL_MODE.SNAG, this.isSnagModeEnabled());
      this.setLevelModeEnabled(DUCK_LEVEL_MODE.COMBINATION, this.isCombinationModeEnabled());
      this.setLevelModeEnabled(DUCK_LEVEL_MODE.TIDY, this.isTidyModeEnabled());
      this.setLevelModeEnabled(DUCK_LEVEL_MODE.ROTATE, this.isRotateModeEnabled());
    }

    isLockNailModeEnabled() {
      const level = GameModel.instance.level;
      return level === 4 ||
        level === 8 ||
        level === 14 ||
        level === 18 ||
        this.matchesRepeatingStagePattern(level, [3, 7]);
    }

    isFreezeNailModeEnabled() {
      const level = GameModel.instance.level;
      return level === 7 || level === 17 || this.matchesRepeatingStagePattern(level, [6]);
    }

    isSingleWoodTypeModeEnabled() {
      const level = GameModel.instance.level;
      return level === 8 || level === 18 || this.matchesRepeatingStagePattern(level, [7]);
    }

    isSingleWoodColorModeEnabled() {
      return GameModel.instance.level % 5 !== 0;
    }

    isSnagModeEnabled() {
      const level = GameModel.instance.level;
      return level === 5 ||
        level === 10 ||
        level === 15 ||
        level === 20 ||
        this.matchesRepeatingStagePattern(level, [4, 9]);
    }

    isCombinationModeEnabled() {
      const level = GameModel.instance.level;
      return level === 6 ||
        level === 11 ||
        level === 16 ||
        level === 21 ||
        this.matchesRepeatingStagePattern(level, [5, 10]);
    }

    isTidyModeEnabled() {
      const level = GameModel.instance.level;
      return level === 9 ||
        level === 13 ||
        level === 19 ||
        this.matchesRepeatingStagePattern(level, [2, 8]);
    }

    isRotateModeEnabled() {
      const level = GameModel.instance.level;
      return level === 2 || level === 12 || this.matchesRepeatingStagePattern(level, [1]);
    }

    matchesRepeatingStagePattern(level, cycleOffsets) {
      if (level <= REPEATING_STAGE_BASE_LEVEL) {
        return false;
      }

      const cycleOffset = (level - REPEATING_STAGE_BASE_LEVEL) % REPEATING_STAGE_PERIOD;
      return cycleOffsets.includes(cycleOffset);
    }

    get lockNailFlag() {
      return this.getLevelModeEnabled(DUCK_LEVEL_MODE.LOCK_NAIL);
    }

    get iceNailFlag() {
      return this.getLevelModeEnabled(DUCK_LEVEL_MODE.FREEZE_NAIL);
    }

    get singleWoodTypeFlag() {
      return this.getLevelModeEnabled(DUCK_LEVEL_MODE.SINGLE_WOOD_TYPE);
    }

    get singleWoodColorFlag() {
      return this.getLevelModeEnabled(DUCK_LEVEL_MODE.SINGLE_WOOD_COLOR);
    }

    get snagFlag() {
      return this.getLevelModeEnabled(DUCK_LEVEL_MODE.SNAG);
    }

    get combinationFlag() {
      return this.getLevelModeEnabled(DUCK_LEVEL_MODE.COMBINATION);
    }

    get tidyFlag() {
      return this.getLevelModeEnabled(DUCK_LEVEL_MODE.TIDY);
    }

    get rotateFlag() {
      return this.getLevelModeEnabled(DUCK_LEVEL_MODE.ROTATE);
    }

    static get instance() {
      return super.getInstance();
    }
  }

  return {
    GameData,
    DUCK_LEVEL_MODE,
  };
}

module.exports = {
  createGameDataModule,
  DUCK_LEVEL_MODE,
};
