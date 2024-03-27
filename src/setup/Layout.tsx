import { ReactNode, useEffect, useState } from "react";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useBannerSize, useBannerStore } from "@/stores/banner";
import { ExtensionBanner } from "@/stores/banner/BannerLocation";
import { getExtensionState } from "@/utils/extension";
import type { ExtensionStatus } from "@/utils/extension";

export function Layout(props: { children: ReactNode }) {
  const bannerSize = useBannerSize();
  const location = useBannerStore((s) => s.location);
  const [extensionState, setExtensionState] =
    useState<ExtensionStatus>("unknown");
  const { isMobile } = useIsMobile();

  useEffect(() => {
    let isMounted = true;

    getExtensionState().then((state) => {
      if (isMounted) {
        setExtensionState(state);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {extensionState !== "success" && !isMobile && (
        <div className="fixed inset-x-0 z-[1000]">
          <ExtensionBanner extensionState={extensionState} />
        </div>
      )}
      <div
        style={{
          paddingTop: location === null ? `${bannerSize}px` : "0px",
        }}
        className="flex min-h-screen flex-col"
      >
        {props.children}
      </div>
    </div>
  );
}
