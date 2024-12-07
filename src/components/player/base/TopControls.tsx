import { useEffect } from "react";

import { Transition } from "@/components/utils/Transition";
import { useBannerSize } from "@/stores/banner";
import { BannerLocation } from "@/stores/banner/BannerLocation";
import { usePlayerStore } from "@/stores/player/store";

export function TopControls(props: {
  show?: boolean;
  children: React.ReactNode;
}) {
  const bannerSize = useBannerSize("player");
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
        style={{
          top: `${bannerSize}px`,
        }}
        className="pointer-events-none flex justify-end pb-32 bg-gradient-to-b from-black to-transparent [margin-bottom:env(safe-area-inset-bottom)] transition-opacity duration-200 absolute top-0 w-full"
      />
      <div className="relative z-10">
        <BannerLocation location="player" />
      </div>
      <div
        onMouseOver={() => setHoveringAnyControls(true)}
        onMouseOut={() => setHoveringAnyControls(false)}
        className="pointer-events-auto pl-[calc(2rem+env(safe-area-inset-left))] pr-[calc(2rem+env(safe-area-inset-right))] pt-6 absolute top-0 w-full"
        style={{
          top: `${bannerSize}px`,
        }}
      >
        <Transition
          animation="slide-down"
          show={props.show}
          className="top-content text-white"
        >
          {props.children}
        </Transition>
      </div>
    </div>
  );
}
