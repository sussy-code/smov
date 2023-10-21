import { useTranslation } from "react-i18next";

import { VideoPlayerButton } from "@/components/player/internals/Button";
import { VideoPlayerTimeFormat } from "@/stores/player/slices/interface";
import { usePlayerStore } from "@/stores/player/store";
import { durationExceedsHour, formatSeconds } from "@/utils/formatSeconds";

export function Time(props: { short?: boolean }) {
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

  let timeString;
  let timeFinishedString;
  if (props.short) {
    timeString = formatSeconds(currentTime, hasHours);
    timeFinishedString = `-${formatSeconds(
      secondsRemaining,
      durationExceedsHour(secondsRemaining)
    )}`;
  } else {
    timeString = `${formatSeconds(currentTime, hasHours)} / ${formatSeconds(
      duration,
      hasHours
    )}`;
    timeFinishedString = `${t("videoPlayer.timeLeft", {
      timeLeft: formatSeconds(
        secondsRemaining,
        durationExceedsHour(secondsRemaining)
      ),
    })} • ${formattedTimeFinished}`;
  }

  const child =
    timeFormat === VideoPlayerTimeFormat.REGULAR ? (
      <span>{timeString}</span>
    ) : (
      <span>{timeFinishedString}</span>
    );

  return (
    <VideoPlayerButton onClick={() => toggleMode()}>{child}</VideoPlayerButton>
  );
}
