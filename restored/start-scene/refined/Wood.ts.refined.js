"use strict";

/**
 * Refined module (manual): chunks:///_virtual/Wood.ts
 * Source reference: restored/start-scene/Wood.ts.restored.js
 * NOTE:
 * - This file is for semantic restoration/readability only.
 * - It is not loaded by the runtime bundle pipeline.
 */

const WOOD_TEXTURE_DIRECTORY_BY_COLOR_INDEX = Object.freeze({
  1: "grayWood",
  2: "lightWood",
  3: "redWood",
  4: "brownWood",
  5: "goldWood",
});

const SINGLE_COLOR_WOOD_DIRECTORIES = Object.freeze([
  "grayWood",
  "lightWood",
  "yellowWood",
  "redWood",
]);

const SPECIAL_BACKGROUND_FORCE_SINGLE_COLOR_TYPES = new Set([1, 2, 3]);

/**
 * 这是基于 `tex/fragment/a..e/*` 首张碎片图平均色与木板主色目录的人工推断。
 * 先作为 rename 分析线索沉淀在 refined 层，不直接参与运行时。
 */
const INFERRED_FRAGMENT_GROUP_BY_WOOD_DIRECTORY = Object.freeze({
  grayWood: "b",
  lightWood: "d",
  redWood: "a",
  brownWood: "c",
  goldWood: "e",
});

/**
 * @param {object} deps
 * deps.Component -> original "cc" Component
 * deps.PolygonCollider2D -> original "cc" PolygonCollider2D
 * deps.RigidBody2D -> original "cc" RigidBody2D
 * deps.find -> original "cc" find
 * deps.UITransform -> original "cc" UITransform
 * deps.tween -> original "cc" tween
 * deps.Sprite -> original "cc" Sprite
 * deps.Color -> original "cc" Color
 * deps.instantiate -> original "cc" instantiate
 * deps.UIOpacity -> original "cc" UIOpacity
 * deps.ERigidBody2DType -> original "cc" ERigidBody2DType
 * deps.HingeJoint2D -> original "cc" HingeJoint2D
 * deps.v2 -> original "cc" v2
 * deps.Node -> original "cc" Node
 * deps.Util -> original "./Util.ts" Util export
 * deps.GameModel -> original "./GameModel2.ts" GameModel export
 * deps.PHY_GROUP -> original "./Enum.ts" PHY_GROUP export
 * deps.Nail -> original "./Nail.ts" Nail export
 * deps.ResManager -> original "./ResManager.ts" ResManager export
 * deps.DuckController -> original "./DuckController.ts" DuckController export
 * deps.AudioManager -> original "./AudioManager.ts" AudioManager export
 * deps.GameData -> original "./GameData.ts" GameData export
 */
function createWoodModule(deps) {
  const ComponentBase = deps && deps.Component;
  const PolygonCollider2D = deps && deps.PolygonCollider2D;
  const RigidBody2D = deps && deps.RigidBody2D;
  const find = deps && deps.find;
  const UITransform = deps && deps.UITransform;
  const tween = deps && deps.tween;
  const Sprite = deps && deps.Sprite;
  const Color = deps && deps.Color;
  const instantiate = deps && deps.instantiate;
  const UIOpacity = deps && deps.UIOpacity;
  const ERigidBody2DType = deps && deps.ERigidBody2DType;
  const HingeJoint2D = deps && deps.HingeJoint2D;
  const v2 = deps && deps.v2;
  const NodeCtor = deps && deps.Node;
  const Util = deps && deps.Util;
  const GameModel = deps && deps.GameModel;
  const PHYSICS_GROUP = deps && deps.PHY_GROUP;
  const Nail = deps && deps.Nail;
  const ResManager = deps && deps.ResManager;
  const DuckController = deps && deps.DuckController;
  const AudioManager = deps && deps.AudioManager;
  const GameData = deps && deps.GameData;

  class Wood extends ComponentBase {
    constructor() {
      super();
      this.woodSpriteNode = null;
      this.shadowSpriteNode = null;
      this.nailNodes = [];
      this.groupIndex = 0;
      this.woodRigidBody = null;
      this.polygonCollider = null;
      this.siblingIndex = null;
      this.woodColorIndex = 0;
      this.collideTargets = [];
      this.isRigidEnabled = true;
    }

    start() {
      this.getComponent(PolygonCollider2D).tag = 1;
    }

    disableRigidState() {
      if (!this.isRigidEnabled) {
        return;
      }

      this.isRigidEnabled = false;
      const rigidBody = this.node.getComponent(RigidBody2D);
      this.node.getComponent(PolygonCollider2D).enabled = false;
      rigidBody.enabled = false;

      for (const nailNode of this.nailNodes) {
        nailNode.getComponent(Nail).closeRigid();
      }
    }

    enableRigidState() {
      if (this.isRigidEnabled) {
        return;
      }

      this.isRigidEnabled = true;
      const rigidBody = this.node.getComponent(RigidBody2D);
      this.node.getComponent(PolygonCollider2D).enabled = true;
      rigidBody.enabled = true;

      for (const nailNode of this.nailNodes) {
        nailNode.getComponent(Nail).openRigid();
      }
    }

    onDisable() {
      this.disableRigidState();
      this.removeTouchEvents();
    }

    update() {
      const wallHalfWidth = find("Canvas/realWall/wallR").getComponent(UITransform).width / 2;
      if (this.node.worldPosition.y <= 200) {
        const randomDropSoundIndex = Util.getRandomNum(1, 3, true);
        const audioPath = "woodDrop/woodDrop_" + randomDropSoundIndex.toString();
        AudioManager.instance.playSound(audioPath, 1);
        AudioManager.instance.playSound(audioPath, 1);

        const duckController = find("Canvas").getComponent(DuckController);
        duckController.woodArr.splice(duckController.woodArr.indexOf(this.node), 1);
        this.node.destroy();
        return;
      }

      const wallRightNode = find("Canvas/realWall/wallR");
      if (this.node.worldPosition.y < wallRightNode.position.y + wallHalfWidth + 80) {
        tween(this.woodSpriteNode.getComponent(Sprite)).to(0.2, {
          color: new Color(50, 50, 50, 255),
        }).start();
      }
    }

    initializeWood(woodType, groupIndex, woodColorIndex, nailTypeList, siblingIndex) {
      this.woodSpriteNode = this.node.getChildByName("woodSpr");
      this.groupIndex = groupIndex;
      this.siblingIndex = siblingIndex;
      this.woodColorIndex = woodColorIndex;

      const duckController = find("Canvas").getComponent(DuckController);
      const textureDirectory = this.resolveWoodTextureDirectory(woodColorIndex, groupIndex, duckController);
      this.loadShadowSprite(woodType, textureDirectory);
      this.loadWoodSprite(woodType, textureDirectory);

      this.woodRigidBody = this.node.getComponent(RigidBody2D);
      this.woodRigidBody.angularDamping = 0.5;

      this.polygonCollider = this.node.getComponent(PolygonCollider2D);
      this.polygonCollider.group = PHYSICS_GROUP["L" + groupIndex];
      this.polygonCollider.friction = 0;
      this.polygonCollider.apply();

      this.initializeNails(nailTypeList, duckController, groupIndex);
      this.node.addComponent(UIOpacity);
    }

    resolveWoodTextureDirectory(woodColorIndex, groupIndex, duckController) {
      let textureDirectory = WOOD_TEXTURE_DIRECTORY_BY_COLOR_INDEX[woodColorIndex];

      if (GameData.instance.singleWoodColorFlag) {
        const singleColorIndex = GameModel.instance.level % (SINGLE_COLOR_WOOD_DIRECTORIES.length + 1);
        textureDirectory = SINGLE_COLOR_WOOD_DIRECTORIES[singleColorIndex - 1];
        if (GameModel.instance.level === 3) {
          textureDirectory = SINGLE_COLOR_WOOD_DIRECTORIES[0];
        }
      }

      if (GameModel.instance.level === 2 && groupIndex <= 6) {
        textureDirectory = SINGLE_COLOR_WOOD_DIRECTORIES[0];
      }

      const specialBackgroundType = duckController.isShowSpecialBg();
      if (SPECIAL_BACKGROUND_FORCE_SINGLE_COLOR_TYPES.has(specialBackgroundType)) {
        textureDirectory = SINGLE_COLOR_WOOD_DIRECTORIES[0];
      }

      return textureDirectory;
    }

    loadShadowSprite(woodType, textureDirectory) {
      ResManager.instance.bundleLoad("DuckBundle", "prefab/woodShadow", null, (error, prefab) => {
        if (error) {
          console.log(error);
          return;
        }

        const shadowNode = instantiate(prefab);
        shadowNode.parent = this.node;
        this.shadowSpriteNode = shadowNode;
        shadowNode.setScale(1.02, 1.02, 1.02);
        shadowNode.getComponent(UIOpacity).opacity = 100;
        shadowNode.setSiblingIndex(0);

        const spritePath = this.buildWoodSpritePath(textureDirectory, woodType);
        ResManager.instance.bundleLoad("DuckBundle", spritePath, null, (spriteError, spriteFrame) => {
          if (spriteError) {
            console.log(spriteError);
            return;
          }

          this.shadowSpriteNode.getComponent(Sprite).spriteFrame = spriteFrame;
        });
      });
    }

    loadWoodSprite(woodType, textureDirectory) {
      const spritePath = this.buildWoodSpritePath(textureDirectory, woodType);
      ResManager.instance.bundleLoad("DuckBundle", spritePath, null, (error, spriteFrame) => {
        if (error) {
          console.log(error);
          return;
        }

        this.woodSpriteNode.getComponent(Sprite).spriteFrame = spriteFrame;
      });
    }

    buildWoodSpritePath(textureDirectory, woodType) {
      return "tex/wood/" + textureDirectory + "/" + textureDirectory + woodType.toString() + "/spriteFrame";
    }

    initializeNails(nailTypeList, duckController, groupIndex) {
      let nailTypeIndex = -1;
      for (const childNode of this.node.children) {
        if (childNode.name !== "nail") {
          continue;
        }

        nailTypeIndex += 1;
        const nailType = nailTypeList[nailTypeIndex];
        const nailComponent = childNode.getComponent(Nail);

        this.tryEnableIceNailForLayer(duckController, groupIndex, nailComponent);
        nailComponent.initNail(nailType);
        this.nailNodes.push(childNode);
      }
    }

    tryEnableIceNailForLayer(duckController, groupIndex, nailComponent) {
      if (duckController.iceLayerArr.includes(groupIndex)) {
        return;
      }
      if (!GameData.instance.iceNailFlag || groupIndex <= 9) {
        return;
      }

      const shouldFreezeThisLayer =
        Util.getRandomNum(0, 1) < 0.6 || duckController.NoTouchNailNum === duckController.nailNum;
      if (!shouldFreezeThisLayer) {
        return;
      }

      duckController.iceLayerArr.push(groupIndex);
      nailComponent.initIceNail(groupIndex);
    }

    addJoint() {
      for (const nailNode of this.nailNodes) {
        nailNode.addComponent(RigidBody2D).type = ERigidBody2DType.Static;

        const hingeJoint = nailNode.addComponent(HingeJoint2D);
        nailNode.getComponent(Nail).HingeJointNail = hingeJoint;
        hingeJoint.connectedBody = this.node.getComponent(RigidBody2D);
        hingeJoint.anchor = v2(0, 0);
        hingeJoint.connectedAnchor = v2(
          nailNode.x * this.node.scale.x,
          nailNode.y * this.node.scale.y
        );
        hingeJoint.apply();
        nailNode.getComponent(Nail).initNailCollider();
      }
    }

    highlightAsDetached() {
      if (this.nailNodes.length === 0) {
        tween(this.woodSpriteNode.getComponent(Sprite)).to(0.2, {
          color: new Color(110, 110, 110, 255),
        }).start();
      }
    }

    initializeNailAngles() {
      for (const nailNode of this.nailNodes) {
        nailNode.getComponent(Nail).initNailAngle();
      }
    }

    prepareReviveAnimation() {
      for (const nailNode of this.nailNodes) {
        nailNode.addComponent(UIOpacity);
        nailNode.getComponent(UIOpacity).opacity = 0;
        nailNode.getComponent(Nail).initNailAngle();
      }

      this.scheduleOnce(() => {
        this.finishReviveAnimation();
      }, 0.8);
    }

    finishReviveAnimation() {
      for (const nailNode of this.nailNodes) {
        nailNode.getComponent(UIOpacity).opacity = 255;
      }
    }

    pushForce(forceX, forceY) {
      if (this.isRigidEnabled) {
        this.node.getComponent(RigidBody2D).applyForce(v2(forceX, forceY), v2(0, 0), true);
      }
    }

    pushLinearVelocity(velocityX, velocityY) {
      if (this.isRigidEnabled) {
        this.node.getComponent(RigidBody2D).linearVelocity = v2(velocityX, velocityY);
      }
    }

    addTouchEvents() {
      this.node.on(NodeCtor.EventType.TOUCH_START, this.touchStartCallBack, this);
    }

    removeTouchEvents() {
      this.node.off(NodeCtor.EventType.TOUCH_START, this.touchStartCallBack, this);
    }

    touchStartCallBack() {}
  }

  return {
    Wood,
    WOOD_TEXTURE_DIRECTORY_BY_COLOR_INDEX,
    SINGLE_COLOR_WOOD_DIRECTORIES,
    INFERRED_FRAGMENT_GROUP_BY_WOOD_DIRECTORY,
  };
}

module.exports = {
  createWoodModule,
  WOOD_TEXTURE_DIRECTORY_BY_COLOR_INDEX,
  SINGLE_COLOR_WOOD_DIRECTORIES,
  INFERRED_FRAGMENT_GROUP_BY_WOOD_DIRECTORY,
};
