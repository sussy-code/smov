import { useCallback, useEffect, useRef, useState } from "react";

import { Icons } from "@/components/Icon";
import { VideoPlayerIconButton } from "@/video/components/parts/VideoPlayerIconButton";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMisc } from "@/video/state/logic/misc";

interface Props {
  className?: string;
}

export function ChromecastAction(props: Props) {
  const [hidden, setHidden] = useState(false);
  const descriptor = useVideoPlayerDescriptor();
  const misc = useMisc(descriptor);
  const isCasting = misc.isCasting;
  const ref = useRef<HTMLDivElement>(null);

  const setButtonVisibility = useCallback(
    (tag: HTMLElement) => {
      const isVisible = (tag.getAttribute("style") ?? "").includes("inline");
      setHidden(!isVisible);
    },
    [setHidden]
  );

  useEffect(() => {
    const tag = ref.current?.querySelector<HTMLElement>("google-cast-launcher");
    if (!tag) return;

    const observer = new MutationObserver(() => {
      setButtonVisibility(tag);
    });

    observer.observe(tag, { attributes: true, attributeFilter: ["style"] });
    setButtonVisibility(tag);

    return () => {
      observer.disconnect();
    };
  }, [setButtonVisibility]);

  return (
    <VideoPlayerIconButton
      ref={ref}
      className={[
        props.className ?? "",
        "google-cast-button",
        isCasting ? "casting" : "",
        hidden ? "hidden" : "",
      ].join(" ")}
      icon={Icons.CASTING}
      onClick={(e) => {
        const castButton = e.currentTarget.querySelector(
          "google-cast-launcher"
        );
        if (castButton) (castButton as HTMLDivElement).click();
      }}
    />
  );
}
