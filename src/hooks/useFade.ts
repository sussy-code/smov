import React, { useEffect, useState } from "react";
import "./useFade.css";

export const useFade = (
  initial = false
): [boolean, React.Dispatch<React.SetStateAction<boolean>>, any] => {
  const [show, setShow] = useState<boolean>(initial);
  const [isVisible, setVisible] = useState<boolean>(show);

  // Update visibility when show changes
  useEffect(() => {
    if (show) setVisible(true);
  }, [show]);

  // When the animation finishes, set visibility to false
  const onAnimationEnd = () => {
    if (!show) setVisible(false);
  };

  const style = { animation: `${show ? "fadeIn" : "fadeOut"} .3s` };

  // These props go on the fading DOM element
  const fadeProps = {
    style,
    onAnimationEnd,
  };

  return [isVisible, setShow, fadeProps];
};
