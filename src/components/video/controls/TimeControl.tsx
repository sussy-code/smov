import { useVideoPlayerState } from "../VideoContext";

function durationExceedsHour(secs: number): boolean {
  return secs > 60 * 60;
}

function formatSeconds(secs: number, showHours = false): string {
  let time = secs;
  const seconds = time % 60;

  time /= 60;
  const minutes = time % 60;

  time /= 60;
  const hours = minutes % 60;

  const minuteString = `${Math.round(minutes)
    .toString()
    .padStart(2)}:${Math.round(seconds).toString().padStart(2, "0")}`;

  if (!showHours) return minuteString;
  return `${Math.round(hours).toString()}:${minuteString}`;
}

export function TimeControl() {
  const { videoState } = useVideoPlayerState();
  const hasHours = durationExceedsHour(videoState.duration);
  const time = formatSeconds(videoState.time, hasHours);
  const duration = formatSeconds(videoState.duration, hasHours);

  return (
    <p>
      {time} / {duration}
    </p>
  );
}
