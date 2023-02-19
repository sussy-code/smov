import { Icon, Icons } from "@/components/Icon";
import { ReactNode } from "react";

interface Props {
  icon?: Icons;
  onClick?: () => void;
  children?: ReactNode;
}

// TODO style button
// TODO transition modal
export function Button(props: Props) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="inline-flex items-center justify-center"
    >
      {props.icon ? (
        <span className="mr-3">
          <Icon icon={props.icon} />
        </span>
      ) : null}
      {props.children}
    </button>
  );
}
