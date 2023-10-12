import { useEffect } from "react";

import { Icons } from "@/components/Icon";
import { OverlayAnchor } from "@/components/overlays/OverlayAnchor";
import { Overlay } from "@/components/overlays/OverlayDisplay";
import { OverlayPage } from "@/components/overlays/OverlayPage";
import { OverlayRouter } from "@/components/overlays/OverlayRouter";
import { VideoPlayerButton } from "@/components/player/internals/Button";
import { Context } from "@/components/player/internals/ContextUtils";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";

function SettingsOverlay({ id }: { id: string }) {
  const router = useOverlayRouter("settings");

  return (
    <Overlay id={id}>
      <OverlayRouter id={id}>
        <OverlayPage id={id} path="/" width={343} height={431}>
          <Context.Card>
            <Context.Title>Ba ba ba ba my title</Context.Title>
            <Context.Section>
              Hi
              <Context.Link onClick={() => router.navigate("/other")}>
                <Context.LinkTitle>Go to page 2</Context.LinkTitle>
                <Context.LinkChevron />
              </Context.Link>
              <Context.Link>
                <Context.LinkTitle>Video source</Context.LinkTitle>
                <Context.LinkChevron>SuperStream</Context.LinkChevron>
              </Context.Link>
            </Context.Section>
          </Context.Card>
        </OverlayPage>
        <OverlayPage id={id} path="/other" width={343} height={431}>
          <Context.Card>
            <Context.Title>Some other bit</Context.Title>
            <Context.Section>
              <button type="button" onClick={() => router.navigate("/")}>
                Go BACK PLS
              </button>
            </Context.Section>
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
