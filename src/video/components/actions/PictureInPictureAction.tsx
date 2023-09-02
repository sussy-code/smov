import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Icons } from "@/components/Icon";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  canPictureInPicture,
  canWebkitPictureInPicture,
} from "@/utils/detectFeatures";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";

import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";

interface Props {
  className?: string;
}

export function PictureInPictureAction(props: Props) {
  const { isMobile } = useIsMobile();
  const { t } = useTranslation();

  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);

  const handleClick = useCallback(() => {
    controls.togglePictureInPicture();
  }, [controls]);

  if (!canPictureInPicture() && !canWebkitPictureInPicture()) return null;

  return (
    <VideoPlayerIconButton
      className={props.className}
      icon={Icons.PICTURE_IN_PICTURE}
      onClick={handleClick}
      text={
        isMobile ? (t("videoPlayer.buttons.pictureInPicture") as string) : ""
      }
    />
  );
}
