import Hls from "hls.js";
import { useCallback, useEffect, useRef } from "react";

import { playerStatus } from "@/stores/player/slices/source";
import { ThumbnailImage } from "@/stores/player/slices/thumbnails";
import { usePlayerStore } from "@/stores/player/store";
import { LoadableSource, selectQuality } from "@/stores/player/utils/qualities";
import { usePreferencesStore } from "@/stores/preferences";
import { processCdnLink } from "@/utils/cdn";
import { isSafari } from "@/utils/detectFeatures";

function makeQueue(layers: number): number[] {
  const output = [0, 1];
  let segmentSize = 0.5;
  let lastSegmentAmount = 0;
  for (let layer = 0; layer < layers; layer += 1) {
    const segmentAmount = 1 / segmentSize - 1;
    for (let i = 0; i < segmentAmount - lastSegmentAmount; i += 1) {
      const offset = i * segmentSize * 2;
      output.push(offset + segmentSize);
    }
    lastSegmentAmount = segmentAmount;
    segmentSize /= 2;
  }
  return output;
}

class ThumnbnailWorker {
  interrupted: boolean;

  videoEl: HTMLVideoElement | null = null;

  canvasEl: HTMLCanvasElement | null = null;

  hls: Hls | null = null;

  cb: (img: ThumbnailImage) => void;

  constructor(ops: { addImage: (img: ThumbnailImage) => void }) {
    this.cb = ops.addImage;
    this.interrupted = false;
  }

  start(source: LoadableSource) {
    if (isSafari) return false;
    const el = document.createElement("video");
    el.setAttribute("muted", "true");
    const canvas = document.createElement("canvas");
    this.hls = new Hls();
    if (source.type === "mp4") {
      el.src = processCdnLink(source.url);
      el.crossOrigin = "anonymous";
    } else if (source.type === "hls") {
      this.hls.attachMedia(el);
      this.hls.loadSource(processCdnLink(source.url));
    } else throw new Error("Invalid loadable source type");
    this.videoEl = el;
    this.canvasEl = canvas;
    this.begin().catch((err) => console.error(err));
  }

  destroy() {
    this.interrupted = true;
    this.videoEl = null;
    this.canvasEl = null;
    this.hls?.detachMedia();
    this.hls?.destroy();
    this.hls = null;
  }

  private async initVideo() {
    if (!this.videoEl || !this.canvasEl) return;
    await new Promise((resolve, reject) => {
      this.videoEl?.addEventListener("loadedmetadata", resolve);
      this.videoEl?.addEventListener("error", reject);
    });
    if (!this.videoEl || !this.canvasEl) return;
    this.canvasEl.height = this.videoEl.videoHeight;
    this.canvasEl.width = this.videoEl.videoWidth;
  }

  private async takeSnapshot(at: number) {
    if (!this.videoEl || !this.canvasEl) return;
    this.videoEl.currentTime = at;
    await new Promise((resolve) => {
      const onSeeked = () => {
        this.videoEl?.removeEventListener("seeked", onSeeked);
        resolve(null);
      };
      this.videoEl?.addEventListener("seeked", onSeeked);
    });
    if (!this.videoEl || !this.canvasEl) return;
    const ctx = this.canvasEl.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(
      this.videoEl,
      0,
      0,
      this.canvasEl.width,
      this.canvasEl.height,
    );
    const imgUrl = this.canvasEl.toDataURL();

    if (this.interrupted) return;
    if (imgUrl === "data:," || !imgUrl) return; // failed image rendering

    this.cb({
      at,
      data: imgUrl,
    });
  }

  private async begin() {
    const vid = this.videoEl;
    if (!vid) return;
    await this.initVideo();

    const queue = makeQueue(6); // 7 layers is 63 thumbnails evenly distributed
    for (let i = 0; i < queue.length; i += 1) {
      if (this.interrupted) return;
      await this.takeSnapshot(vid.duration * queue[i]);
    }
  }
}

export function ThumbnailScraper() {
  const addImage = usePlayerStore((s) => s.thumbnails.addImage);
  const status = usePlayerStore((s) => s.status);
  const resetImages = usePlayerStore((s) => s.thumbnails.resetImages);
  const meta = usePlayerStore((s) => s.meta);
  const source = usePlayerStore((s) => s.source);
  const enableThumbnails = usePreferencesStore((s) => s.enableThumbnails);
  const workerRef = useRef<ThumnbnailWorker | null>(null);

  // object references dont always trigger changes, so we serialize it to detect *any* change
  const sourceSeralized = JSON.stringify(source);

  const start = useCallback(() => {
    let inputStream = null;
    if (source)
      inputStream = selectQuality(source, {
        automaticQuality: false,
        lastChosenQuality: "360",
      });
    // dont interrupt existing working
    if (workerRef.current) return;
    if (status !== playerStatus.PLAYING) return;
    if (!inputStream) return;
    resetImages();
    const ins = new ThumnbnailWorker({
      addImage,
    });
    workerRef.current = ins;
    ins.start(inputStream.stream);
  }, [source, addImage, resetImages, status]);

  const startRef = useRef(start);
  useEffect(() => {
    startRef.current = start;
  }, [start, status]);

  // start worker with the stream
  useEffect(() => {
    if (enableThumbnails) startRef.current();
  }, [sourceSeralized, enableThumbnails]);

  // destroy worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.destroy();
        workerRef.current = null;
      }
    };
  }, []);

  // if targeted meta changes, abort the scraper
  const serializedMeta = JSON.stringify({
    id: meta?.tmdbId,
    ep: meta?.episode?.tmdbId,
    se: meta?.season?.tmdbId,
  });
  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.destroy();
      workerRef.current = null;
    }
    if (enableThumbnails) startRef.current();
  }, [serializedMeta, sourceSeralized, status, enableThumbnails]);

  return null;
}
