import classNames from "classnames";
import { forwardRef } from "react";

import { Icon, Icons } from "@/components/Icon";

export interface VideoPlayerButtonProps {
  children?: React.ReactNode;
  onClick?: (el: HTMLButtonElement) => void;
  icon?: Icons;
  iconSizeClass?: string;
  className?: string;
  activeClass?: string;
}

export const VideoPlayerButton = forwardRef<
  HTMLButtonElement,
  VideoPlayerButtonProps
>((props, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => props.onClick?.(e.currentTarget as HTMLButtonElement)}
      className={classNames([
        "tabbable p-2 rounded-full hover:bg-video-buttonBackground hover:bg-opacity-50 transition-transform duration-100 flex items-center",
        props.activeClass ??
          "active:scale-110 active:bg-opacity-75 active:text-white",
        props.className ?? "",
      ])}
    >
      {props.icon && (
        <Icon
          className={classNames(
            props.iconSizeClass || "text-2xl",
            props.children ? "mr-3" : ""
          )}
          icon={props.icon}
        />
      )}
      {props.children}
    </button>
  );
});
