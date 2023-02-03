import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useProgress } from "@/video/state/logic/progress";

function durationExceedsHour(secs: number): boolean {
  return secs > 60 * 60;
}

function formatSeconds(secs: number, showHours = false): string {
  if (Number.isNaN(secs)) {
    if (showHours) return "0:00:00";
    return "0:00";
  }

  let time = secs;
  const seconds = Math.floor(time % 60);

  time /= 60;
  const minutes = Math.floor(time % 60);

  time /= 60;
  const hours = Math.floor(time);

  const paddedSecs = seconds.toString().padStart(2, "0");
  const paddedMins = minutes.toString().padStart(2, "0");

  if (!showHours) return [paddedMins, paddedSecs].join(":");
  return [hours, paddedMins, paddedSecs].join(":");
}

interface Props {
  className?: string;
  noDuration?: boolean;
}

export function TimeAction(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const videoTime = useProgress(descriptor);

  const hasHours = durationExceedsHour(videoTime.duration);
  const time = formatSeconds(videoTime.time, hasHours);
  const duration = formatSeconds(videoTime.duration, hasHours);

  return (
    <div className={props.className}>
      <p className="select-none text-white">
        {time} {props.noDuration ? "" : `/ ${duration}`}
      </p>
    </div>
  );
}
