import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { DecoratedVideoPlayer } from "@/components/video/DecoratedVideoPlayer";

export function MediaView() {
  const reactHistory = useHistory();
  const goBack = useCallback(() => {
    if (reactHistory.action !== "POP") reactHistory.goBack();
    else reactHistory.push("/");
  }, [reactHistory]);

  // TODO fetch meta
  // TODO call useScrape
  // TODO not found checks
  // TODO watched store
  // TODO scrape loading state
  // TODO error page with video header

  return (
    <DecoratedVideoPlayer title="Hello world" onGoBack={goBack} autoPlay />
  );
}
