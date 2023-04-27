import React, { createRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useFade } from "@/hooks/useFade";

interface BackdropProps {
  onClick?: (e: MouseEvent) => void;
  onBackdropHide?: () => void;
  active?: boolean;
}

export function useBackdrop(): [
  (state: boolean) => void,
  BackdropProps,
  { style: any }
] {
  const [backdrop, setBackdropState] = useState(false);
  const [isHighlighted, setisHighlighted] = useState(false);

  const setBackdrop = (state: boolean) => {
    setBackdropState(state);
    if (state) setisHighlighted(true);
  };

  const backdropProps: BackdropProps = {
    active: backdrop,
    onBackdropHide() {
      setisHighlighted(false);
    },
  };

  const highlightedProps = {
    style: isHighlighted
      ? {
          zIndex: "1000",
          position: "relative",
        }
      : {},
  };

  return [setBackdrop, backdropProps, highlightedProps];
}

function Backdrop(props: BackdropProps) {
  const clickEvent = props.onClick || (() => {});
  const animationEvent = props.onBackdropHide || (() => {});
  const [isVisible, setVisible, fadeProps] = useFade();

  useEffect(() => {
    setVisible(!!props.active);
    /* eslint-disable-next-line */
  }, [props.active, setVisible]);

  useEffect(() => {
    if (!isVisible) animationEvent();
    /* eslint-disable-next-line */
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`pointer-events-auto fixed left-0 right-0 top-0 h-screen w-screen bg-black bg-opacity-50 opacity-100 transition-opacity ${
        !isVisible ? "opacity-0" : ""
      }`}
      {...fadeProps}
      onClick={(e) => clickEvent(e.nativeEvent)}
    />
  );
}

export function BackdropContainer(
  props: {
    children: React.ReactNode;
  } & BackdropProps
) {
  const root = createRef<HTMLDivElement>();
  const copy = createRef<HTMLDivElement>();

  useEffect(() => {
    let frame = -1;
    function poll() {
      if (root.current && copy.current) {
        const rect = root.current.getBoundingClientRect();
        copy.current.style.top = `${rect.top}px`;
        copy.current.style.left = `${rect.left}px`;
        copy.current.style.width = `${rect.width}px`;
        copy.current.style.height = `${rect.height}px`;
      }
      frame = window.requestAnimationFrame(poll);
    }
    poll();
    return () => {
      window.cancelAnimationFrame(frame);
    };
    // we dont want this to run only on mount, dont care about ref updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, copy]);

  return (
    <div ref={root}>
      {createPortal(
        <div className="pointer-events-none fixed left-0 top-0 z-[999]">
          <Backdrop active={props.active} {...props} />
          <div ref={copy} className="pointer-events-auto absolute">
            {props.children}
          </div>
        </div>,
        document.body
      )}
      <div className="invisible">{props.children}</div>
    </div>
  );
}
