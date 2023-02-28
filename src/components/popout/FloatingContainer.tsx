import { Transition } from "@/components/Transition";
import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface Props {
  children?: ReactNode;
  onClose?: () => void;
  show?: boolean;
  darken?: boolean;
}

export function FloatingContainer(props: Props) {
  const target = useRef<Element | null>(null);

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
      if (props.onClose) props.onClose();
    },
    [props]
  );

  return createPortal(
    <Transition show={props.show} animation="none">
      <div className="popout-wrapper pointer-events-auto fixed inset-0 select-none">
        <Transition animation="fade" isChild>
          <div
            onClick={click}
            className={[
              "absolute inset-0",
              props.darken ? "bg-black opacity-90" : "",
            ].join(" ")}
          />
        </Transition>
        <Transition animation="slide-up" className="h-0" isChild>
          {props.children}
        </Transition>
      </div>
    </Transition>,
    document.body
  );
}
