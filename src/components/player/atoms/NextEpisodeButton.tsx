import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon, Icons } from "@/components/Icon";
import { usePlayerMeta } from "@/components/player/hooks/usePlayerMeta";
import { Transition } from "@/components/utils/Transition";
import { PlayerMeta } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";

function shouldShowNextEpisodeButton(
  time: number,
  duration: number,
): "always" | "hover" | "none" {
  const percentage = time / duration;
  const secondsFromEnd = duration - time;
  if (secondsFromEnd <= 30) return "always";
  if (percentage >= 0.93) return "hover";
  return "none";
}

function shouldStartCountdown(time: number, duration: number): boolean {
  const secondsFromEnd = duration - time;
  return secondsFromEnd <= 30 || time / duration >= 0.93;
}

function Button(props: {
  className: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={classNames(
        "font-bold rounded h-10 w-40 scale-95 hover:scale-100 transition-all duration-200",
        props.className,
      )}
      type="button"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export function NextEpisodeButton(props: {
  controlsShowing: boolean;
  onChange?: (meta: PlayerMeta) => void;
}) {
  const { t } = useTranslation();
  const duration = usePlayerStore((s) => s.progress.duration);
  const isHidden = usePlayerStore((s) => s.interface.hideNextEpisodeBtn);
  const meta = usePlayerStore((s) => s.meta);
  const { setDirectMeta } = usePlayerMeta();
  const metaType = usePlayerStore((s) => s.meta?.type);
  const time = usePlayerStore((s) => s.progress.time);
  const showingState = shouldShowNextEpisodeButton(time, duration);
  const status = usePlayerStore((s) => s.status);
  const setShouldStartFromBeginning = usePlayerStore(
    (s) => s.setShouldStartFromBeginning,
  );
  const [countdown, setCountdown] = useState(15);

  let show = false;
  if (showingState === "always") show = true;
  else if (showingState === "hover" && props.controlsShowing) show = true;
  if (isHidden || status !== "playing" || duration === 0) show = false;

  const animation = showingState === "hover" ? "slide-up" : "fade";
  let bottom = "bottom-[calc(6rem+env(safe-area-inset-bottom))]";
  if (showingState === "always")
    bottom = props.controlsShowing
      ? bottom
      : "bottom-[calc(3rem+env(safe-area-inset-bottom))]";

  const nextEp = meta?.episodes?.find(
    (v) => v.number === (meta?.episode?.number ?? 0) + 1,
  );

  const loadNextEpisode = useCallback(() => {
    if (!meta || !nextEp) return;
    const metaCopy = { ...meta };
    metaCopy.episode = nextEp;
    setShouldStartFromBeginning(true);
    setDirectMeta(metaCopy);
    props.onChange?.(metaCopy);
  }, [setDirectMeta, nextEp, meta, props, setShouldStartFromBeginning]);

  const startCurrentEpisodeFromBeginning = useCallback(() => {
    if (!meta || !meta.episode) return;
    const metaCopy = { ...meta };
    setShouldStartFromBeginning(true);
    setDirectMeta(metaCopy);
    props.onChange?.(metaCopy);
  }, [setDirectMeta, meta, props, setShouldStartFromBeginning]);

  useEffect(() => {
    // Function to calculate the initial countdown value based on current time and duration.
    const calculateCountdown = () => {
      const secondsFromEnd = duration - time;
      if (secondsFromEnd <= 30) {
        return Math.max(secondsFromEnd, 0); // Ensure countdown doesn't go below 0.
      }
      return 15; // Default countdown start value if within the last 30 seconds.
    };

    // Update countdown based on current playback time.
    const updateCountdown = () => {
      if (status === "playing") {
        const newCountdown = calculateCountdown();
        setCountdown(newCountdown);
      }
    };

    // Call updateCountdown initially and whenever relevant dependencies change.
    updateCountdown();

    // Set up an interval to update the countdown every second if the video is playing.
    let intervalId: number | null = null;
    if (status === "playing") {
      intervalId = window.setInterval(() => {
        updateCountdown();
      }, 1000);
    }

    // Cleanup function to clear the interval when the component unmounts or dependencies change.
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [time, duration, status]); // Depend on time, duration, and status to re-evaluate when they change.

  if (!meta?.episode || !nextEp) return null;
  if (metaType !== "show") return null;

  return (
    <Transition
      animation={animation}
      show={show}
      className="absolute right-[calc(3rem+env(safe-area-inset-right))] bottom-0"
    >
      <div
        className={classNames([
          "absolute bottom-0 right-0 transition-[bottom] duration-200 flex flex-col items-center space-y-3",
          bottom,
        ])}
      >
        {countdown > 0 && show && (
          <div className="text-white mb-2">
            {t("player.nextEpisode.nextIn", { seconds: countdown })}
          </div>
        )}
        <div className="flex items-center space-x-3">
          <Button
            className="py-px box-content bg-buttons-secondary hover:bg-buttons-secondaryHover bg-opacity-90 text-buttons-secondaryText justify-center items-center"
            onClick={() => startCurrentEpisodeFromBeginning()}
          >
            {t("player.nextEpisode.replay")}
          </Button>
          <Button
            onClick={() => loadNextEpisode()}
            className="bg-buttons-primary hover:bg-buttons-primaryHover text-buttons-primaryText flex justify-center items-center"
          >
            <Icon className="text-xl mr-1" icon={Icons.SKIP_EPISODE} />
            {countdown > 0 && show
              ? t("player.nextEpisode.nextIn", { seconds: countdown })
              : t("player.nextEpisode.next")}
          </Button>
        </div>
      </div>
    </Transition>
  );
}
