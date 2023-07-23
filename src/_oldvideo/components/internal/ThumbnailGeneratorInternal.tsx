import Hls from "hls.js";
import { RefObject, useCallback, useEffect, useRef } from "react";

import { getPlayerState } from "@/_oldvideo/state/cache";
import { useVideoPlayerDescriptor } from "@/_oldvideo/state/hooks";
import { updateSource, useSource } from "@/_oldvideo/state/logic/source";
import { Thumbnail } from "@/_oldvideo/state/types";
import { MWStreamType } from "@/backend/helpers/streams";

async function* generate(
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
  index = 0,
  numThumbnails = 20
): AsyncGenerator<Thumbnail, Thumbnail> {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  if (!video) return { from: -1, to: -1, imgUrl: "" };
  if (!canvas) return { from: -1, to: -1, imgUrl: "" };
  await new Promise((resolve, reject) => {
    video.addEventListener("loadedmetadata", resolve);
    video.addEventListener("error", reject);
  });

  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { from: -1, to: -1, imgUrl: "" };
  let i = index;
  const limit = numThumbnails - 1;
  const step = video.duration / limit;
  while (i < limit && !Number.isNaN(video.duration)) {
    const from = i * step;
    const to = (i + 1) * step;
    video.currentTime = from;
    await new Promise((resolve) => {
      video.addEventListener("seeked", resolve);
    });

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imgUrl = canvas.toDataURL();
    i += 1;
    yield {
      from,
      to,
      imgUrl,
    };
  }

  return { from: -1, to: -1, imgUrl: "" };
}

export default function ThumbnailGeneratorInternal() {
  const descriptor = useVideoPlayerDescriptor();
  const source = useSource(descriptor);

  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const hlsRef = useRef<Hls>(new Hls());
  const thumbnails = useRef<Thumbnail[]>([]);
  const abortController = useRef<AbortController>(new AbortController());

  const generator = useCallback(
    async (videoUrl: string, streamType: MWStreamType) => {
      const prevIndex = thumbnails.current.length;
      const video = videoRef.current;
      if (streamType === MWStreamType.HLS) {
        hlsRef.current.attachMedia(video);
        hlsRef.current.loadSource(videoUrl);
      } else {
        video.crossOrigin = "anonymous";
        video.src = videoUrl;
      }

      for await (const thumbnail of generate(videoRef, canvasRef, prevIndex)) {
        if (abortController.current.signal.aborted) {
          if (streamType === MWStreamType.HLS) hlsRef.current.detachMedia();
          abortController.current = new AbortController();
          const state = getPlayerState(descriptor);
          if (!state.source) return;
          const { url, type } = state.source;
          generator(url, type);
          break;
        }

        if (thumbnail.from === -1) continue;
        thumbnails.current = [...thumbnails.current, thumbnail];
        const state = getPlayerState(descriptor);
        if (!state.source) return;
        state.source.thumbnails = thumbnails.current;
        updateSource(descriptor, state);
      }
    },
    [descriptor]
  );

  useEffect(() => {
    const controller = abortController.current;
    const state = getPlayerState(descriptor);
    if (!state.source) return;
    const { url, type } = state.source;
    generator(url, type);
    return () => {
      if (!source.source?.url) return;
      controller.abort();
    };
  }, [descriptor, generator, source.source?.url]);

  return null;
}
