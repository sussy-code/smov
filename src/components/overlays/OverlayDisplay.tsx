import classNames from "classnames";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Transition } from "@/components/Transition";
import {
  useInternalOverlayRouter,
  useRouterAnchorUpdate,
} from "@/hooks/useOverlayRouter";

export interface OverlayProps {
  id: string;
  children?: ReactNode;
  darken?: boolean;
}

export function OverlayDisplay(props: { children: ReactNode }) {
  const router = useInternalOverlayRouter("hello world :)");
  const refRouter = useRef(router);

  // close router on first mount, we dont want persist routes for overlays
  useEffect(() => {
    const r = refRouter.current;
    r.close();
    return () => {
      r.close();
    };
  }, []);
  return <div className="popout-location">{props.children}</div>;
}

export function Overlay(props: OverlayProps) {
  const router = useInternalOverlayRouter(props.id);
  const [portalElement, setPortalElement] = useState<Element | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef<Element | null>(null);

  // listen for anchor updates
  useRouterAnchorUpdate(props.id);

  useEffect(() => {
    function listen(e: MouseEvent) {
      target.current = e.target as Element;
    }
    document.addEventListener("mousedown", listen);
    return () => {
      document.removeEventListener("mousedown", listen);
    };
  });

  const click = useCallback(
    (e: React.MouseEvent) => {
      const startedTarget = target.current;
      target.current = null;
      if (e.currentTarget !== e.target) return;
      if (!startedTarget) return;
      if (!startedTarget.isEqualNode(e.currentTarget as Element)) return;
      router.close();
    },
    [router]
  );

  useEffect(() => {
    const element = ref.current?.closest(".popout-location");
    setPortalElement(element ?? document.body);
  }, []);

  return (
    <div ref={ref}>
      {portalElement
        ? createPortal(
            <Transition show={router.isOverlayActive()} animation="none">
              <div className="popout-wrapper absolute overflow-hidden pointer-events-auto inset-0 z-[999] select-none">
                <Transition animation="fade" isChild>
                  <div
                    onClick={click}
                    className={classNames({
                      "absolute inset-0": true,
                      "bg-black opacity-90": props.darken,
                    })}
                  />
                </Transition>
                <Transition
                  animation="slide-up"
                  className="absolute inset-0 pointer-events-none"
                  isChild
                >
                  {props.children}
                </Transition>
              </div>
            </Transition>,
            portalElement
          )
        : null}
    </div>
  );
}
