import { Icon, Icons } from "@/components/Icon";

import { ButtonControl, ButtonControlProps } from "./ButtonControl";

export interface IconButtonProps extends ButtonControlProps {
  icon: Icons;
}

export function IconButton(props: IconButtonProps) {
  return (
    <ButtonControl
      {...props}
      className="flex items-center space-x-2 rounded-full bg-bink-200 px-4 py-2 text-white hover:bg-bink-300"
    >
      <Icon icon={props.icon} />
      <span>{props.children}</span>
    </ButtonControl>
  );
}
