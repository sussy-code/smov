import { useCallback, useEffect, useState } from "react";
import Sticky from "react-stickynode";

import { Icons } from "@/components/Icon";
import { SidebarLink, SidebarSection } from "@/components/layout/Sidebar";
import { Divider } from "@/components/utils/Divider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { conf } from "@/setup/config";

const percentageVisible = 10;

export function SidebarPart() {
  const { isMobile } = useIsMobile();
  // eslint-disable-next-line no-restricted-globals
  const hostname = location.hostname;
  const rem = 16;
  const [activeLink, setActiveLink] = useState("");

  const settingLinks = [
    { text: "Account", id: "settings-account", icon: Icons.USER },
    { text: "Locale", id: "settings-locale", icon: Icons.LINK },
    { text: "Appearance", id: "settings-appearance", icon: Icons.GITHUB },
    { text: "Captions", id: "settings-captions", icon: Icons.CAPTIONS },
  ];

  useEffect(() => {
    function recheck() {
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

      const viewList = settingLinks
        .map((link) => {
          const el = document.getElementById(link.id);
          if (!el) return { visible: false, link: link.id };
          const rect = el.getBoundingClientRect();

          const visible = !(
            Math.floor(
              50 - ((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100
            ) < percentageVisible ||
            Math.floor(
              50 - ((rect.bottom - windowHeight) / rect.height) * 100
            ) < percentageVisible
          );

          return { visible, link: link.id };
        })
        .filter((v) => v.visible);

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
        <SidebarSection title="App information">
          <div className="flex justify-between items-center space-x-3">
            <span>Version</span>
            <span>{conf().APP_VERSION}</span>
          </div>
          <div className="flex justify-between items-center space-x-3">
            <span>Domain</span>
            <span className="text-right">{hostname}</span>
          </div>
        </SidebarSection>
      </Sticky>
    </div>
  );
}
