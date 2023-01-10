import { Spinner } from "@/components/layout/Spinner";
import { useVideoPlayerState } from "../VideoContext";

export function LoadingControl() {
  const { videoState } = useVideoPlayerState();

  if (!videoState.isLoading) return null;

  return <Spinner />;
}
