import { ButtonControlProps, ButtonControl } from "./ButtonControl";
import { Icon, Icons } from "components/Icon";

export interface IconButtonProps extends ButtonControlProps {
  icon: Icons;
}

export function IconButton(props: IconButtonProps) {
  return (
    <ButtonControl
      {...props}
      className="flex items-center px-4 py-2 space-x-2 bg-pink-900 text-white rounded-full"
    >
      <Icon icon={props.icon} />
      <span>{props.children}</span>
    </ButtonControl>
  );
}
