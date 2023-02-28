import { Transition } from "@/components/Transition";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  show?: boolean;
  className?: string;
  height: number;
  width: number;
}

export function FloatingView(props: Props) {
  const { isMobile } = useIsMobile();
  if (!props.show) return null;
  return (
    <div
      className={[props.className ?? "", "absolute"].join(" ")}
      data-floating-page="true"
      style={{
        height: `${props.height}px`,
        width: !isMobile ? `${props.width}px` : "100%",
      }}
    >
      {props.children}
    </div>
  );
  return (
    <Transition animation="slide-up" show={props.show}>
      <div data-floating-page="true" className={props.className}>
        {props.children}
      </div>
    </Transition>
  );
}
