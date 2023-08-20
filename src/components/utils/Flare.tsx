import c from "classnames";
import { useEffect, useRef } from "react";

export interface FlareProps {
  className?: string;
  backgroundClass: string;
  flareSize?: number;
  cssColorVar?: string;
  enabled?: boolean;
}

const SIZE_DEFAULT = 200;
const CSS_VAR_DEFAULT = "--colors-global-accentA";

export function Flare(props: FlareProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const size = props.flareSize ?? SIZE_DEFAULT;
  const cssVar = props.cssColorVar ?? CSS_VAR_DEFAULT;

  useEffect(() => {
    function mouseMove(e: MouseEvent) {
      if (!outerRef.current) return;
      outerRef.current.style.setProperty(
        "--bg-x",
        `${(e.clientX - size / 2).toFixed(0)}px`
      );
      outerRef.current.style.setProperty(
        "--bg-y",
        `${(e.clientY - size / 2).toFixed(0)}px`
      );
    }
    document.addEventListener("mousemove", mouseMove);

    return () => document.removeEventListener("mousemove", mouseMove);
  }, [size]);

  return (
    <div
      ref={outerRef}
      className={c(
        "overflow-hidden, pointer-events-none absolute inset-0 hidden",
        props.className,
        {
          "!block": props.enabled ?? false,
        }
      )}
      style={{
        backgroundImage: `radial-gradient(circle at center, rgba(var(${cssVar}), 1), rgba(var(${cssVar}), 0) 70%)`,
        backgroundPosition: `var(--bg-x) var(--bg-y)`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundSize: "200px 200px",
      }}
    >
      <div
        className={c(
          "absolute inset-[2px] overflow-hidden",
          props.className,
          props.backgroundClass
        )}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(circle at center, rgba(var(${cssVar}), 1), rgba(var(${cssVar}), 0) 70%)`,
            backgroundPosition: `var(--bg-x) var(--bg-y)`,
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundSize: "200px 200px",
          }}
        />
      </div>
    </div>
  );
}
