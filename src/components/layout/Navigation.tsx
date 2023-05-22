import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";

import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { useBannerSize } from "@/hooks/useBanner";
import { conf } from "@/setup/config";
import SettingsModal from "@/views/SettingsModal";

import { BrandPill } from "./BrandPill";

export interface NavigationProps {
  children?: ReactNode;
  bg?: boolean;
}

export function Navigation(props: NavigationProps) {
  const bannerHeight = useBannerSize();
  const [showModal, setShowModal] = useState(false);
  return (
    <div
      className="fixed left-0 right-0 top-0 z-20 min-h-[150px] bg-gradient-to-b from-denim-300 via-denim-300 to-transparent sm:from-transparent"
      style={{
        top: `${bannerHeight}px`,
      }}
    >
      <div className="fixed left-0 right-0 flex items-center justify-between px-7 py-5">
        <div
          className={`${
            props.bg ? "opacity-100" : "opacity-0"
          } absolute inset-0 block bg-denim-100 transition-opacity duration-300`}
        >
          <div className="pointer-events-none absolute -bottom-24 h-24 w-full bg-gradient-to-b from-denim-100 to-transparent" />
        </div>
        <div className="relative flex w-full items-center justify-center sm:w-fit">
          <div className="mr-auto sm:mr-6">
            <Link to="/">
              <BrandPill clickable />
            </Link>
          </div>
          {props.children}
        </div>
        <div
          className={`${
            props.children ? "hidden sm:flex" : "flex"
          } relative flex-row	gap-4`}
        >
          <IconPatch
            className="text-2xl text-white"
            icon={Icons.GEAR}
            clickable
            onClick={() => {
              setShowModal(true);
            }}
          />
          <a
            href={conf().DISCORD_LINK}
            target="_blank"
            rel="noreferrer"
            className="text-2xl text-white"
          >
            <IconPatch icon={Icons.DISCORD} clickable />
          </a>
          <a
            href={conf().GITHUB_LINK}
            target="_blank"
            rel="noreferrer"
            className="text-2xl text-white"
          >
            <IconPatch icon={Icons.GITHUB} clickable />
          </a>
        </div>
      </div>
      <SettingsModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
