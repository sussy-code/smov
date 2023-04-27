import { ReactNode } from "react";

import { Icon, Icons } from "@/components/Icon";

interface Props {
  icon?: Icons;
  onClick?: () => void;
  children?: ReactNode;
}

export function Button(props: Props) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-bold text-black transition-[transform,background-color] duration-100 hover:bg-gray-200 active:scale-105 md:px-16"
    >
      {props.icon ? (
        <span className="mr-3 hidden md:inline-block">
          <Icon icon={props.icon} />
        </span>
      ) : null}
      {props.children}
    </button>
  );
}
