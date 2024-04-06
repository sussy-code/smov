import { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { Icon, Icons } from "@/components/Icon";
import { useBannerStore, useRegisterBanner } from "@/stores/banner";
import type { ExtensionStatus } from "@/utils/extension";

export function Banner(props: {
  children: React.ReactNode;
  type: "error" | "info"; // Add "info" type
  id: string;
}) {
  const [ref] = useRegisterBanner<HTMLDivElement>(props.id);
  const hideBanner = useBannerStore((s) => s.hideBanner);
  const styles = {
    error: "bg-[#C93957] text-white",
    info: "bg-[#126FD3] text-white", // Add "info" style
  };
  const icons = {
    error: Icons.CIRCLE_EXCLAMATION,
    info: Icons.CIRCLE_EXCLAMATION,
  };

  useEffect(() => {
    const hideBannerFlag = sessionStorage.getItem("hideBanner");
    if (hideBannerFlag) {
      hideBanner(props.id, true);
    }
  }, [hideBanner, props.id]);

  return (
    <div ref={ref}>
      <div
        className={[
          styles[props.type],
          "flex items-center justify-center p-1",
        ].join(" ")}
      >
        <div className="flex items-center space-x-3">
          <Icon icon={icons[props.type]} />
          <div>{props.children}</div>
        </div>
        <span
          className="absolute right-4 hover:cursor-pointer"
          onClick={() => {
            hideBanner(props.id, true);
            sessionStorage.setItem("hideBanner", "true");
          }}
        >
          <Icon icon={Icons.X} />
        </span>
      </div>
    </div>
  );
}

// This jawn is for advertising the extension for le skids
export function ExtensionBanner(props: {
  location?: string;
  extensionState: ExtensionStatus;
}) {
  const navigate = useNavigate();
  const setLocation = useBannerStore((s) => s.setLocation);
  const currentLocation = useBannerStore((s) => s.location);
  const loc = props.location ?? null;
  const { pathname } = useLocation();
  const isEligible = !(
    /CrOS/.test(navigator.userAgent) ||
    /TV/.test(navigator.userAgent) ||
    /iPhone|iPad|iPod/i.test(navigator.userAgent)
  );

  useEffect(() => {
    if (loc) {
      setLocation(loc);
      return () => {
        setLocation(null);
      };
    }
  }, [setLocation, loc]);

  const hideBannerFlag = sessionStorage.getItem("hideBanner");
  if (hideBannerFlag) {
    return null;
  }

  if (currentLocation !== loc || pathname === "/onboarding/extension")
    return null;

  // Show the banner with a 36.5% chance or not if users don't meet requirements
  if (isEligible && Math.random() < 0.365) {
    let bannerText = "";
    switch (props.extensionState) {
      case "noperms":
        bannerText = "The extension does'nt have the necessary permissions.";
        break;
      case "outdated":
        bannerText =
          "Your extension is outdated. Please update it <bold>here</bold>.";
        break;
      case "disallowed":
        bannerText =
          "The extension is not enabled, click <bold>here</bold> to fix it.";
        break;
      case "failed":
        bannerText =
          "The extension is broken... Please click <bold>here</bold>.";
        break;
      default:
        bannerText =
          "You don't have the extension! Download it <bold>here</bold> for better quality.";
        break;
    }

    return (
      <Banner id="extension" type="info">
        <div
          onClick={() => navigate("/onboarding/extension")}
          style={{ cursor: "pointer" }}
        >
          <Trans
            i18nKey={bannerText}
            components={{
              bold: <span className="font-bold" />,
            }}
          />
        </div>
      </Banner>
    );
  }
  return null;
}

export function BannerLocation(props: { location?: string }) {
  const { t } = useTranslation();
  const isOnline = useBannerStore((s) => s.isOnline);
  const setLocation = useBannerStore((s) => s.setLocation);
  const ignoredBannerIds = useBannerStore((s) => s.ignoredBannerIds);
  const currentLocation = useBannerStore((s) => s.location);
  const loc = props.location ?? null;

  useEffect(() => {
    if (!loc) return;
    setLocation(loc);
    return () => {
      setLocation(null);
    };
  }, [setLocation, loc]);

  if (currentLocation !== loc) return null;

  const hideBannerFlag = sessionStorage.getItem("hideBanner");
  if (hideBannerFlag) return null;

  return (
    <div>
      {!isOnline && !ignoredBannerIds.includes("offline") ? (
        <Banner id="offline" type="error">
          {t("navigation.banner.offline")}
        </Banner>
      ) : null}
    </div>
  );
}
