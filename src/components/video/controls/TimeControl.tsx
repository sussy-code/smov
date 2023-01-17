import { useVideoPlayerState } from "../VideoContext";

function durationExceedsHour(secs: number): boolean {
  return secs > 60 * 60;
}

function formatSeconds(secs: number, showHours = false): string {
  if (Number.isNaN(secs)) {
    if (showHours) return "0:00:00";
    return "0:00";
  }

  let time = secs;
  const seconds = time % 60;

  time /= 60;
  const minutes = time % 60;

  time /= 60;
  const hours = time;

  if (!showHours)
    return `${Math.floor(minutes).toString()}:${Math.floor(seconds)
      .toString()
      .padStart(2, "0")}`;
  return `${Math.floor(hours).toString()}:${Math.floor(minutes)
    .toString()
    .padStart(2, "0")}:${Math.floor(seconds).toString().padStart(2, "0")}`;
}

interface Props {
  className?: string;
}

export function TimeControl(props: Props) {
  const { videoState } = useVideoPlayerState();
  const hasHours = durationExceedsHour(videoState.duration);
  const time = formatSeconds(videoState.time, hasHours);
  const duration = formatSeconds(videoState.duration, hasHours);

  return (
    <div className={props.className}>
      <p className="select-none text-white">
        {time} / {duration}
      </p>
    </div>
  );
}
