import fscreen from "fscreen";
import Hls from "hls.js";

export const isSafari = /^((?!chrome|android).)*safari/i.test(
  navigator.userAgent,
);

let cachedVolumeResult: boolean | null = null;
export async function canChangeVolume(): Promise<boolean> {
  if (cachedVolumeResult === null) {
    const timeoutPromise = new Promise<false>((resolve) => {
      setTimeout(() => resolve(false), 1e3);
    });
    const promise = new Promise<true>((resolve) => {
      const video = document.createElement("video");
      const handler = () => {
        video.removeEventListener("volumechange", handler);
        resolve(true);
      };

      video.addEventListener("volumechange", handler);

      video.volume = 0.5;
    });

    cachedVolumeResult = await Promise.race([promise, timeoutPromise]);
  }
  return cachedVolumeResult;
}

export function canFullscreenAnyElement(): boolean {
  return fscreen.fullscreenEnabled;
}

export function canWebkitFullscreen(): boolean {
  return canFullscreenAnyElement() || isSafari;
}

export function canFullscreen(): boolean {
  return canFullscreenAnyElement() || canWebkitFullscreen();
}

export function canPictureInPicture(): boolean {
  return "pictureInPictureEnabled" in document;
}

export function canWebkitPictureInPicture(): boolean {
  return "webkitSupportsPresentationMode" in document.createElement("video");
}

export function canPlayHlsNatively(video: HTMLVideoElement): boolean {
  if (Hls.isSupported()) return false; // no need to play natively
  return !!video.canPlayType("application/vnd.apple.mpegurl");
}
