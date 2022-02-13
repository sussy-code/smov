import { useFade } from "hooks/useFade";
import { useEffect, useState } from "react";

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

export function Backdrop(props: BackdropProps) {
  const clickEvent = props.onClick || ((e: MouseEvent) => {});
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
      className={`fixed top-0 left-0 right-0 z-[999] h-screen bg-black bg-opacity-50 opacity-100 transition-opacity ${
        !isVisible ? "opacity-0" : ""
      }`}
      {...fadeProps}
      onClick={(e) => clickEvent(e.nativeEvent)}
    ></div>
  );
}
