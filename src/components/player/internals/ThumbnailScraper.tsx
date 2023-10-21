import Hls from "hls.js";
import { useEffect, useMemo, useRef } from "react";

import { ThumbnailImage } from "@/stores/player/slices/thumbnails";
import { usePlayerStore } from "@/stores/player/store";
import { LoadableSource, selectQuality } from "@/stores/player/utils/qualities";

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
    const el = document.createElement("video");
    const canvas = document.createElement("canvas");
    this.hls = new Hls();
    if (source.type === "mp4") {
      el.src = source.url;
      el.crossOrigin = "anonymous";
    } else if (source.type === "hls") {
      this.hls.attachMedia(el);
      this.hls.loadSource(source.url);
    } else throw new Error("Invalid loadable source type");
    this.videoEl = el;
    this.canvasEl = canvas;
    this.begin().catch((err) => console.error(err));
  }

  destroy() {
    this.hls?.detachMedia();
    this.hls?.destroy();
    this.hls = null;
    this.interrupted = true;
    this.videoEl = null;
    this.canvasEl = null;
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
      this.videoEl?.addEventListener("seeked", resolve);
    });
    if (!this.videoEl || !this.canvasEl) return;
    const ctx = this.canvasEl.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(
      this.videoEl,
      0,
      0,
      this.canvasEl.width,
      this.canvasEl.height
    );
    const imgUrl = this.canvasEl.toDataURL();
    this.cb({
      at,
      data: imgUrl,
    });
  }

  private async begin() {
    const vid = this.videoEl;
    if (!vid) return;
    await this.initVideo();
    if (this.interrupted) return;
    await this.takeSnapshot(vid.duration / 2);
  }
}

export function ThumbnailScraper() {
  const addImage = usePlayerStore((s) => s.thumbnails.addImage);
  const source = usePlayerStore((s) => s.source);
  const workerRef = useRef<ThumnbnailWorker | null>(null);

  const inputStream = useMemo(() => {
    if (!source) return null;
    return selectQuality(source, {
      automaticQuality: false,
      lastChosenQuality: "360",
    });
  }, [source]);

  // TODO stop worker on meta change

  // start worker with the stream
  useEffect(() => {
    // dont interrupt existing working
    if (workerRef.current) return;
    if (!inputStream) return;
    const ins = new ThumnbnailWorker({
      addImage,
    });
    workerRef.current = ins;
    ins.start(inputStream.stream);
  }, [inputStream, addImage]);

  // destroy worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) workerRef.current.destroy();
    };
  }, []);

  return null;
}
