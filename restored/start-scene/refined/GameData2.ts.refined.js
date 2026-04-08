"use strict";

/**
 * Refined module (manual): chunks:///_virtual/GameData2.ts
 * Source reference: restored/start-scene/GameData2.ts.restored.js
 * NOTE:
 * - This file is for semantic restoration/readability only.
 * - It is not loaded by the runtime bundle pipeline.
 */

const LEVEL_MODE = Object.freeze({
  LOCK_FRUIT: "lockMode",
  TIDY: "tidyMode",
  SNAG: "snagMode",
  HOLE: "holeMode",
});

/**
 * @param {object} deps
 * deps.SingletonBase -> "./Singleton.ts" default export
 * deps.GameModel -> "./GameModel2.ts" GameModel export
 */
function createGameData2Module(deps) {
  const SingletonBase = deps && deps.SingletonBase;
  const GameModel = deps && deps.GameModel;

  class GameData2 extends SingletonBase {
    constructor() {
      super();
      this.levelModeData2 = {
        [LEVEL_MODE.LOCK_FRUIT]: false,
        [LEVEL_MODE.SNAG]: false,
        [LEVEL_MODE.TIDY]: false,
        [LEVEL_MODE.HOLE]: false,
      };
    }

    setLevelModeData(modeKey, enabled) {
      this.levelModeData2[modeKey] = enabled;
    }

    getLevelModeData(modeKey) {
      return this.levelModeData2[modeKey];
    }

    onload() {
      this.setLevelModeData(LEVEL_MODE.LOCK_FRUIT, this.isShowLockMode());
      this.setLevelModeData(LEVEL_MODE.SNAG, this.isShowSnagMode());
      this.setLevelModeData(LEVEL_MODE.TIDY, this.isShowTidyMode());
      this.setLevelModeData(LEVEL_MODE.HOLE, this.isShowHoleMode());
    }

    isShowLockMode() {
      return GameModel.instance.level2 % 10 === 4;
    }

    isShowSnagMode() {
      const level = GameModel.instance.level2;
      return level % 10 === 5 || level % 10 === 0;
    }

    isShowTidyMode() {
      const level = GameModel.instance.level2;
      return (level % 10 === 1 && level !== 1) || level % 10 === 6 || level % 10 === 3;
    }

    isShowHoleMode() {
      return GameModel.instance.level2 % 10 === 8;
    }

    get lockFruitFlag() {
      return this.getLevelModeData(LEVEL_MODE.LOCK_FRUIT);
    }

    get snagFlag() {
      return this.getLevelModeData(LEVEL_MODE.SNAG);
    }

    get snagType() {
      const level = GameModel.instance.level2;
      if (level % 10 === 5) {
        return 0;
      }
      if (level % 10 === 0) {
        return 1;
      }
      return 0;
    }

    get tidyFlag() {
      return this.getLevelModeData(LEVEL_MODE.TIDY);
    }

    get tidyType() {
      const level = GameModel.instance.level2;
      if (level % 10 === 1 || level % 10 === 6) {
        return 0;
      }
      if (level % 10 === 3) {
        return 1;
      }
      return 0;
    }

    get holeFlag() {
      return this.getLevelModeData(LEVEL_MODE.HOLE);
    }

    static get instance() {
      return super.getInstance();
    }
  }

  return {
    GameData2,
    LEVEL_MODE,
  };
}

module.exports = {
  createGameData2Module,
  LEVEL_MODE,
};
