import { useState } from "react";
import { useTranslation } from "react-i18next";

import { VideoPlayerButton } from "@/components/player/internals/Button";
import { usePlayerStore } from "@/stores/player/store";
import { formatSeconds } from "@/utils/formatSeconds";

export function Time() {
  const [timeMode, setTimeMode] = useState(true);

  const { duration, time, draggingTime } = usePlayerStore((s) => s.progress);
  const { isSeeking } = usePlayerStore((s) => s.interface);
  const { t } = useTranslation();

  function toggleMode() {
    setTimeMode(!timeMode);
  }

  const currentTime = Math.min(
    Math.max(isSeeking ? draggingTime : time, 0),
    duration
  );
  const secondsRemaining = Math.abs(currentTime - duration);
  const timeFinished = new Date(Date.now() + secondsRemaining * 1e3);

  const formattedTimeFinished = t("videoPlayer.finishAt", {
    timeFinished,
    formatParams: {
      timeFinished: { hour: "numeric", minute: "numeric" },
    },
  });

  const child = timeMode ? (
    <>
      {formatSeconds(currentTime)} <span>/ {formatSeconds(duration)}</span>
    </>
  ) : (
    <>
      {t("videoPlayer.timeLeft", { timeLeft: formatSeconds(secondsRemaining) })}{" "}
      • {formattedTimeFinished}
    </>
  );

  return (
    <VideoPlayerButton onClick={() => toggleMode()}>{child}</VideoPlayerButton>
  );
}
