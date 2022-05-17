import { Icon, Icons } from "components/Icon";

export interface IconPatchProps {
  active?: boolean;
  onClick?: () => void;
  clickable?: boolean;
  className?: string;
  icon: Icons;
}

export function IconPatch(props: IconPatchProps) {
  return (
    <div className={props.className || undefined} onClick={props.onClick}>
      <div
        className={`bg-denim-300 flex h-12 w-12 items-center justify-center rounded-full border-2 border-transparent transition-[color,transform,border-color] duration-75 ${
          props.clickable
            ? "hover:bg-denim-400 mx-2 cursor-pointer hover:scale-110 hover:text-white active:scale-125"
            : ""
        } ${props.active ? "text-bink-600 border-bink-600 bg-bink-100" : ""}`}
      >
        <Icon icon={props.icon} />
      </div>
    </div>
  );
}
