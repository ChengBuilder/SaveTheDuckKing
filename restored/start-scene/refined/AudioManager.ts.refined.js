"use strict";

/**
 * Refined module (manual): chunks:///_virtual/AudioManager.ts
 * Source reference: restored/start-scene/AudioManager.ts.restored.js
 * NOTE:
 * - This file is for semantic restoration/readability only.
 * - It is not loaded by the runtime bundle pipeline.
 */

/**
 * @param {Record<string, any>} deps
 * deps.SingletonBase -> original "./Singleton.ts" default export
 * deps.GameModel -> original "./GameModel2.ts" exported GameModel
 * deps.ResManager -> original "./ResManager.ts" exported ResManager
 * deps.AdManager -> original "./AdManager.ts" exported AdManager
 * deps.Node -> original "cc" Node
 * deps.AudioSource -> original "cc" AudioSource
 * deps.director -> original "cc" director
 */
function createAudioManagerModule(deps) {
  const SingletonBase = deps && deps.SingletonBase;
  const GameModel = deps && deps.GameModel;
  const ResManager = deps && deps.ResManager;
  const AdManager = deps && deps.AdManager;
  const NodeCtor = deps && deps.Node;
  const AudioSourceCtor = deps && deps.AudioSource;
  const director = deps && deps.director;

  class AudioManager extends SingletonBase {
    constructor() {
      super();
      this.backgroundMusicSource = undefined;
      this.effectAudioSource = undefined;
      this.audioClipCache = {};
    }

    init() {
      console.log("Init AudioManager !");
      ResManager.instance.loadBundle("audioBundle");

      const backgroundMusicNode = new NodeCtor();
      backgroundMusicNode.name = "bgmAudio";
      director.getScene().addChild(backgroundMusicNode);
      director.addPersistRootNode(backgroundMusicNode);
      this.backgroundMusicSource = backgroundMusicNode.addComponent(AudioSourceCtor);

      const effectAudioNode = new NodeCtor();
      effectAudioNode.name = "soundAudio";
      director.getScene().addChild(effectAudioNode);
      director.addPersistRootNode(effectAudioNode);
      this.effectAudioSource = effectAudioNode.addComponent(AudioSourceCtor);
    }

    registerAudioClip(audioPath, audioClip) {
      if (this.audioClipCache[audioPath]) {
        console.log("audio already exists: " + audioPath);
        return;
      }

      this.audioClipCache[audioPath] = audioClip;
    }

    async playMusic(audioPath, volume) {
      const targetVolume = volume === undefined ? 0.5 : volume;
      if (!GameModel.instance.musicFlag) {
        return;
      }

      const bgmSource = this.backgroundMusicSource;
      bgmSource.stop();
      bgmSource.clip = null;
      bgmSource.loop = true;

      const cachedClip = this.audioClipCache[audioPath];
      if (cachedClip) {
        bgmSource.clip = cachedClip;
        await bgmSource.play();
      } else {
        await ResManager.instance.loadAudio(audioPath, (error, audioClip) => {
          if (error) {
            console.warn(error);
            return;
          }

          this.audioClipCache[audioPath] = audioClip;
          bgmSource.clip = audioClip;
          bgmSource.play();
        });
      }

      bgmSource.volume = targetVolume;
    }

    pauseMusic() {
      this.backgroundMusicSource.pause();
    }

    resumeMusic() {
      this.backgroundMusicSource.play();
    }

    stopMusic() {
      const bgmSource = this.backgroundMusicSource;
      bgmSource.stop();
      bgmSource.clip = null;
    }

    playLoopingEffect(audioPath, volume) {
      if (!GameModel.instance.soundFlag) {
        return;
      }

      const effectSource = this.effectAudioSource;
      const cachedClip = this.audioClipCache[audioPath];
      if (cachedClip) {
        effectSource.clip = cachedClip;
        effectSource.play();
      } else {
        ResManager.instance.loadAudio(audioPath, (error, audioClip) => {
          if (error) {
            console.warn(error);
            return;
          }

          this.audioClipCache[audioPath] = audioClip;
          effectSource.clip = audioClip;
          effectSource.play();
        });
      }

      effectSource.volume = volume;
    }

    pauseLoopingEffect() {
      this.effectAudioSource.pause();
    }

    resumeLoopingEffect() {
      this.effectAudioSource.play();
    }

    stopLoopingEffect() {
      const effectSource = this.effectAudioSource;
      effectSource.stop();
      effectSource.clip = null;
    }

    playSound(audioPath, volume) {
      const targetVolume = volume === undefined ? 0.5 : volume;
      if (!GameModel.instance.soundFlag) {
        return;
      }

      const effectSource = this.effectAudioSource;
      const cachedClip = this.audioClipCache[audioPath];
      if (cachedClip) {
        effectSource.playOneShot(cachedClip, targetVolume);
        if (audioPath === "click") {
          this.vibrateShort();
        }
        return;
      }

      ResManager.instance.loadAudio(audioPath, (error, audioClip) => {
        if (error) {
          console.warn(error);
          return;
        }

        this.audioClipCache[audioPath] = audioClip;
        effectSource.playOneShot(audioClip, targetVolume);
        if (audioPath === "click") {
          this.vibrateShort();
        }
      });
    }

    vibrateShort() {
      if (GameModel.instance.vibrateFlag) {
        AdManager.vibrate();
      }
    }

    get canPlaySound() {
      return GameModel.instance.loadFromLocal("soundFlag") === 1;
    }

    get canVibrate() {
      return GameModel.instance.loadFromLocal("vibrateFlag") === 1;
    }

    static get instance() {
      return super.getInstance();
    }
  }

  return {
    AudioManager
  };
}

module.exports = {
  createAudioManagerModule
};
