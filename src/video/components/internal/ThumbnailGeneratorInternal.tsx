import Hls from "hls.js";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

import { MWStreamType } from "@/backend/helpers/streams";
import { getPlayerState } from "@/video/state/cache";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { updateSource, useSource } from "@/video/state/logic/source";
import { Thumbnail } from "@/video/state/types";

async function* generate(
  videoUrl: string,
  streamType: MWStreamType,
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
  numThumbnails = 20
): AsyncGenerator<Thumbnail, Thumbnail> {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  if (!video) return { from: -1, to: -1, imgUrl: "" };
  if (!canvas) return { from: -1, to: -1, imgUrl: "" };
  console.log("extracting started", streamType.toString());
  if (streamType === MWStreamType.HLS) {
    const hls = new Hls();
    console.log("new hls instance");

    hls.attachMedia(video);
    hls.loadSource(videoUrl);
  }
  await new Promise((resolve, reject) => {
    video.addEventListener("loadedmetadata", resolve);
    video.addEventListener("error", reject);
  });

  canvas.height = video.videoHeight * 1;
  canvas.width = video.videoWidth * 1;
  let i = 0;
  while (i < numThumbnails) {
    const from = i * video.duration;
    const to = (i + 1) * video.duration;

    // Seek to the specified time
    video.currentTime = from;
    console.log(from, to);
    console.time("seek loaded");
    await new Promise((resolve) => {
      video.addEventListener("seeked", resolve);
    });
    console.timeEnd("seek loaded");
    console.log("loaded", video.currentTime, streamType.toString());

    const ctx = canvas.getContext("2d");
    if (!ctx) return { from: -1, to: -1, imgUrl: "" };
    // Draw the video frame on the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a data URL and add it to the list of thumbnails
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
  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const descriptor = useVideoPlayerDescriptor();
  const source = useSource(descriptor);
  const thumbnails = useRef<Thumbnail[]>([]);
  const abortController = useRef<AbortController>(new AbortController());
  const generator = useCallback(
    async (url: string, type: MWStreamType) => {
      for await (const thumbnail of generate(url, type, videoRef, canvasRef)) {
        if (abortController.current.signal.aborted) {
          console.log("broke out of loop", type.toString());
          break;
        }

        thumbnails.current = [...thumbnails.current, thumbnail];
        const state = getPlayerState(descriptor);
        if (!state.source) return;
        console.log("ran");
        state.source.thumbnails = thumbnails.current;
        console.log(thumbnails.current);

        updateSource(descriptor, state);
        console.log("ran 2");
      }
    },
    [descriptor]
  );

  useEffect(() => {
    const state = getPlayerState(descriptor);
    if (!state.source) return;
    const { url, type } = state.source;
    generator(url, type);
  }, [descriptor, generator, source.source?.url]);

  useEffect(() => {
    const controller = abortController.current;
    return () => {
      console.log("abort");
      controller.abort();
    };
  }, []);

  return null;
}
