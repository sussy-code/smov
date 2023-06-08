export interface Thumbnail {
  from: number;
  to: number;
  imgUrl: string;
}
export const SCALE_FACTOR = 0.1;
export default async function* extractThumbnails(
  videoUrl: string,
  numThumbnails: number
): AsyncGenerator<Thumbnail, Thumbnail> {
  const video = document.createElement("video");
  video.src = videoUrl;
  video.crossOrigin = "anonymous";

  // Wait for the video metadata to load
  const metadata = await new Promise((resolve, reject) => {
    video.addEventListener("loadedmetadata", resolve);
    video.addEventListener("error", reject);
  });

  const canvas = document.createElement("canvas");

  canvas.height = video.videoHeight * SCALE_FACTOR;
  canvas.width = video.videoWidth * SCALE_FACTOR;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { from: 0, to: 0, imgUrl: "" };

  for (let i = 0; i <= numThumbnails; i += 1) {
    const from = (i / (numThumbnails + 1)) * video.duration;
    const to = ((i + 1) / (numThumbnails + 1)) * video.duration;

    // Seek to the specified time
    video.currentTime = from;
    await new Promise((resolve) => {
      video.addEventListener("seeked", resolve);
    });

    // Draw the video frame on the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a data URL and add it to the list of thumbnails
    const imgUrl = canvas.toDataURL();

    yield {
      from,
      to,
      imgUrl,
    };
  }

  return { from: 0, to: 0, imgUrl: "" };
}
