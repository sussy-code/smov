import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { Icon, Icons } from "@/components/Icon";
import { ExtensionStatus } from "@/setup/Layout";
import { useBannerStore, useRegisterBanner } from "@/stores/banner";

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
          onClick={() => hideBanner(props.id, true)}
        >
          <Icon icon={Icons.X} />
        </span>
      </div>
    </div>
  );
}

// This jawn is for advertising the extension for le
export function ExtensionBanner(props: {
  location?: string;
  extensionState: ExtensionStatus;
}) {
  const navigate = useNavigate();
  const setLocation = useBannerStore((s) => s.setLocation);
  const currentLocation = useBannerStore((s) => s.location);
  const loc = props.location ?? null;
  const { pathname } = useLocation();

  useEffect(() => {
    if (!loc) return;
    setLocation(loc);
    return () => {
      setLocation(null);
    };
  }, [setLocation, loc]);

  if (currentLocation !== loc || pathname === "/onboarding/extension")
    return null;

  // Show the banner with a 45% chance
  if (Math.random() < 0.45) {
    let bannerText = "";
    switch (props.extensionState) {
      case "noperms":
        bannerText =
          "You don't have the necessary permissions to use the extension.";
        break;
      case "outdated":
        bannerText =
          "Your extension is outdated. Please update it for better performance.";
        break;
      case "disallowed":
        bannerText = "The extension is not enabled on this page.";
        break;
      default:
        bannerText =
          "You don't have the extension! Download it here for better quality.";
    }

    return (
      <div
        onClick={() => navigate("/onboarding/extension")}
        style={{ cursor: "pointer" }}
      >
        <Banner id="extension" type="info">
          {bannerText}
        </Banner>
      </div>
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
