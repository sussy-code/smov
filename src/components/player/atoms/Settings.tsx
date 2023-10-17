import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";

import { Toggle } from "@/components/buttons/Toggle";
import { Icon, Icons } from "@/components/Icon";
import { OverlayAnchor } from "@/components/overlays/OverlayAnchor";
import { Overlay } from "@/components/overlays/OverlayDisplay";
import { OverlayPage } from "@/components/overlays/OverlayPage";
import { OverlayRouter } from "@/components/overlays/OverlayRouter";
import { VideoPlayerButton } from "@/components/player/internals/Button";
import { Context } from "@/components/player/internals/ContextUtils";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";
import {
  SourceQuality,
  allQualities,
  qualityToString,
} from "@/stores/player/utils/qualities";

function QualityOption(props: {
  children: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  let textClasses;
  if (props.selected) textClasses = "text-white";
  if (props.disabled)
    textClasses = "text-video-context-type-main text-opacity-40";

  return (
    <Context.Link onClick={props.disabled ? undefined : props.onClick}>
      <Context.LinkTitle textClass={textClasses}>
        {props.children}
      </Context.LinkTitle>
      {props.selected ? (
        <Icon
          icon={Icons.CIRCLE_CHECK}
          className="text-xl text-video-context-type-accent"
        />
      ) : null}
    </Context.Link>
  );
}

function QualityView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const availableQualities = usePlayerStore((s) => s.qualities);
  const currentQuality = usePlayerStore((s) => s.currentQuality);
  const switchQuality = usePlayerStore((s) => s.switchQuality);

  const change = useCallback(
    (q: SourceQuality) => {
      switchQuality(q);
      router.close();
    },
    [router, switchQuality]
  );

  const allVisibleQualities = allQualities.filter((t) => t !== "unknown");

  return (
    <>
      <Context.BackLink onClick={() => router.navigate("/")}>
        Quality
      </Context.BackLink>
      <Context.Section>
        {allVisibleQualities.map((v) => (
          <QualityOption
            key={v}
            selected={v === currentQuality}
            onClick={
              availableQualities.includes(v) ? () => change(v) : undefined
            }
            disabled={!availableQualities.includes(v)}
          >
            {qualityToString(v)}
          </QualityOption>
        ))}
        <Context.Divider />
        <Context.Link>
          <Context.LinkTitle>Automatic quality</Context.LinkTitle>
          <span>Toggle</span>
        </Context.Link>
        <Context.SmallText>
          You can try{" "}
          <Context.Anchor onClick={() => router.navigate("/source")}>
            switching source
          </Context.Anchor>{" "}
          to get different quality options.
        </Context.SmallText>
      </Context.Section>
    </>
  );
}

function ColorOption(props: {
  color: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={classNames(
        "p-1.5 bg-video-context-buttonFocus rounded transition-colors duration-100",
        props.active ? "bg-opacity-100" : "bg-opacity-0 cursor-pointer"
      )}
      onClick={props.onClick}
    >
      <div
        className="w-6 h-6 rounded-full flex justify-center items-center"
        style={{ backgroundColor: props.color }}
      >
        {props.active ? (
          <Icon className="text-sm text-black" icon={Icons.CHECKMARK} />
        ) : null}
      </div>
    </div>
  );
}

function CaptionSettingsView({ id }: { id: string }) {
  const router = useOverlayRouter(id);

  return (
    <>
      <Context.BackLink onClick={() => router.navigate("/captions")}>
        Custom captions
      </Context.BackLink>
      <Context.Section>
        <div className="flex justify-between items-center">
          <Context.FieldTitle>Color</Context.FieldTitle>
          <div className="flex justify-center items-center">
            <ColorOption onClick={() => {}} color="#FFFFFF" active />
            <ColorOption onClick={() => {}} color="#80B1FA" />
            <ColorOption onClick={() => {}} color="#E2E535" />
          </div>
        </div>
      </Context.Section>
    </>
  );
}

function CaptionsView({ id }: { id: string }) {
  const router = useOverlayRouter(id);

  return (
    <>
      <Context.BackLink onClick={() => router.navigate("/captions")}>
        Captions
      </Context.BackLink>
      <Context.Section>Yee!</Context.Section>
    </>
  );
}

function SettingsOverlay({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const currentQuality = usePlayerStore((s) => s.currentQuality);

  const [tmpBool, setTmpBool] = useState(false);

  function toggleBool() {
    setTmpBool(!tmpBool);
  }

  return (
    <Overlay id={id}>
      <OverlayRouter id={id}>
        <OverlayPage id={id} path="/" width={343} height={431}>
          <Context.Card>
            <Context.SectionTitle>Video settings</Context.SectionTitle>
            <Context.Section>
              <Context.Link onClick={() => router.navigate("/quality")}>
                <Context.LinkTitle>Quality</Context.LinkTitle>
                <Context.LinkChevron>
                  {currentQuality ? qualityToString(currentQuality) : ""}
                </Context.LinkChevron>
              </Context.Link>
              <Context.Link onClick={() => router.navigate("/source")}>
                <Context.LinkTitle>Video source</Context.LinkTitle>
                <Context.LinkChevron>SuperStream</Context.LinkChevron>
              </Context.Link>
              <Context.Link>
                <Context.LinkTitle>Download</Context.LinkTitle>
                <Context.IconButton icon={Icons.DOWNLOAD} />
              </Context.Link>
            </Context.Section>

            <Context.SectionTitle>Viewing Experience</Context.SectionTitle>
            <Context.Section>
              <Context.Link>
                <Context.LinkTitle>Enable Captions</Context.LinkTitle>
                <Toggle enabled={tmpBool} onClick={() => toggleBool()} />
              </Context.Link>
              <Context.Link onClick={() => router.navigate("/captions")}>
                <Context.LinkTitle>Caption settings</Context.LinkTitle>
                <Context.LinkChevron>English</Context.LinkChevron>
              </Context.Link>
              <Context.Link>
                <Context.LinkTitle>Playback settings</Context.LinkTitle>
                <Context.LinkChevron />
              </Context.Link>
            </Context.Section>
          </Context.Card>
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
        <OverlayPage id={id} path="/captions/settings" width={343} height={431}>
          <Context.Card>
            <CaptionSettingsView id={id} />
          </Context.Card>
        </OverlayPage>
        <OverlayPage id={id} path="/source" width={343} height={431}>
          <Context.Card>
            <Context.BackLink onClick={() => router.navigate("/")}>
              It&apos;s a minion!
            </Context.BackLink>
            <img src="https://media2.giphy.com/media/oa4Au5xDZ6HJYF6KGH/giphy.gif" />
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
