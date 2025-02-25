import { useEffect, useRef, useState } from "react";

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export function useIntersectionObserver(
  options: IntersectionObserverOptions = {},
  onceOnly = false,
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<Element | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);

      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, options);

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [options, hasIntersected]);

  // If onceOnly is true, we only care if it has ever intersected
  // Otherwise, we care about the current intersection state
  const shouldLoad = onceOnly ? hasIntersected : isIntersecting;

  return { targetRef, isIntersecting: shouldLoad, hasIntersected };
}
