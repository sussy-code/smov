import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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

function SecureBadge(props: { url: string | null }) {
  const { t } = useTranslation();
  const secure = props.url ? props.url.startsWith("https://") : false;
  return (
    <div className="flex items-center gap-1 -mx-1 ml-3 px-1 rounded bg-largeCard-background font-bold">
      <Icon icon={secure ? Icons.LOCK : Icons.UNLOCK} />
      {t(
        secure
          ? "settings.sidebar.info.secure"
          : "settings.sidebar.info.insecure",
      )}
    </div>
  );
}

export function SidebarPart() {
  const { t } = useTranslation();
  const { isMobile } = useIsMobile();
  const { account } = useAuthStore();
  // eslint-disable-next-line no-restricted-globals
  const hostname = location.hostname;
  const [activeLink, setActiveLink] = useState("");

  const settingLinks = [
    {
      textKey: "settings.account.title",
      id: "settings-account",
      icon: Icons.USER,
    },
    {
      textKey: "settings.preferences.title",
      id: "settings-preferences",
      icon: Icons.SETTINGS,
    },
    {
      textKey: "settings.appearance.title",
      id: "settings-appearance",
      icon: Icons.BRUSH,
    },
    {
      textKey: "settings.subtitles.title",
      id: "settings-captions",
      icon: Icons.CAPTIONS,
    },
    {
      textKey: "settings.connections.title",
      id: "settings-connection",
      icon: Icons.LINK,
    },
  ];

  const backendUrl = useBackendUrl();

  const backendMeta = useAsync(async () => {
    if (!backendUrl) return;
    return getBackendMeta(backendUrl);
  }, [backendUrl]);

  useEffect(() => {
    function recheck() {
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const centerTarget = windowHeight / 4;

      const viewList = settingLinks
        .map((link) => {
          const el = document.getElementById(link.id);
          if (!el) return { distance: Infinity, link: link.id };
          const rect = el.getBoundingClientRect();
          const distanceTop = Math.abs(centerTarget - rect.top);
          const distanceBottom = Math.abs(centerTarget - rect.bottom);
          const distance = Math.min(distanceBottom, distanceTop);
          return { distance, link: link.id };
        })
        .sort((a, b) => a.distance - b.distance);

      // Check if user has scrolled past the bottom of the page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setActiveLink(settingLinks[settingLinks.length - 1].id);
      } else {
        // shortest distance to the part of the screen we want is the active link
        setActiveLink(viewList[0]?.link ?? "");
      }
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
          <SidebarSection title={t("global.pages.settings")}>
            {settingLinks.map((v) => (
              <SidebarLink
                icon={v.icon}
                active={v.id === activeLink}
                onClick={() => scrollTo(v.id)}
                key={v.id}
              >
                {t(v.textKey)}
              </SidebarLink>
            ))}
          </SidebarSection>
          <Divider />
        </div>
        <SidebarSection
          className="text-sm"
          title={t("settings.sidebar.info.title")}
        >
          <div className="px-3 py-3.5 rounded-lg bg-largeCard-background bg-opacity-50 grid grid-cols-2 gap-4">
            {/* Hostname */}
            <div className="col-span-2 space-y-1">
              <p className="text-type-dimmed font-medium">
                {t("settings.sidebar.info.hostname")}
              </p>
              <p className="text-white">{hostname}</p>
            </div>

            {/* Backend URL */}
            <div className="col-span-2 space-y-1">
              <div className="text-type-dimmed font-medium flex items-center">
                <p>{t("settings.sidebar.info.backendUrl")}</p>
                <SecureBadge url={backendUrl} />
              </div>
              <p className="text-white">
                {backendUrl?.replace(/https?:\/\//, "") ?? "—"}
              </p>
            </div>

            {/* User ID */}
            <div className="col-span-2 space-y-1">
              <p className="text-type-dimmed font-medium">
                {t("settings.sidebar.info.userId")}
              </p>
              <p className="text-white">
                {account?.userId ?? t("settings.sidebar.info.notLoggedIn")}
              </p>
            </div>

            {/* App version */}
            <div className="col-span-1 space-y-1">
              <p className="text-type-dimmed font-medium">
                {t("settings.sidebar.info.appVersion")}
              </p>
              <p className="text-type-dimmed px-2 py-1 rounded bg-settings-sidebar-badge inline-block">
                {conf().APP_VERSION}
              </p>
            </div>

            {/* Backend version */}
            <div className="col-span-1 space-y-1">
              <p className="text-type-dimmed font-medium">
                {t("settings.sidebar.info.backendVersion")}
              </p>
              <p className="text-type-dimmed px-2 py-1 rounded bg-settings-sidebar-badge inline-flex items-center gap-1">
                {backendMeta.error ? (
                  <Icon
                    icon={Icons.WARNING}
                    className="text-type-danger text-base"
                  />
                ) : null}
                {backendMeta.loading ? (
                  <span className="block h-4 w-12 bg-type-dimmed/20 rounded" />
                ) : (
                  backendMeta?.value?.version ||
                  t("settings.sidebar.info.unknownVersion")
                )}
              </p>
            </div>
          </div>
        </SidebarSection>
      </Sticky>
    </div>
  );
}
