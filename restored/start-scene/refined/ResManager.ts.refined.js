"use strict";

/**
 * Refined module (manual): chunks:///_virtual/ResManager.ts
 * Source reference: restored/start-scene/ResManager.ts.restored.js
 * NOTE:
 * - This file is for semantic restoration/readability only.
 * - It is not loaded by the runtime bundle pipeline.
 */

/**
 * @param {object} deps
 * deps.SingletonBase -> "./Singleton.ts" default export
 * deps.assetManager -> original "cc" assetManager
 * deps.js -> original "cc" js namespace
 * deps.Prefab -> original "cc" Prefab
 * deps.SpriteFrame -> original "cc" SpriteFrame
 * deps.JsonAsset -> original "cc" JsonAsset
 */
function createResManagerModule(deps) {
  const SingletonBase = deps && deps.SingletonBase;
  const assetManager = deps && deps.assetManager;
  const js = deps && deps.js;
  const Prefab = deps && deps.Prefab;
  const SpriteFrame = deps && deps.SpriteFrame;
  const JsonAsset = deps && deps.JsonAsset;

  class ResManager extends SingletonBase {
    constructor() {
      super();
      this._assetsCache = new Map();
    }

    /**
     * 加载 bundle，并返回 bundle 实例。
     * 原实现会直接把引擎回调包装成 Promise。
     */
    async loadBundle(bundleName, loadOptions) {
      return new Promise((resolve, reject) => {
        assetManager.loadBundle(bundleName, loadOptions, (error, bundle) => {
          if (error) {
            console.error("[ResManager] bundle load failed:", bundleName, error);
            reject(error);
            return;
          }

          resolve(bundle);
        });
      });
    }

    async bundleLoadDir(bundleName, directoryPath, assetType, onComplete) {
      const bundle = this.getBundleOrWarn(bundleName);
      if (!bundle) {
        return;
      }

      bundle.loadDir(directoryPath, assetType, onComplete);
    }

    /**
     * 从指定 bundle 加载单个资源。
     * 若资源已驻留在 bundle cache，则直接回调并结束 Promise。
     */
    async bundleLoad(bundleName, assetPath, assetType, onComplete) {
      const bundle = this.getBundleOrWarn(bundleName);
      if (!bundle) {
        return;
      }

      const cachedAsset = bundle.get(assetPath);
      return new Promise((resolve, reject) => {
        if (cachedAsset) {
          onComplete(null, cachedAsset);
          resolve(cachedAsset);
          return;
        }

        bundle.load(assetPath, assetType, (error, asset) => {
          if (error) {
            console.error(error);
            reject(error);
            return;
          }

          onComplete(null, asset);
          resolve(asset);
        });
      });
    }

    /**
     * 原始解包代码里这个方法没有真正调用 `loadScene`，
     * 只是检查 bundle 是否存在，然后把 scenePath 原样交给回调。
     * 这里按现状保留，避免错误脑补成另一套逻辑。
     */
    bundleLoadScene(bundleName, scenePath, sceneOptions, onComplete) {
      const bundle = this.getBundleOrWarn(bundleName);
      if (!bundle) {
        return;
      }

      onComplete(null, scenePath);
    }

    preloadBundleScene(bundleName, scenePath) {
      const bundle = this.getBundleOrWarn(bundleName);
      if (!bundle) {
        return;
      }

      bundle.preloadScene(scenePath);
    }

    loadAudio(audioPath, onComplete) {
      this.bundleLoad("audioBundle", audioPath, null, (error, audioClip) => {
        if (error) {
          console.log("audioBundle not exist: " + audioPath);
          return;
        }

        onComplete(error, audioClip);
      });
    }

    removeBundleAssets(bundleName, assetPath) {
      const bundle = this.getBundleOrWarn(bundleName);
      if (!bundle) {
        return;
      }

      bundle.release(assetPath);
    }

    clearBundleAssets(bundleName) {
      const bundle = this.getBundleOrWarn(bundleName);
      if (!bundle) {
        return;
      }

      bundle.releaseAll();
    }

    async setAsset(assetName, asset) {
      const cacheKey = this.createAssetCacheKey(assetName, asset);
      this._assetsCache.set(cacheKey, asset);
    }

    async saveToAssetsCache(assetList) {
      if (!assetList || assetList.length === 0) {
        return;
      }

      assetList.map(async (asset) => {
        if (asset && asset.name) {
          await this.setAsset(asset.name, asset);
        }
      });
    }

    removeAssetFromAssetsCache(assetName, assetClass) {
      const cacheKey = this.createAssetCacheKey(assetName, assetClass);
      this._assetsCache.delete(cacheKey);
    }

    clearAssetsCache() {
      this._assetsCache.clear();
    }

    getAsset(assetName, assetClass) {
      const cacheKey = this.createAssetCacheKey(assetName, assetClass);
      const asset = this._assetsCache.get(cacheKey);

      if (asset && asset instanceof assetClass) {
        return asset;
      }

      console.warn("未能找到资源: " + cacheKey);
      return null;
    }

    getPrefab(assetName) {
      return this.getAsset(assetName, Prefab) || null;
    }

    getSpriteFrame(assetName) {
      return this.getAsset(assetName, SpriteFrame) || this.warnMissingTypedAsset("图片资源", assetName);
    }

    getJsonAsset(assetName) {
      return this.getAsset(assetName, JsonAsset) || this.warnMissingTypedAsset("json资源", assetName);
    }

    createAssetCacheKey(assetName, assetOrClass) {
      return assetName + ":" + js.getClassName(assetOrClass);
    }

    warnMissingTypedAsset(label, assetName) {
      console.warn("未能找到" + label + ": " + assetName);
      return null;
    }

    getBundleOrWarn(bundleName) {
      const bundle = assetManager.getBundle(bundleName);
      if (!bundle) {
        console.warn("未能找到bundle: " + bundleName);
        return null;
      }

      return bundle;
    }

    get assetsCache() {
      return this._assetsCache;
    }

    static get instance() {
      return super.getInstance();
    }
  }

  return {
    ResManager,
  };
}

module.exports = {
  createResManagerModule,
};
