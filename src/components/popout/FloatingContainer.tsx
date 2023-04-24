import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { Transition } from "@/components/Transition";

interface Props {
  children?: ReactNode;
  onClose?: () => void;
  show?: boolean;
  darken?: boolean;
}

export function FloatingContainer(props: Props) {
  const [portalElement, setPortalElement] = useState<Element | null>(null);
  const ref = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const element = ref.current?.closest(".popout-location");
    setPortalElement(element ?? document.body);
  }, []);

  return (
    <div ref={ref}>
      {portalElement
        ? createPortal(
            <Transition show={props.show} animation="none">
              <div className="popout-wrapper pointer-events-auto fixed inset-0 z-[999] select-none">
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
            portalElement
          )
        : null}
    </div>
  );
}
