import { useVideoPlayerState } from "../VideoContext";

export function ShowTitleControl() {
  const { videoState } = useVideoPlayerState();

  if (!videoState.seasonData.isSeries) return null;
  if (!videoState.seasonData.title || !videoState.seasonData.current)
    return null;

  const cur = videoState.seasonData.current;
  const selectedText = `S${cur.season} E${cur.episode}`;

  return (
    <p className="ml-8 select-none space-x-2 font-bold text-white">
      <span>{selectedText}</span>
      <span className="opacity-50">{videoState.seasonData.title}</span>
    </p>
  );
}
