import { ReactNode } from "react";

import { Transition } from "@/components/Transition";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  children?: ReactNode;
  show?: boolean;
  className?: string;
  height?: number;
  width?: number;
  active?: boolean; // true if a child view is loaded
}

export function FloatingView(props: Props) {
  const { isMobile } = useIsMobile();
  const width = !isMobile ? `${props.width}px` : "100%";
  return (
    <Transition
      animation={props.active ? "slide-full-left" : "slide-full-right"}
      className="absolute inset-0"
      durationClass="duration-[400ms]"
      show={props.show}
    >
      <div
        className={[
          props.className ?? "",
          "grid grid-rows-[auto,minmax(0,1fr)]",
        ].join(" ")}
        data-floating-page={props.show ? "true" : undefined}
        style={{
          height: props.height ? `${props.height}px` : undefined,
          maxHeight: "70vh",
          width: props.width ? width : undefined,
        }}
      >
        {props.children}
      </div>
    </Transition>
  );
}
