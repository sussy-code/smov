import { Icon, Icons } from "@/components/Icon";
import { BrandPill } from "@/components/layout/BrandPill";

interface VideoPlayerHeaderProps {
  title?: string;
  onClick?: () => void;
}

export function VideoPlayerHeader(props: VideoPlayerHeaderProps) {
  const showDivider = props.title && props.onClick;
  return (
    <div className="flex items-center">
      <div className="flex flex-1 items-center">
        <p className="flex items-center">
          {props.onClick ? (
            <span
              onClick={props.onClick}
              className="flex cursor-pointer items-center py-1 text-white opacity-50 transition-opacity hover:opacity-100"
            >
              <Icon className="mr-2" icon={Icons.ARROW_LEFT} />
              <span>Back to home</span>
            </span>
          ) : null}
          {showDivider ? (
            <span className="mx-4 h-6 w-[1.5px] rotate-[30deg] bg-white opacity-50" />
          ) : null}
          {props.title ? (
            <span className="text-white">{props.title}</span>
          ) : null}
        </p>
      </div>
      <BrandPill />
    </div>
  );
}
