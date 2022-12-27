import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { conf } from "@/config";
import { BrandPill } from "./BrandPill";

export interface NavigationProps {
  children?: ReactNode;
}

export function Navigation(props: NavigationProps) {
  return (
    <div className="absolute left-0 right-0 top-0 flex min-h-[88px] items-center justify-between py-5 px-7">
      <div className="flex w-full items-center justify-center sm:w-fit">
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
        } flex-row	gap-4`}
      >
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
  );
}
