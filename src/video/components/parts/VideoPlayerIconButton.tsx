import { Icon, Icons } from "@/components/Icon";
import React from "react";

export interface VideoPlayerIconButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon: Icons;
  text?: string;
  className?: string;
  iconSize?: string;
  active?: boolean;
  wide?: boolean;
}

export function VideoPlayerIconButton(props: VideoPlayerIconButtonProps) {
  return (
    <div className={props.className}>
      <button
        type="button"
        onClick={props.onClick}
        className="group pointer-events-auto p-2 text-white transition-transform duration-100 active:scale-110"
      >
        <div
          className={[
            "flex items-center justify-center rounded-full bg-denim-600 bg-opacity-0 transition-colors duration-100 group-hover:bg-opacity-50 group-active:bg-denim-500 group-active:bg-opacity-100",
            props.active ? "!bg-denim-500 !bg-opacity-100" : "",
            props.wide ? "py-2 px-4" : "p-2",
          ].join(" ")}
        >
          <Icon icon={props.icon} className={props.iconSize ?? "text-2xl"} />
          {props.text ? <span className="ml-2">{props.text}</span> : null}
        </div>
      </button>
    </div>
  );
}
