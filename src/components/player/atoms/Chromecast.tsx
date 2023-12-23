import { useCallback, useEffect, useRef, useState } from "react";

import { Icons } from "@/components/Icon";
import { VideoPlayerButton } from "@/components/player/internals/Button";
import { usePlayerStore } from "@/stores/player/store";

export interface ChromecastProps {
  className?: string;
}

export function Chromecast(props: ChromecastProps) {
  const [hidden, setHidden] = useState(false);
  const isCasting = usePlayerStore((s) => s.interface.isCasting);
  const ref = useRef<HTMLButtonElement>(null);

  const setButtonVisibility = useCallback(
    (tag: HTMLElement) => {
      const isVisible = (tag.getAttribute("style") ?? "").includes("inline");
      setHidden(!isVisible);
    },
    [setHidden],
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
    <VideoPlayerButton
      ref={ref}
      className={[
        props.className ?? "",
        "google-cast-button",
        isCasting ? "casting" : "",
        hidden ? "hidden" : "",
      ].join(" ")}
      icon={Icons.CASTING}
      onClick={(el) => {
        const castButton = el.querySelector("google-cast-launcher");
        if (castButton) (castButton as HTMLDivElement).click();
      }}
    />
  );
}
