import { ReactNode, useEffect, useState } from "react";

import { isAllowedExtensionVersion } from "@/backend/extension/compatibility";
import { extensionInfo } from "@/backend/extension/messaging";
import { useBannerSize, useBannerStore } from "@/stores/banner";
import { ExtensionBanner } from "@/stores/banner/BannerLocation";

export type ExtensionStatus =
  | "unknown"
  | "failed"
  | "disallowed"
  | "noperms"
  | "outdated"
  | "success";

async function getExtensionState(): Promise<ExtensionStatus> {
  const info = await extensionInfo();
  if (!info) return "unknown"; // cant talk to extension
  if (!info.success) return "failed"; // extension failed to respond
  if (!info.allowed) return "disallowed"; // extension is not enabled on this page
  if (!info.hasPermission) return "noperms"; // extension has no perms to do it's tasks
  if (!isAllowedExtensionVersion(info.version)) return "outdated"; // extension is too old
  return "success"; // no problems
}

export function Layout(props: { children: ReactNode }) {
  const bannerSize = useBannerSize();
  const location = useBannerStore((s) => s.location);
  const [extensionState, setExtensionState] =
    useState<ExtensionStatus>("unknown");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getExtensionState().then((state) => {
      if (isMounted) {
        setExtensionState(state);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <p className="flex items-center justify-center h-screen">Loading...</p>
    );
  }

  return (
    <div>
      <div className="fixed inset-x-0 z-[1000]">
        <ExtensionBanner extensionState={extensionState} />
      </div>
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
