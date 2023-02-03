import { Spinner } from "@/components/layout/Spinner";
import { useVideoPlayerState } from "../VideoContext";

export function LoadingControl() {
  const { videoState } = useVideoPlayerState();

  const isLoading = videoState.isFirstLoading || videoState.isLoading;

  if (!isLoading) return null;

  return <Spinner />;
}
