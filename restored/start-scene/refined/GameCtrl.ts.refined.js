"use strict";

/**
 * Refined module (manual): chunks:///_virtual/GameCtrl.ts
 * Source reference: restored/start-scene/GameCtrl.ts.restored.js
 * NOTE:
 * - This file is for semantic restoration/readability only.
 * - It is not loaded by the runtime bundle pipeline.
 */

/**
 * @param {typeof import("../GameCtrl.ts.restored.js") | any} deps
 * deps.SingletonBase -> original "./Singleton.ts" default export
 */
function createGameCtrlModule(deps) {
  const SingletonBase = deps && deps.SingletonBase;

  class GameCtrl extends SingletonBase {
    constructor() {
      super();
      this.canTouch = false;
      this.gameIsOver = true;
      this.btnCanTouch = true;
      this.canTouchNail = false;
    }

    static get instance() {
      return super.getInstance();
    }
  }

  return {
    GameCtrl,
  };
}

module.exports = {
  createGameCtrlModule,
};
