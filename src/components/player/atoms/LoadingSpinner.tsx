import { Spinner } from "@/components/layout/Spinner";
import { usePlayerStore } from "@/stores/player/store";

export function LoadingSpinner() {
  const isLoading = usePlayerStore((s) => s.mediaPlaying.isLoading);

  if (!isLoading) return null;

  return <Spinner className="text-4xl" />;
}
