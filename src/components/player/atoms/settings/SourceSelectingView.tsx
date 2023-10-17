import classNames from "classnames";
import { useMemo } from "react";

import { Icon, Icons } from "@/components/Icon";
import { Context } from "@/components/player/internals/ContextUtils";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";
import { providers } from "@/utils/providers";

export function SourceOption(props: {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={props.onClick}
      className="grid grid-cols-[auto,1fr,auto] items-center gap-3 rounded -ml-3 -mr-3 px-3 py-2 cursor-pointer hover:bg-video-context-border hover:bg-opacity-10"
    >
      <span
        className={classNames(props.selected && "text-white", "font-medium")}
      >
        {props.children}
      </span>
      {props.selected ? (
        <Icon
          icon={Icons.CIRCLE_CHECK}
          className="text-xl text-video-context-type-accent"
        />
      ) : null}
    </div>
  );
}

export function SourceSelectionView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const metaType = usePlayerStore((s) => s.meta?.type);
  const sources = useMemo(() => {
    if (!metaType) return [];
    return providers
      .listSources()
      .filter((v) => v.mediaTypes?.includes(metaType));
  }, [metaType]);

  return (
    <>
      <Context.BackLink onClick={() => router.navigate("/")}>
        Sources
      </Context.BackLink>
      <Context.Section>
        {sources.map((v) => (
          <SourceOption key={v.id}>{v.name}</SourceOption>
        ))}
      </Context.Section>
    </>
  );
}
