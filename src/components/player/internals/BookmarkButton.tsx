import { Icons } from "@/components/Icon";

import { VideoPlayerButton } from "./Button";

export function BookmarkButton() {
  return (
    <VideoPlayerButton
      onClick={() => window.open("https://youtu.be/TENzstSjsus", "_blank")}
      icon={Icons.BOOKMARK_OUTLINE}
      iconSizeClass="text-base"
      className="p-3"
    />
  );
}
