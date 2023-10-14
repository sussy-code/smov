import classNames from "classnames";

import { Icon, Icons } from "@/components/Icon";

export function VideoPlayerButton(props: {
  children?: React.ReactNode;
  onClick?: () => void;
  icon?: Icons;
  iconSizeClass?: string;
  className?: string;
  activeClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={classNames([
        "p-2 rounded-full hover:bg-video-buttonBackground hover:bg-opacity-50 transition-transform duration-100 flex items-center",
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
}
