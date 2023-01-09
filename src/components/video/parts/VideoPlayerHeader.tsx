import { Icon, Icons } from "@/components/Icon";
import { BrandPill } from "@/components/layout/BrandPill";

interface VideoPlayerHeaderProps {
  title: string;
  onClick?: () => void;
}

export function VideoPlayerHeader(props: VideoPlayerHeaderProps) {
  return (
    <div className="flex items-center">
      <div className="flex flex-1 items-center">
        <p className="flex items-center">
          <span
            onClick={props.onClick}
            className="flex cursor-pointer items-center py-1 text-white opacity-50 transition-opacity hover:opacity-100"
          >
            <Icon className="mr-2" icon={Icons.ARROW_LEFT} />
            <span>Back to home</span>
          </span>
          <span className="mx-4 h-6 w-[1.5px] rotate-[30deg] bg-white opacity-50" />
          <span className="text-white">{props.title}</span>
        </p>
      </div>
      <BrandPill />
    </div>
  );
}
