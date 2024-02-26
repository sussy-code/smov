import { useEffect, useRef, useState } from "react";

export function useIsMobile(horizontal?: boolean) {
  const [isMobile, setIsMobile] = useState(false);
  const isMobileCurrent = useRef<boolean | null>(false);

  useEffect(() => {
    function onResize() {
      const value = horizontal
        ? window.innerHeight < 600
        : window.innerWidth < 1024;
      const isChanged = isMobileCurrent.current !== value;
      if (!isChanged) return;

      isMobileCurrent.current = value;
      setIsMobile(value);
    }

    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [horizontal]);

  return {
    isMobile,
  };
}
