import { useVideoPlayerState } from "../VideoContext";

export function LoadingControl() {
  const { videoState } = useVideoPlayerState();

  if (!videoState.isLoading) return null;

  return <p>Loading...</p>;
}
