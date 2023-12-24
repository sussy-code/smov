import { useEffect } from "react";

import { Transition } from "@/components/utils/Transition";
import { usePlayerStore } from "@/stores/player/store";

export function BottomControls(props: {
  show?: boolean;
  children: React.ReactNode;
}) {
  const setHoveringAnyControls = usePlayerStore(
    (s) => s.setHoveringAnyControls,
  );

  useEffect(() => {
    return () => {
      setHoveringAnyControls(false);
    };
  }, [setHoveringAnyControls]);

  return (
    <div className="w-full text-white">
      <Transition
        animation="fade"
        show={props.show}
        className="pointer-events-none flex justify-end pt-32 bg-gradient-to-t from-black to-transparent transition-opacity duration-200 absolute bottom-0 w-full"
      />
      <div
        onMouseOver={() => setHoveringAnyControls(true)}
        onMouseOut={() => setHoveringAnyControls(false)}
        className="pointer-events-auto z-10 pl-[calc(2rem+env(safe-area-inset-left))] pr-[calc(2rem+env(safe-area-inset-right))] pb-3 mb-[env(safe-area-inset-bottom)] absolute bottom-0 w-full"
      >
        <Transition animation="slide-up" show={props.show}>
          {props.children}
        </Transition>
      </div>
    </div>
  );
}
