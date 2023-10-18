import { useCallback } from "react";

import { Toggle } from "@/components/buttons/Toggle";
import { Icon, Icons } from "@/components/Icon";
import { Context } from "@/components/player/internals/ContextUtils";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";
import {
  SourceQuality,
  allQualities,
  qualityToString,
} from "@/stores/player/utils/qualities";
import { useQualityStore } from "@/stores/quality";

export function QualityOption(props: {
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

export function QualityView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const availableQualities = usePlayerStore((s) => s.qualities);
  const currentQuality = usePlayerStore((s) => s.currentQuality);
  const switchQuality = usePlayerStore((s) => s.switchQuality);
  const setAutomaticQuality = useQualityStore((s) => s.setAutomaticQuality);
  const setLastChosenQuality = useQualityStore((s) => s.setLastChosenQuality);
  const autoQuality = useQualityStore((s) => s.quality.automaticQuality);

  const change = useCallback(
    (q: SourceQuality) => {
      switchQuality(q);
      setLastChosenQuality(q);
      setAutomaticQuality(false);
      router.close();
    },
    [router, switchQuality, setLastChosenQuality, setAutomaticQuality]
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
          <Toggle
            onClick={() => setAutomaticQuality(!autoQuality)}
            enabled={autoQuality}
          />
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
