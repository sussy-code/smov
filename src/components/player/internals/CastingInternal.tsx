import { useEffect } from "react";

import { useChromecastAvailable } from "@/hooks/useChromecastAvailable";
import { usePlayerStore } from "@/stores/player/store";

export function CastingInternal() {
  const setInstance = usePlayerStore((s) => s.casting.setInstance);
  const setController = usePlayerStore((s) => s.casting.setController);
  const setPlayer = usePlayerStore((s) => s.casting.setPlayer);
  const setIsCasting = usePlayerStore((s) => s.casting.setIsCasting);
  const available = useChromecastAvailable();

  useEffect(() => {
    if (!available) return;

    const ins = cast.framework.CastContext.getInstance();
    setInstance(ins);
    ins.setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    });

    const player = new cast.framework.RemotePlayer();
    setPlayer(player);
    const controller = new cast.framework.RemotePlayerController(player);
    setController(controller);

    function connectionChanged(e: cast.framework.RemotePlayerChangedEvent) {
      if (e.field === "isConnected") {
        setIsCasting(e.value);
      }
    }
    controller.addEventListener(
      cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
      connectionChanged
    );

    return () => {
      controller.removeEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        connectionChanged
      );
    };
  }, [available, setPlayer, setController, setInstance, setIsCasting]);

  return null;
}
