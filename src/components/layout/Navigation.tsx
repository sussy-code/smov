import classNames from "classnames";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { Lightbar } from "@/components/utils/Lightbar";
import { BlurEllipsis } from "@/pages/layouts/SubPageLayout";
import { conf } from "@/setup/config";
import { useBannerSize } from "@/stores/banner";

import { BrandPill } from "./BrandPill";

export interface NavigationProps {
  children?: ReactNode;
  bg?: boolean;
  noLightbar?: boolean;
  doBackground?: boolean;
}

export function Navigation(props: NavigationProps) {
  const bannerHeight = useBannerSize();

  return (
    <>
      {!props.noLightbar ? (
        <div
          className="absolute inset-x-0 top-0 flex h-[88px] items-center justify-center"
          style={{
            top: `${bannerHeight}px`,
          }}
        >
          <div className="absolute inset-x-0 -mt-[22%] flex items-center sm:mt-0">
            <Lightbar />
          </div>
        </div>
      ) : null}
      <div
        className="fixed pointer-events-none left-0 right-0 top-0 z-10 min-h-[150px]"
        style={{
          top: `${bannerHeight}px`,
        }}
      >
        <div
          className={classNames(
            "fixed left-0 right-0 flex items-center",
            props.doBackground
              ? "bg-background-main border-b border-utils-divider border-opacity-50 overflow-hidden"
              : null
          )}
        >
          {props.doBackground ? (
            <BlurEllipsis positionClass="absolute" />
          ) : null}
          <div
            className={`${
              props.bg ? "opacity-100" : "opacity-0"
            } absolute inset-0 block bg-background-main transition-opacity duration-300`}
          >
            <div className="absolute -bottom-24 h-24 w-full bg-gradient-to-b from-background-main to-transparent" />
          </div>
          <div className="pointer-events-auto px-7 py-5 relative flex flex-1 items-center space-x-3">
            <Link className="block" to="/">
              <BrandPill clickable />
            </Link>
            <a
              href={conf().DISCORD_LINK}
              target="_blank"
              rel="noreferrer"
              className="text-xl text-white"
            >
              <IconPatch icon={Icons.DISCORD} clickable downsized />
            </a>
            <a
              href={conf().GITHUB_LINK}
              target="_blank"
              rel="noreferrer"
              className="text-xl text-white"
            >
              <IconPatch icon={Icons.GITHUB} clickable downsized />
            </a>
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}
