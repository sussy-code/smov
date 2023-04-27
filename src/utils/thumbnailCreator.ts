export default async function extractThumbnails(
  videoUrl: string,
  numThumbnails: number
): Promise<string[]> {
  const video = document.createElement("video");
  video.src = videoUrl;
  video.crossOrigin = "anonymous";

  // Wait for the video metadata to load
  const metadata = await new Promise((resolve, reject) => {
    video.addEventListener("loadedmetadata", resolve);
    video.addEventListener("error", reject);
  });
  console.log(metadata);

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  const thumbnails = [];
  if (!ctx) return [""];

  for (let i = 0; i < numThumbnails; i += 1) {
    const time = ((i + 1) / (numThumbnails + 1)) * video.duration;

    // Seek to the specified time
    video.currentTime = time;
    await new Promise((resolve) => {
      video.addEventListener("seeked", resolve);
    });

    // Draw the video frame on the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a data URL and add it to the list of thumbnails
    const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
    thumbnails.push(thumbnailUrl);
  }

  return thumbnails;
}
