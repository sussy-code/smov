import { ReactNode, useEffect, useMemo, useRef } from "react";

import { Loading } from "@/components/layout/Loading";
import {
  useEmbedScraping,
  useSourceScraping,
} from "@/components/player/hooks/useSourceSelection";
import { Menu } from "@/components/player/internals/ContextMenu";
import { SelectableLink } from "@/components/player/internals/ContextMenu/Links";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";
import { providers } from "@/utils/providers";

export interface SourceSelectionViewProps {
  id: string;
  onChoose?: (id: string) => void;
}

export interface EmbedSelectionViewProps {
  id: string;
  sourceId: string | null;
}

export function EmbedOption(props: {
  embedId: string;
  url: string;
  sourceId: string;
  routerId: string;
}) {
  const unknownEmbedName = "Unknown";

  const embedName = useMemo(() => {
    if (!props.embedId) return unknownEmbedName;
    const sourceMeta = providers.getMetadata(props.embedId);
    return sourceMeta?.name ?? unknownEmbedName;
  }, [props.embedId]);

  const { run, errored, loading } = useEmbedScraping(
    props.routerId,
    props.sourceId,
    props.url,
    props.embedId
  );

  return (
    <SelectableLink loading={loading} error={errored} onClick={run}>
      <span className="flex flex-col">
        <span>{embedName}</span>
      </span>
    </SelectableLink>
  );
}

export function EmbedSelectionView({ sourceId, id }: EmbedSelectionViewProps) {
  const router = useOverlayRouter(id);
  const { run, watching, notfound, loading, items, errored } =
    useSourceScraping(sourceId, id);

  const sourceName = useMemo(() => {
    if (!sourceId) return "...";
    const sourceMeta = providers.getMetadata(sourceId);
    return sourceMeta?.name ?? "...";
  }, [sourceId]);

  const lastSourceId = useRef<string | null>(null);
  useEffect(() => {
    if (lastSourceId.current === sourceId) return;
    lastSourceId.current = sourceId;
    if (!sourceId) return;
    run();
  }, [run, sourceId]);

  let content: ReactNode = null;
  if (loading)
    content = (
      <Menu.TextDisplay noIcon>
        <Loading />
      </Menu.TextDisplay>
    );
  else if (notfound)
    content = (
      <Menu.TextDisplay title="No stream">
        This source has no streams for this movie or show.
      </Menu.TextDisplay>
    );
  else if (items?.length === 0)
    content = (
      <Menu.TextDisplay title="No embeds found">
        We were unable to find any embeds for this source, please try another.
      </Menu.TextDisplay>
    );
  else if (errored)
    content = (
      <Menu.TextDisplay title="Failed to scrape">
        We were unable to find any videos for this source. Don&apos;t come
        bitchin&apos; to us about it, just try another source.
      </Menu.TextDisplay>
    );
  else if (watching)
    content = null; // when it starts watching, empty the display
  else if (items && sourceId)
    content = items.map((v) => (
      <EmbedOption
        key={`${v.embedId}-${v.url}`}
        embedId={v.embedId}
        url={v.url}
        routerId={id}
        sourceId={sourceId}
      />
    ));

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/source")}>
        {sourceName}
      </Menu.BackLink>
      <Menu.Section>{content}</Menu.Section>
    </>
  );
}

export function SourceSelectionView({
  id,
  onChoose,
}: SourceSelectionViewProps) {
  const router = useOverlayRouter(id);
  const metaType = usePlayerStore((s) => s.meta?.type);
  const currentSourceId = usePlayerStore((s) => s.sourceId);
  const sources = useMemo(() => {
    if (!metaType) return [];
    return providers
      .listSources()
      .filter((v) => v.mediaTypes?.includes(metaType));
  }, [metaType]);

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/")}>
        Sources
      </Menu.BackLink>
      <Menu.Section>
        {sources.map((v) => (
          <SelectableLink
            key={v.id}
            onClick={() => {
              onChoose?.(v.id);
              router.navigate("/source/embeds");
            }}
            selected={v.id === currentSourceId}
          >
            {v.name}
          </SelectableLink>
        ))}
      </Menu.Section>
    </>
  );
}
