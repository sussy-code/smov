import classNames from "classnames";
import { ReactNode, useEffect, useMemo } from "react";

import {
  Transition,
  TransitionAnimations,
} from "@/components/utils/Transition";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useInternalOverlayRouter } from "@/hooks/useOverlayRouter";
import { useOverlayStore } from "@/stores/overlay/store";

interface Props {
  id: string;
  path: string;
  children?: ReactNode;
  className?: string;
  height: number;
  width: number;
}

export function OverlayPage(props: Props) {
  const router = useInternalOverlayRouter(props.id);
  const backwards = router.showBackwardsTransition(props.path);
  const show = router.isCurrentPage(props.path);
  const registerRoute = useOverlayStore((s) => s.registerRoute);
  const path = useMemo(() => router.makePath(props.path), [props.path, router]);
  const { isMobile } = useIsMobile();

  useEffect(() => {
    registerRoute({
      id: path,
      width: props.width,
      height: props.height,
    });
  }, [props.height, props.width, path, registerRoute]);

  const width = !isMobile ? `${props.width}px` : "100%";
  let animation: TransitionAnimations = "none";
  if (backwards === "yes" || backwards === "no")
    animation = backwards === "yes" ? "slide-full-left" : "slide-full-right";

  return (
    <Transition
      animation={animation}
      className="absolute inset-0"
      durationClass="duration-[400ms]"
      show={show}
    >
      <div
        className={classNames(["grid grid-rows-1 max-h-full", props.className])}
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
