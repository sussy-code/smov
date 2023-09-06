import { Icon, Icons } from "@/components/Icon";

export interface IconPatchProps {
  active?: boolean;
  onClick?: () => void;
  clickable?: boolean;
  className?: string;
  icon: Icons;
  transparent?: boolean;
  downsized?: boolean;
}

export function IconPatch(props: IconPatchProps) {
  const clickableClasses = props.clickable
    ? "cursor-pointer hover:scale-110 hover:bg-denim-600 hover:text-white active:scale-125"
    : "";
  const transparentClasses = props.transparent
    ? "bg-opacity-0 hover:bg-opacity-50"
    : "";
  const activeClasses = props.active
    ? "border-bink-600 bg-bink-100 text-bink-600"
    : "";
  const sizeClasses = props.downsized ? "h-10 w-10" : "h-12 w-12";

  return (
    <div className={props.className || undefined} onClick={props.onClick}>
      <div
        className={`flex items-center justify-center rounded-full border-2 border-transparent bg-pill-background bg-opacity-50 transition-[background-color,color,transform,border-color] duration-75 ${transparentClasses} ${clickableClasses} ${activeClasses} ${sizeClasses}`}
      >
        <Icon icon={props.icon} />
      </div>
    </div>
  );
}
