import { useEffect, useMemo, useRef } from "react";

import { useChromecastAvailable } from "@/hooks/useChromecastAvailable";
import { getPlayerState } from "@/video/state/cache";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { updateMisc, useMisc } from "@/video/state/logic/misc";
import { createCastingStateProvider } from "@/video/state/providers/castingStateProvider";
import { setProvider, unsetStateProvider } from "@/video/state/providers/utils";

export function CastingInternal() {
  const descriptor = useVideoPlayerDescriptor();
  const misc = useMisc(descriptor);
  const lastValue = useRef<boolean>(false);
  const available = useChromecastAvailable();

  const isCasting = useMemo(() => misc.isCasting, [misc]);

  useEffect(() => {
    if (lastValue.current === isCasting) return;
    lastValue.current = isCasting;
    if (!isCasting) return;
    const provider = createCastingStateProvider(descriptor);
    setProvider(descriptor, provider);
    const { destroy } = provider.providerStart();
    return () => {
      try {
        unsetStateProvider(descriptor, provider.getId());
      } catch {
        // ignore errors from missing player state, we need to run destroy()!
      }
      destroy();
    };
  }, [descriptor, isCasting]);

  useEffect(() => {
    const state = getPlayerState(descriptor);
    if (!available) return;

    state.casting.instance = cast.framework.CastContext.getInstance();
    state.casting.instance.setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    });

    state.casting.player = new cast.framework.RemotePlayer();
    state.casting.controller = new cast.framework.RemotePlayerController(
      state.casting.player
    );

    function connectionChanged(e: cast.framework.RemotePlayerChangedEvent) {
      if (e.field === "isConnected") {
        state.casting.isCasting = e.value;
        updateMisc(descriptor, state);
      }
    }
    state.casting.controller.addEventListener(
      cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
      connectionChanged
    );

    return () => {
      state.casting.controller?.removeEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        connectionChanged
      );
    };
  }, [available, descriptor]);

  return null;
}
