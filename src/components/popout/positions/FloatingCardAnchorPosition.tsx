import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { createFloatingAnchorEvent } from "@/components/popout/FloatingAnchor";

interface AnchorPositionProps {
  children?: ReactNode;
  id: string;
  className?: string;
}

export function FloatingCardAnchorPosition(props: AnchorPositionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState<number>(0);
  const [top, setTop] = useState<number>(0);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const calculateAndSetCoords = useCallback(
    (anchor: DOMRect, card: DOMRect) => {
      const buttonCenter = anchor.left + anchor.width / 2;
      const bottomReal = window.innerHeight - anchor.bottom;

      setTop(
        window.innerHeight - bottomReal - anchor.height - card.height - 30
      );
      setLeft(
        Math.min(
          buttonCenter - card.width / 2,
          window.innerWidth - card.width - 30
        )
      );
    },
    []
  );

  useEffect(() => {
    if (!anchorRect || !cardRect) return;
    calculateAndSetCoords(anchorRect, cardRect);
  }, [anchorRect, calculateAndSetCoords, cardRect]);

  useEffect(() => {
    if (!ref.current) return;
    function checkBox() {
      const divRect = ref.current?.getBoundingClientRect();
      setCardRect(divRect ?? null);
    }
    checkBox();
    const observer = new ResizeObserver(checkBox);
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const evtStr = createFloatingAnchorEvent(props.id);
    if ((window as any)[evtStr]) setAnchorRect((window as any)[evtStr]);
    function listen(ev: CustomEvent<DOMRect>) {
      setAnchorRect(ev.detail);
    }
    document.addEventListener(evtStr, listen as any);
    return () => {
      document.removeEventListener(evtStr, listen as any);
    };
  }, [props.id]);

  return (
    <div
      ref={ref}
      style={{
        transform: `translateX(${left}px) translateY(${top}px)`,
      }}
      className={[
        "pointer-events-auto z-10 inline-block origin-top-left touch-none overflow-hidden",
        props.className ?? "",
      ].join(" ")}
    >
      {props.children}
    </div>
  );
}
