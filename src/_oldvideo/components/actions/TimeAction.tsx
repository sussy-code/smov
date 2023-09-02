import { useTranslation } from "react-i18next";

import { useIsMobile } from "@/hooks/useIsMobile";
import { formatSeconds } from "@/utils/formatSeconds";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useInterface } from "@/video/state/logic/interface";
import { useMediaPlaying } from "@/video/state/logic/mediaplaying";
import { useProgress } from "@/video/state/logic/progress";
import { VideoPlayerTimeFormat } from "@/video/state/types";

function durationExceedsHour(secs: number): boolean {
  return secs > 60 * 60;
}

interface Props {
  className?: string;
  noDuration?: boolean;
}

export function TimeAction(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const videoTime = useProgress(descriptor);
  const mediaPlaying = useMediaPlaying(descriptor);
  const { setTimeFormat } = useControls(descriptor);
  const { timeFormat } = useInterface(descriptor);
  const { isMobile } = useIsMobile();
  const { t } = useTranslation();

  const hasHours = durationExceedsHour(videoTime.duration);

  const currentTime = formatSeconds(
    mediaPlaying.isDragSeeking ? videoTime.draggingTime : videoTime.time,
    hasHours
  );
  const duration = formatSeconds(videoTime.duration, hasHours);
  const remaining = formatSeconds(
    (videoTime.duration - videoTime.time) / mediaPlaying.playbackSpeed,
    hasHours
  );
  const timeFinished = new Date(
    new Date().getTime() +
      ((videoTime.duration - videoTime.time) * 1000) /
        mediaPlaying.playbackSpeed
  );
  const formattedTimeFinished = ` - ${t("videoPlayer.finishAt", {
    timeFinished,
    formatParams: {
      timeFinished: { hour: "numeric", minute: "numeric" },
    },
  })}`;

  let formattedTime: string;

  if (timeFormat === VideoPlayerTimeFormat.REGULAR) {
    formattedTime = `${currentTime} ${props.noDuration ? "" : `/ ${duration}`}`;
  } else if (timeFormat === VideoPlayerTimeFormat.REMAINING && !isMobile) {
    formattedTime = `${t("videoPlayer.timeLeft", {
      timeLeft: remaining,
    })}${videoTime.time === videoTime.duration ? "" : formattedTimeFinished} `;
  } else if (timeFormat === VideoPlayerTimeFormat.REMAINING && isMobile) {
    formattedTime = `-${remaining}`;
  } else {
    formattedTime = "";
  }

  return (
    <button
      type="button"
      className={[
        "group pointer-events-auto text-white transition-transform duration-100 active:scale-110",
      ].join(" ")}
      onClick={() => {
        setTimeFormat(
          timeFormat === VideoPlayerTimeFormat.REGULAR
            ? VideoPlayerTimeFormat.REMAINING
            : VideoPlayerTimeFormat.REGULAR
        );
      }}
    >
      <div
        className={[
          "flex items-center justify-center rounded-full bg-denim-600 bg-opacity-0 p-2 transition-colors duration-100 group-hover:bg-opacity-50 group-active:bg-denim-500 group-active:bg-opacity-100 sm:px-4",
        ].join(" ")}
      >
        <div className={props.className}>
          <p className="select-none text-white">{formattedTime}</p>
        </div>
      </div>
    </button>
  );
}
