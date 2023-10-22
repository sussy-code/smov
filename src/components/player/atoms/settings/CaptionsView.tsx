import Fuse from "fuse.js";
import { ReactNode, useState } from "react";
import { useAsync, useAsyncFn } from "react-use";

import { languageIdToName } from "@/backend/helpers/subs";
import { FlagIcon } from "@/components/FlagIcon";
import { useCaptions } from "@/components/player/hooks/useCaptions";
import { Menu } from "@/components/player/internals/ContextMenu";
import { Input } from "@/components/player/internals/ContextMenu/Input";
import { SelectableLink } from "@/components/player/internals/ContextMenu/Links";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";

export function CaptionOption(props: {
  countryCode?: string;
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  // Country code overrides
  const countryOverrides: Record<string, string> = {
    en: "gb",
    cs: "cz",
    el: "gr",
    fa: "ir",
    ko: "kr",
    he: "il",
    ze: "cn",
    ar: "sa",
  };
  let countryCode =
    (props.countryCode || "")?.split("-").pop()?.toLowerCase() || "";
  if (countryOverrides[countryCode])
    countryCode = countryOverrides[countryCode];

  return (
    <SelectableLink selected={props.selected} onClick={props.onClick}>
      <span className="flex items-center">
        <span data-code={props.countryCode} className="mr-3">
          <FlagIcon countryCode={countryCode} />
        </span>
        <span>{props.children}</span>
      </span>
    </SelectableLink>
  );
}

// TODO cache like everything in this view
// TODO fix language names, some are unknown
// TODO sort languages by common usage
export function CaptionsView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const lang = usePlayerStore((s) => s.caption.selected?.language);
  const { search, download, disable } = useCaptions();

  const [searchQuery, setSearchQuery] = useState("");

  const req = useAsync(async () => search(), [search]);

  const [downloadReq, startDownload] = useAsyncFn(
    (subtitleId: string, language: string) => download(subtitleId, language),
    [download]
  );

  let downloadProgress: ReactNode = null;
  if (downloadReq.loading) downloadProgress = <p>downloading...</p>;
  else if (downloadReq.error) downloadProgress = <p>failed to download...</p>;

  let content: ReactNode = null;
  if (req.loading) content = <p>loading...</p>;
  else if (req.error) content = <p>errored!</p>;
  else if (req.value) {
    const subs = req.value.map((v) => {
      const languageName = languageIdToName(v.attributes.language) ?? "unknown";
      return {
        ...v,
        languageName,
      };
    });

    let results = subs;
    if (searchQuery.trim().length > 0) {
      const fuse = new Fuse(subs, {
        includeScore: true,
        keys: ["languageName"],
      });

      results = fuse.search(searchQuery).map((res) => res.item);
    }

    content = results.map((v) => {
      return (
        <CaptionOption
          key={v.id}
          countryCode={v.attributes.language}
          selected={lang === v.attributes.language}
          onClick={() =>
            startDownload(
              v.attributes.legacy_subtitle_id,
              v.attributes.language
            )
          }
        >
          {v.languageName}
        </CaptionOption>
      );
    });
  }

  return (
    <>
      <Menu.BackLink
        onClick={() => router.navigate("/")}
        rightSide={
          <button
            type="button"
            onClick={() => router.navigate("/captions/settings")}
          >
            Customize
          </button>
        }
      >
        Captions
      </Menu.BackLink>
      <Menu.Section className="pb-6">
        <Input value={searchQuery} onInput={setSearchQuery} />
        {downloadProgress}
        <CaptionOption onClick={() => disable()} selected={!lang}>
          Off
        </CaptionOption>
        {content}
      </Menu.Section>
    </>
  );
}
