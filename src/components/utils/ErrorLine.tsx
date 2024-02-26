import classNames from "classnames";
import { ReactNode } from "react";

import { Icon, Icons } from "@/components/Icon";

export function ErrorLine(props: { children?: ReactNode; className?: string }) {
  return (
    <p
      className={classNames(
        "inline-flex items-center text-type-danger",
        props.className,
      )}
    >
      <Icon icon={Icons.WARNING} className="text-xl mr-4" />
      {props.children}
    </p>
  );
}
