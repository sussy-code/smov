import {
  useChromecast,
  useChromecastAvailable,
} from "@/hooks/useChromecastAvailable";
import { useEffect, useRef } from "react";

function ChromeCastButton() {
  const ref = useRef<HTMLDivElement>(null);
  const available = useChromecastAvailable();

  useEffect(() => {
    if (!available) return;
    const tag = document.createElement("google-cast-launcher");
    tag.setAttribute("id", "castbutton");
    ref.current?.appendChild(tag);
  }, [available]);

  return <div ref={ref} />;
}

export function TestView() {
  const { startCast, stopCast } = useChromecast();

  return (
    <div>
      <ChromeCastButton />
      <button type="button" onClick={startCast}>
        Start casting
      </button>
      <button type="button" onClick={stopCast}>
        StopCasting
      </button>
    </div>
  );
}
