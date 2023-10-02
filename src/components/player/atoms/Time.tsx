import { useTranslation } from "react-i18next";

import { VideoPlayerButton } from "@/components/player/internals/Button";
import { VideoPlayerTimeFormat } from "@/stores/player/slices/interface";
import { usePlayerStore } from "@/stores/player/store";
import { formatSeconds } from "@/utils/formatSeconds";

function durationExceedsHour(secs: number): boolean {
  return secs > 60 * 60;
}

export function Time() {
  const timeFormat = usePlayerStore((s) => s.interface.timeFormat);
  const setTimeFormat = usePlayerStore((s) => s.setTimeFormat);

  const { duration, time, draggingTime } = usePlayerStore((s) => s.progress);
  const { isSeeking } = usePlayerStore((s) => s.interface);
  const { t } = useTranslation();
  const hasHours = durationExceedsHour(duration);

  function toggleMode() {
    setTimeFormat(
      timeFormat === VideoPlayerTimeFormat.REGULAR
        ? VideoPlayerTimeFormat.REMAINING
        : VideoPlayerTimeFormat.REGULAR
    );
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

  const child =
    timeFormat === VideoPlayerTimeFormat.REGULAR ? (
      <>
        {formatSeconds(currentTime, hasHours)}{" "}
        <span>/ {formatSeconds(duration, hasHours)}</span>
      </>
    ) : (
      <>
        {t("videoPlayer.timeLeft", {
          timeLeft: formatSeconds(
            secondsRemaining,
            durationExceedsHour(secondsRemaining)
          ),
        })}{" "}
        • {formattedTimeFinished}
      </>
    );

  return (
    <VideoPlayerButton onClick={() => toggleMode()}>{child}</VideoPlayerButton>
  );
}
