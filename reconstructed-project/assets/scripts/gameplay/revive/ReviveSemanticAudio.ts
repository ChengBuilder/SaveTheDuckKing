import { assetManager, AudioClip, AudioSource, Bundle } from 'cc';

const REVIVE_AUDIO_ASSET_PATHS = {
  woodAssembleLead: 'audio/gameplay/revive/woodAssembleLead',
  woodAssembleFollow: 'audio/gameplay/revive/woodAssembleFollow',
  woodCollision: 'audio/gameplay/revive/woodCollision'
} as const;

export type ReviveAudioCue = keyof typeof REVIVE_AUDIO_ASSET_PATHS;

const audioClipPromiseCache = new Map<ReviveAudioCue, Promise<AudioClip | null>>();

export async function preloadReviveAudio(): Promise<void> {
  const cues = Object.keys(REVIVE_AUDIO_ASSET_PATHS) as ReviveAudioCue[];
  await Promise.all(cues.map((cue) => loadReviveAudioClip(cue)));
}

export async function playReviveAudio(
  source: AudioSource | null,
  cue: ReviveAudioCue,
  volumeScale = 1
): Promise<boolean> {
  if (!source) {
    return false;
  }

  const clip = await loadReviveAudioClip(cue);
  if (!clip) {
    return false;
  }

  source.playOneShot(clip, volumeScale);
  return true;
}

function loadReviveAudioClip(cue: ReviveAudioCue): Promise<AudioClip | null> {
  const cached = audioClipPromiseCache.get(cue);
  if (cached) {
    return cached;
  }

  const promise = loadAudioClipFromMainBundle(REVIVE_AUDIO_ASSET_PATHS[cue]);
  audioClipPromiseCache.set(cue, promise);
  return promise;
}

function loadAudioClipFromMainBundle(assetPath: string): Promise<AudioClip | null> {
  const mainBundle = (assetManager.getBundle('main') ||
    ((assetManager as unknown as { main?: Bundle }).main || null)) as Bundle | null;
  if (!mainBundle) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    mainBundle.load(assetPath, AudioClip, (error, clip) => {
      if (error || !clip) {
        resolve(null);
        return;
      }
      resolve(clip);
    });
  });
}
