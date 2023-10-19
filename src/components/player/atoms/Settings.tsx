import { useEffect, useState } from "react";

import { Icons } from "@/components/Icon";
import { OverlayAnchor } from "@/components/overlays/OverlayAnchor";
import { Overlay } from "@/components/overlays/OverlayDisplay";
import { OverlayPage } from "@/components/overlays/OverlayPage";
import { OverlayRouter } from "@/components/overlays/OverlayRouter";
import { SettingsMenu } from "@/components/player/atoms/settings/SettingsMenu";
import {
  EmbedSelectionView,
  SourceSelectionView,
} from "@/components/player/atoms/settings/SourceSelectingView";
import { VideoPlayerButton } from "@/components/player/internals/Button";
import { Context } from "@/components/player/internals/ContextUtils";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";

import { CaptionSettingsView } from "./settings/CaptionSettingsView";
import { CaptionsView } from "./settings/CaptionsView";
import { QualityView } from "./settings/QualityView";

function SettingsOverlay({ id }: { id: string }) {
  const [chosenSourceId, setChosenSourceId] = useState<string | null>(null);
  const router = useOverlayRouter(id);

  // reset source id when going to home or closing overlay
  useEffect(() => {
    if (!router.isRouterActive) {
      setChosenSourceId(null);
    }
    if (router.route === "/") {
      setChosenSourceId(null);
    }
  }, [router.isRouterActive, router.route]);

  return (
    <Overlay id={id}>
      <OverlayRouter id={id}>
        <OverlayPage id={id} path="/" width={343} height={431}>
          <SettingsMenu id={id} />
        </OverlayPage>
        <OverlayPage id={id} path="/quality" width={343} height={431}>
          <Context.Card>
            <QualityView id={id} />
          </Context.Card>
        </OverlayPage>
        <OverlayPage id={id} path="/captions" width={343} height={431}>
          <Context.Card>
            <CaptionsView id={id} />
          </Context.Card>
        </OverlayPage>
        <OverlayPage id={id} path="/captions/settings" width={343} height={310}>
          <Context.Card>
            <CaptionSettingsView id={id} />
          </Context.Card>
        </OverlayPage>
        <OverlayPage id={id} path="/source" width={343} height={431}>
          <Context.Card>
            <SourceSelectionView id={id} onChoose={setChosenSourceId} />
          </Context.Card>
        </OverlayPage>
        <OverlayPage id={id} path="/source/embeds" width={343} height={431}>
          <Context.Card>
            <EmbedSelectionView id={id} sourceId={chosenSourceId} />
          </Context.Card>
        </OverlayPage>
      </OverlayRouter>
    </Overlay>
  );
}

export function Settings() {
  const router = useOverlayRouter("settings");
  const setHasOpenOverlay = usePlayerStore((s) => s.setHasOpenOverlay);

  useEffect(() => {
    setHasOpenOverlay(router.isRouterActive);
  }, [setHasOpenOverlay, router.isRouterActive]);

  return (
    <OverlayAnchor id={router.id}>
      <VideoPlayerButton onClick={() => router.open()} icon={Icons.GEAR} />
      <SettingsOverlay id={router.id} />
    </OverlayAnchor>
  );
}
