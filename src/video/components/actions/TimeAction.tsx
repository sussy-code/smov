import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useTranslation } from "react-i18next";
import { useMediaPlaying } from "@/video/state/logic/mediaplaying";
import { useProgress } from "@/video/state/logic/progress";
import { useInterface } from "@/video/state/logic/interface";

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
  const mediaPlaying = useMediaPlaying(descriptor);
  const { timeFormat, setTimeFormat } = useInterface(descriptor);
  const { t } = useTranslation();

  const hasHours = durationExceedsHour(videoTime.duration);
  const time = formatSeconds(
    mediaPlaying.isDragSeeking ? videoTime.draggingTime : videoTime.time,
    hasHours
  );
  const duration = formatSeconds(videoTime.duration, hasHours);

  const timeLeft = formatSeconds(
    (videoTime.duration - videoTime.time) / mediaPlaying.playbackSpeed
  );

  const timeFinished = new Date(
    new Date().getTime() +
      (videoTime.duration * 1000) / mediaPlaying.playbackSpeed
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <button
      type="button"
      className={[
        "group pointer-events-auto translate-x-[-16px] text-white transition-transform duration-100 active:scale-110",
      ].join(" ")}
      onClick={() => {
        setTimeFormat(timeFormat === 0 ? 1 : 0);
      }}
    >
      <div
        className={[
          "flex items-center justify-center rounded-full bg-denim-600 bg-opacity-0 p-2 transition-colors duration-100 group-hover:bg-opacity-50 group-active:bg-denim-500 group-active:bg-opacity-100 sm:px-4",
        ].join(" ")}
      >
        <div className={props.className}>
          <p className="select-none text-white">
            {/* {time} {props.noDuration ? "" : `/ ${duration}`} */}
            {timeFormat === 0
              ? `${time} ${props.noDuration ? "" : `/ ${duration}`}`
              : `${t("videoPlayer.timeLeft", {
                  timeLeft,
                })}${
                  videoTime.time === videoTime.duration
                    ? ""
                    : ` - ${t("videoPlayer.finishAt", {
                        timeFinished,
                      })}`
                } `}
          </p>
        </div>
      </div>
    </button>
  );
}
