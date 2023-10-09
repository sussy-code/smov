import classNames from "classnames";
import { ReactNode } from "react";

import { Transition } from "@/components/Transition";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useInternalOverlayRouter } from "@/hooks/useOverlayRouter";

interface Props {
  id: string;
  path: string;
  children?: ReactNode;
  className?: string;
  height?: number;
  width?: number;
}

export function OverlayPage(props: Props) {
  const router = useInternalOverlayRouter(props.id);
  const backwards = router.showBackwardsTransition(props.path);
  const show = router.isCurrentPage(props.path);

  const { isMobile } = useIsMobile();
  const width = !isMobile ? `${props.width}px` : "100%";
  return (
    <Transition
      animation={backwards ? "slide-full-left" : "slide-full-right"}
      className="absolute inset-0"
      durationClass="duration-[400ms]"
      show={show}
    >
      <div
        className={classNames([
          props.className,
          "grid grid-rows-[auto,minmax(0,1fr)]",
        ])}
        data-floating-page={show ? "true" : undefined}
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
