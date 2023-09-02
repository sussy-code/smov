import { useCallback } from "react";

import { PopoutFloatingCard } from "@/components/popout/FloatingCard";
import { FloatingContainer } from "@/components/popout/FloatingContainer";
import { useSyncPopouts } from "@/video/components/hooks/useSyncPopouts";
import { EpisodeSelectionPopout } from "@/video/components/popouts/EpisodeSelectionPopout";
import { SettingsPopout } from "@/video/components/popouts/SettingsPopout";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useInterface } from "@/video/state/logic/interface";

function ShowPopout(props: { popoutId: string | null; onClose: () => void }) {
  const popoutMap = {
    settings: <SettingsPopout />,
    episodes: <EpisodeSelectionPopout />,
  };

  return (
    <>
      {Object.entries(popoutMap).map(([id, el]) => (
        <FloatingContainer
          key={id}
          show={props.popoutId === id}
          onClose={props.onClose}
        >
          <PopoutFloatingCard for={id} onClose={props.onClose}>
            {el}
          </PopoutFloatingCard>
        </FloatingContainer>
      ))}
    </>
  );
}

export function PopoutProviderAction() {
  const descriptor = useVideoPlayerDescriptor();
  const videoInterface = useInterface(descriptor);
  const controls = useControls(descriptor);
  useSyncPopouts(descriptor);

  const onClose = useCallback(() => {
    controls.closePopout();
  }, [controls]);

  return <ShowPopout popoutId={videoInterface.popout} onClose={onClose} />;
}
