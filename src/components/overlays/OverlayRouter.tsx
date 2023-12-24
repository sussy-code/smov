import { a, easings, useSpring } from "@react-spring/web";
import { ReactNode, useEffect, useMemo, useRef } from "react";

import { OverlayAnchorPosition } from "@/components/overlays/positions/OverlayAnchorPosition";
import { OverlayMobilePosition } from "@/components/overlays/positions/OverlayMobilePosition";
import { Flare } from "@/components/utils/Flare";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useInternalOverlayRouter } from "@/hooks/useOverlayRouter";
import { useOverlayStore } from "@/stores/overlay/store";

interface OverlayRouterProps {
  children?: ReactNode;
  id: string;
}

function RouterBase(props: { id: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useIsMobile();

  const routes = useOverlayStore((s) => s.routes);
  const router = useInternalOverlayRouter(props.id);
  const routeMeta = useMemo(
    () => routes[router.currentRoute ?? ""],
    [routes, router],
  );

  const [dimensions, api] = useSpring(
    () => ({
      from: {
        height: `${routeMeta?.height ?? 0}px`,
        width: isMobile ? "100%" : `${routeMeta?.width ?? 0}px`,
      },
      config: {
        easing: easings.linear,
      },
    }),
    [],
  );

  const currentState = useRef<null | string>(null);
  useEffect(() => {
    const data = {
      height: routeMeta?.height,
      width: routeMeta?.width,
      isMobile,
    };
    const dataStr = JSON.stringify(data);
    if (dataStr !== currentState.current) {
      const oldData = currentState.current
        ? JSON.parse(currentState.current)
        : null;
      currentState.current = dataStr;
      if (data.isMobile) {
        api.set({
          width: "100%",
        });
        api.start({
          height: `${routeMeta?.height ?? 0}px`,
        });
      } else if (oldData?.height === undefined && data.height !== undefined) {
        api.set({
          height: `${routeMeta?.height ?? 0}px`,
          width: `${routeMeta?.width ?? 0}px`,
        });
      } else {
        api.start({
          height: `${routeMeta?.height ?? 0}px`,
          width: `${routeMeta?.width ?? 0}px`,
        });
      }
    }
  }, [routeMeta?.height, routeMeta?.width, isMobile, api]);

  return (
    <a.div
      ref={ref}
      style={dimensions}
      className="overflow-hidden relative z-10 max-h-full"
    >
      <Flare.Base className="group w-full bg-video-context-border h-full rounded-2xl transition-colors duration-100 text-video-context-type-main">
        <Flare.Light
          flareSize={400}
          cssColorVar="--colors-video-context-light"
          backgroundClass="bg-video-context-background duration-100"
          className="rounded-2xl opacity-100"
        />
        <Flare.Child className="pointer-events-auto relative transition-transform duration-100 h-full">
          {props.children}
        </Flare.Child>
      </Flare.Base>
    </a.div>
  );
}

export function OverlayRouter(props: OverlayRouterProps) {
  const { isMobile } = useIsMobile();
  const content = <RouterBase id={props.id}>{props.children}</RouterBase>;

  if (isMobile) return <OverlayMobilePosition>{content}</OverlayMobilePosition>;
  return <OverlayAnchorPosition>{content}</OverlayAnchorPosition>;
}
