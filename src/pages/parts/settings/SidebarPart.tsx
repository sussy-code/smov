import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import Sticky from "react-stickynode";
import { useAsync } from "react-use";

import { getBackendMeta } from "@/backend/accounts/meta";
import { Icon, Icons } from "@/components/Icon";
import { SidebarLink, SidebarSection } from "@/components/layout/Sidebar";
import { Divider } from "@/components/utils/Divider";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { useIsMobile } from "@/hooks/useIsMobile";
import { conf } from "@/setup/config";

function BackendUrl(props: { url: string }) {
  const url = props.url.replace(/https?:\/\//, "");
  const secure = props.url.startsWith("https://");
  return (
    <div className="flex items-center gap-2">
      <div
        title={secure ? "Secure" : "Insecure"}
        className={classNames(
          "w-5 min-w-[1.25rem] h-5 rounded flex justify-center items-center",
          secure ? "bg-emerald-200/30 text-white" : "bg-red-600/20 text-white"
        )}
      >
        <Icon
          className="opacity-50"
          icon={secure ? Icons.LOCK : Icons.UNLOCK}
        />
      </div>
      {url}
    </div>
  );
}

export function SidebarPart() {
  const { isMobile } = useIsMobile();
  // eslint-disable-next-line no-restricted-globals
  const hostname = location.hostname;
  const rem = 16;
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

  // TODO loading/error state for backend
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
    <div>
      <Sticky
        enabled={!isMobile}
        top={10 * rem} // 10rem
        className="text-settings-sidebar-type-inactive"
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
          <div className="flex justify-between items-center space-x-3">
            <span>Version</span>
            <span>{conf().APP_VERSION}</span>
          </div>
          <div className="flex justify-between items-center space-x-3">
            <span>Domain</span>
            <span className="text-right">{hostname}</span>
          </div>
          {backendMeta.value ? (
            <>
              <div className="flex justify-between items-center space-x-3">
                <span>Backend Version</span>
                <span>{backendMeta.value.version}</span>
              </div>
              <div className="flex justify-between items-center space-x-3">
                <span className="whitespace-nowrap">Backend URL</span>
                <span className="text-right">
                  <BackendUrl url={backendUrl} />
                </span>
              </div>
            </>
          ) : null}
        </SidebarSection>
      </Sticky>
    </div>
  );
}
