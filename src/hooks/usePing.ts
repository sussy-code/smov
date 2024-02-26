import { useEffect, useRef } from "react";

import { useBannerStore } from "@/stores/banner";

export function useOnlineListener() {
  const updateOnline = useBannerStore((s) => s.updateOnline);
  const ref = useRef<boolean>(true);

  useEffect(() => {
    let counter = 0;

    let abort: null | AbortController = null;
    const interval = setInterval(() => {
      // if online try once every 10 iterations intead of every iteration
      counter += 1;
      if (ref.current) {
        if (counter < 10) return;
      }
      counter = 0;

      if (abort) abort.abort();
      abort = new AbortController();
      const signal = abort.signal;
      fetch("/ping.txt", { signal })
        .then(() => {
          updateOnline(true);
          ref.current = true;
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          updateOnline(false);
          ref.current = false;
        });
    }, 5000);

    return () => {
      clearInterval(interval);
      if (abort) abort.abort();
    };
  }, [updateOnline]);
}
