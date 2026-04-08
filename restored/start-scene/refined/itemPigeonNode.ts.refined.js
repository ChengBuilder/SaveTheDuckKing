"use strict";

/**
 * Refined module (manual): chunks:///_virtual/itemPigeonNode.ts
 * Source reference: restored/start-scene/itemPigeonNode.ts.restored.js
 * NOTE:
 * - This file is for semantic restoration/readability only.
 * - It is not loaded by the runtime bundle pipeline.
 */

/**
 * uiBundle skin path (new semantic path used in config.json)
 * @param {number} pigeonId
 * @returns {string}
 */
function getPigeonSkinSpritePath(pigeonId) {
  return `tex/book/pigeonGallery/skinCollection/skinPage${pigeonId}/spriteFrame`;
}

/**
 * legacy path retained for compatibility analysis.
 * @param {number} pigeonId
 * @returns {string}
 */
function getLegacyPigeonSkinSpritePath(pigeonId) {
  return `tex/book/鸽鸽图鉴/皮肤图鉴/p${pigeonId}/spriteFrame`;
}

/**
 * @param {object} deps
 * deps.Node -> cc.Node
 * deps.Sprite -> cc.Sprite
 * deps.Label -> cc.Label
 * deps.Color -> cc.Color
 * deps.Component -> cc.Component
 * deps.GameModel -> "./GameModel2.ts" GameModel export
 * deps.ResManager -> "./ResManager.ts" ResManager export
 */
function createItemPigeonNodeModule(deps) {
  const Node = deps && deps.Node;
  const Sprite = deps && deps.Sprite;
  const Label = deps && deps.Label;
  const Color = deps && deps.Color;
  const Component = deps && deps.Component;
  const GameModel = deps && deps.GameModel;
  const ResManager = deps && deps.ResManager;

  class ItemPigeonNode extends Component {
    constructor() {
      super();
      this.id = 0;
      this.noNode = null;
      this.pigeonSprite = null;
      this.pigeonShadow = null;
      this.pigeonName = null;
      this.newTag = null;
      this.useTag = null;
      this.useLight = null;
      this.AdTag = null;
    }

    initPigeonItem() {
      const isUnlocked = GameModel.instance.pigeonNumArr[this.id - 1] === 2;
      const skinPath = getPigeonSkinSpritePath(this.id);

      if (isUnlocked) {
        this.node.getComponent(Sprite).color = Color.WHITE;
        this.pigeonSprite.getComponent(Sprite).color = Color.WHITE;
      } else {
        this.node.getComponent(Sprite).color = Color.GRAY;
        this.pigeonSprite.getComponent(Sprite).color = Color.GRAY;
      }

      const pigeonName = GameModel.PigeonNameArr[this.id - 1];
      this.pigeonName.active = true;
      this.pigeonShadow.active = true;
      this.pigeonName.getComponent(Label).string = pigeonName;

      ResManager.instance.bundleLoad("uiBundle", skinPath, null, (error, spriteFrame) => {
        if (error) {
          // Keep fallback path visible in refined source to assist compatibility debugging.
          const legacyPath = getLegacyPigeonSkinSpritePath(this.id);
          console.error("pigeon skin load failed", { skinPath, legacyPath, error });
          return;
        }
        if (this.node) {
          this.pigeonSprite.getComponent(Sprite).spriteFrame = spriteFrame;
        }
      });

      this.updateAdTime();
      const selectedName = GameModel.instance.pigeonName;
      if (selectedName === pigeonName && isUnlocked) {
        this.useTag.active = true;
        this.useLight.active = true;
      }
    }

    showUnlock() {
      this.node.getComponent(Sprite).color = Color.WHITE;
      this.pigeonSprite.getComponent(Sprite).color = Color.WHITE;
    }

    updateAdTime() {
      const progress = GameModel.instance.pigeonNumArr[this.id - 1];
      this.AdTag.getChildByName("ADNum").getComponent(Label).string = `（${progress}/2）`;
      if (progress >= 2) {
        this.AdTag.active = false;
        this.showUnlock();
      }
    }

    hide() {
      this.node.active = false;
      this.useTag.active = false;
      this.useLight.active = false;
      this.newTag.active = false;
      this.pigeonShadow.active = false;
      this.pigeonName.active = false;
      this.pigeonSprite.getComponent(Sprite).spriteFrame = null;
      this.AdTag.active = true;
      this.AdTag.getChildByName("ADNum").getComponent(Label).string = "（0/2）";
      this.node.getComponent(Sprite).color = Color.WHITE;
    }

    // keep Cocos lifecycle naming
    start() {}
  }

  return {
    ItemPigeonNode,
    getPigeonSkinSpritePath,
    getLegacyPigeonSkinSpritePath,
  };
}

module.exports = {
  createItemPigeonNodeModule,
  getPigeonSkinSpritePath,
  getLegacyPigeonSkinSpritePath,
};
