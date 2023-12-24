import classNames from "classnames";
import FocusTrap from "focus-trap-react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Transition } from "@/components/utils/Transition";
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

export function OverlayPortal(props: {
  children?: ReactNode;
  darken?: boolean;
  show?: boolean;
  close?: () => void;
}) {
  const [portalElement, setPortalElement] = useState<Element | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const close = props.close;

  useEffect(() => {
    const element = ref.current?.closest(".popout-location");
    setPortalElement(element ?? document.body);
  }, []);

  return (
    <div ref={ref}>
      {portalElement
        ? createPortal(
            <Transition show={props.show} animation="none">
              <FocusTrap>
                <div className="popout-wrapper fixed overflow-hidden pointer-events-auto inset-0 z-[999] select-none">
                  <Transition animation="fade" isChild>
                    <div
                      onClick={close}
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
                    {/* a tabable index that does nothing - used so focus trap doesn't error when nothing is rendered yet */}
                    <div
                      tabIndex={1}
                      className="focus:ring-0 focus:outline-none opacity-0"
                    />
                    {props.children}
                  </Transition>
                </div>
              </FocusTrap>
            </Transition>,
            portalElement,
          )
        : null}
    </div>
  );
}

export function Overlay(props: OverlayProps) {
  const router = useInternalOverlayRouter(props.id);
  const realClose = router.close;

  // listen for anchor updates
  useRouterAnchorUpdate(props.id);

  const close = useCallback(() => {
    realClose();
  }, [realClose]);

  return (
    <OverlayPortal
      close={close}
      show={router.isOverlayActive()}
      darken={props.darken}
    >
      {props.children}
    </OverlayPortal>
  );
}
