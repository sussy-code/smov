import { Icon, Icons } from "@/components/Icon";

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
        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-transparent bg-denim-500 transition-[color,transform,border-color] duration-75 ${
          props.clickable
            ? "cursor-pointer hover:scale-110 hover:bg-denim-600 hover:text-white active:scale-125"
            : ""
        } ${props.active ? "border-bink-600 bg-bink-100 text-bink-600" : ""}`}
      >
        <Icon icon={props.icon} />
      </div>
    </div>
  );
}
