import c from "classnames";
import { ReactNode, useEffect, useRef } from "react";
import "./Flare.css";

export interface FlareProps {
  className?: string;
  backgroundClass: string;
  flareSize?: number;
  cssColorVar?: string;
  enabled?: boolean;
}

const SIZE_DEFAULT = 200;
const CSS_VAR_DEFAULT = "--colors-global-accentA";

function Base(props: {
  className?: string;
  children?: ReactNode;
  tabIndex?: number;
  onKeyUp?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      tabIndex={props.tabIndex}
      className={c(props.className, "relative")}
      onKeyUp={props.onKeyUp}
    >
      {props.children}
    </div>
  );
}

function Child(props: { className?: string; children?: ReactNode }) {
  return <div className={c(props.className, "relative")}>{props.children}</div>;
}

function Light(props: FlareProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const size = props.flareSize ?? SIZE_DEFAULT;
  const cssVar = props.cssColorVar ?? CSS_VAR_DEFAULT;

  useEffect(() => {
    function mouseMove(e: MouseEvent) {
      if (!outerRef.current) return;
      const rect = outerRef.current.getBoundingClientRect();
      const halfSize = size / 2;
      outerRef.current.style.setProperty(
        "--bg-x",
        `${(e.clientX - rect.left - halfSize).toFixed(0)}px`,
      );
      outerRef.current.style.setProperty(
        "--bg-y",
        `${(e.clientY - rect.top - halfSize).toFixed(0)}px`,
      );
    }
    document.addEventListener("mousemove", mouseMove);

    return () => document.removeEventListener("mousemove", mouseMove);
  }, [size]);

  return (
    <div
      ref={outerRef}
      className={c(
        "flare-light pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-[400ms]",
        props.className,
        {
          "!opacity-100": props.enabled ?? false,
        },
      )}
      style={{
        backgroundImage: `radial-gradient(circle at center, rgba(var(${cssVar}) / 1), rgba(var(${cssVar}) / 0) 70%)`,
        backgroundPosition: `var(--bg-x) var(--bg-y)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${size.toFixed(0)}px ${size.toFixed(0)}px`,
      }}
    >
      <div
        className={c(
          "absolute inset-[1px] overflow-hidden",
          props.className,
          props.backgroundClass,
        )}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at center, rgba(var(${cssVar}) / 1), rgba(var(${cssVar}) / 0) 70%)`,
            backgroundPosition: `var(--bg-x) var(--bg-y)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${size.toFixed(0)}px ${size.toFixed(0)}px`,
          }}
        />
      </div>
    </div>
  );
}

export const Flare = {
  Base,
  Light,
  Child,
};
