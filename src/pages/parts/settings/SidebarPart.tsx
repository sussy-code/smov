import { useCallback, useEffect, useState } from "react";
import Sticky from "react-sticky-el";
import { useAsync } from "react-use";

import { getBackendMeta } from "@/backend/accounts/meta";
import { Icon, Icons } from "@/components/Icon";
import { SidebarLink, SidebarSection } from "@/components/layout/Sidebar";
import { Divider } from "@/components/utils/Divider";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { useIsMobile } from "@/hooks/useIsMobile";
import { conf } from "@/setup/config";
import { useAuthStore } from "@/stores/auth";

const rem = 16;

function SecureBadge(props: { url: string }) {
  const secure = props.url.startsWith("https://");
  return (
    <div className="flex items-center gap-1 -mx-1 ml-3 px-1 rounded bg-largeCard-background font-bold">
      <Icon icon={secure ? Icons.LOCK : Icons.UNLOCK} />
      Secure
    </div>
  );
}

export function SidebarPart() {
  const { isMobile } = useIsMobile();
  const { account } = useAuthStore();
  // eslint-disable-next-line no-restricted-globals
  const hostname = location.hostname;
  const [activeLink, setActiveLink] = useState("");

  const settingLinks = [
    { text: "Account", id: "settings-account", icon: Icons.USER },
    { text: "Locale", id: "settings-locale", icon: Icons.BOOKMARK },
    { text: "Appearance", id: "settings-appearance", icon: Icons.GITHUB },
    { text: "Captions", id: "settings-captions", icon: Icons.CAPTIONS },
    { text: "Connections", id: "settings-connection", icon: Icons.LINK },
  ];

  const backendUrl = useBackendUrl();

  const backendMeta = useAsync(async () => {
    return getBackendMeta(backendUrl);
  }, [backendUrl]);

  useEffect(() => {
    function recheck() {
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const middle = windowHeight / 2;

      const viewList = settingLinks
        .map((link) => {
          const el = document.getElementById(link.id);
          if (!el) return { distance: Infinity, link: link.id };
          const rect = el.getBoundingClientRect();

          const distanceTop = Math.abs(middle - rect.top);
          const distanceBottom = Math.abs(middle - rect.bottom);

          const distance = Math.min(distanceBottom, distanceTop);
          return { distance, link: link.id };
        })
        .sort((a, b) => a.distance - b.distance);

      // shortest distance to middle of screen is the active link
      setActiveLink(viewList[0]?.link ?? "");
    }
    document.addEventListener("scroll", recheck);
    recheck();

    return () => {
      document.removeEventListener("scroll", recheck);
    };
  });

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: y - 120,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="text-settings-sidebar-type-inactive sidebar-boundary">
      <Sticky
        topOffset={-6 * rem}
        stickyClassName="pt-[6rem]"
        disabled={isMobile}
        hideOnBoundaryHit={false}
        boundaryElement=".sidebar-boundary"
      >
        <div className="hidden lg:block">
          <SidebarSection title="Settings">
            {settingLinks.map((v) => (
              <SidebarLink
                icon={v.icon}
                active={v.id === activeLink}
                onClick={() => scrollTo(v.id)}
                key={v.id}
              >
                {v.text}
              </SidebarLink>
            ))}
          </SidebarSection>
          <Divider />
        </div>
        <SidebarSection className="text-sm" title="App information">
          <div className="px-3 py-3.5 rounded-lg bg-largeCard-background bg-opacity-50 grid grid-cols-2 gap-4">
            {/* Hostname */}
            <div className="col-span-2 space-y-1">
              <p className="text-type-dimmed font-medium">Hostname</p>
              <p className="text-white">{hostname}</p>
            </div>

            {/* Backend URL */}
            <div className="col-span-2 space-y-1">
              <p className="text-type-dimmed font-medium flex items-center">
                Backend URL
                <SecureBadge url={backendUrl} />
              </p>
              <p className="text-white">
                {backendUrl.replace(/https?:\/\//, "")}
              </p>
            </div>

            {/* User ID */}
            <div className="col-span-2 space-y-1">
              <p className="text-type-dimmed font-medium">User ID</p>
              <p className="text-white">{account?.userId ?? "Not logged in"}</p>
            </div>

            {/* App version */}
            <div className="col-span-1 space-y-1">
              <p className="text-type-dimmed font-medium">App version</p>
              <p className="text-type-dimmed px-2 py-1 rounded bg-settings-sidebar-badge inline-block">
                {conf().APP_VERSION}
              </p>
            </div>

            {/* Backend version */}
            <div className="col-span-1 space-y-1">
              <p className="text-type-dimmed font-medium">Backend version</p>
              <p className="text-type-dimmed px-2 py-1 rounded bg-settings-sidebar-badge inline-flex items-center gap-1">
                {backendMeta.error ? (
                  <Icon
                    icon={Icons.WARNING}
                    className="text-type-danger text-base"
                  />
                ) : null}
                {backendMeta.loading ? (
                  <div className="h-4 w-12 bg-type-dimmed/20 rounded" />
                ) : (
                  backendMeta?.value?.version || "Unknown"
                )}
              </p>
            </div>
          </div>
        </SidebarSection>
      </Sticky>
    </div>
  );
}
