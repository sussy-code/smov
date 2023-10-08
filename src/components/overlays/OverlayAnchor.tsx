import { ReactNode, useEffect, useRef } from "react";

export function createOverlayAnchorEvent(id: string): string {
  return `__overlay::anchor::${id}`;
}

interface Props {
  id: string;
  children?: ReactNode;
}

export function OverlayAnchor(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const old = useRef<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    let cancelled = false;
    function render() {
      if (cancelled) return;

      if (ref.current) {
        const current = old.current;
        const newer = ref.current.getBoundingClientRect();
        const newerStr = JSON.stringify(newer);
        if (current !== newerStr) {
          old.current = newerStr;
          const evtStr = createOverlayAnchorEvent(props.id);
          (window as any)[evtStr] = newer;
          const evObj = new CustomEvent(createOverlayAnchorEvent(props.id), {
            detail: newer,
          });
          document.dispatchEvent(evObj);
        }
      }
      window.requestAnimationFrame(render);
    }

    window.requestAnimationFrame(render);
    return () => {
      cancelled = true;
    };
  }, [props]);

  return <div ref={ref}>{props.children}</div>;
}
