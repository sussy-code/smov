import { useSettings } from "@/state/settings";

import { Icon, Icons } from "./Icon";

export const colors = ["#ffffff", "#00ffff", "#ffff00"];
export default function CaptionColorSelector({ color }: { color: string }) {
  const { captionSettings, setCaptionColor } = useSettings();
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded transition-[background-color,transform] duration-100 hover:bg-[#1c161b79] active:scale-110 ${
        color === captionSettings.style.color ? "bg-[#1C161B]" : ""
      }`}
      onClick={() => setCaptionColor(color)}
    >
      <div
        className="h-4 w-4 cursor-pointer appearance-none rounded-full"
        style={{
          backgroundColor: color,
        }}
      />
      <Icon
        className={[
          "absolute text-xs text-[#1C161B]",
          color === captionSettings.style.color ? "" : "hidden",
        ].join(" ")}
        icon={Icons.CHECKMARK}
      />
    </div>
  );
}
