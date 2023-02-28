import { Transition } from "@/components/Transition";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  show?: boolean;
  className?: string;
  height?: number;
  width?: number;
}

export function FloatingView(props: Props) {
  const { isMobile } = useIsMobile();
  const width = !isMobile ? `${props.width}px` : "100%";
  return (
    <Transition animation="slide-up" show={props.show}>
      <div
        className={[props.className ?? "", "absolute left-0 top-0"].join(" ")}
        data-floating-page="true"
        style={{
          height: props.height ? `${props.height}px` : undefined,
          width: props.width ? width : undefined,
        }}
      >
        {props.children}
      </div>
    </Transition>
  );
}
