import React, { forwardRef } from "react";

import { Icon, Icons } from "@/components/Icon";

export interface VideoPlayerIconButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon: Icons;
  text?: string;
  className?: string;
  iconSize?: string;
  active?: boolean;
  wide?: boolean;
  noPadding?: boolean;
  disabled?: boolean;
}

export const VideoPlayerIconButton = forwardRef<
  HTMLDivElement,
  VideoPlayerIconButtonProps
>((props, ref) => {
  return (
    <div className={props.className} ref={ref}>
      <button
        type="button"
        onClick={props.onClick}
        className={[
          "group pointer-events-auto p-2 text-white transition-transform duration-100 active:scale-110",
          props.disabled
            ? "pointer-events-none cursor-not-allowed opacity-50"
            : "",
        ].join(" ")}
      >
        <div
          className={[
            "flex items-center justify-center rounded-full bg-denim-600 bg-opacity-0 transition-colors duration-100",
            props.active ? "!bg-denim-500 !bg-opacity-100" : "",
            !props.noPadding ? (props.wide ? "p-2 sm:px-4" : "p-2") : "",
            !props.disabled
              ? "group-hover:bg-opacity-50 group-active:bg-denim-500 group-active:bg-opacity-100"
              : "",
          ].join(" ")}
        >
          <Icon icon={props.icon} className={props.iconSize ?? "text-2xl"} />
          <p className="hidden sm:block">
            {props.text ? <span className="ml-2">{props.text}</span> : null}
          </p>
        </div>
      </button>
    </div>
  );
});
