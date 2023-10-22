import { ReactNode } from "react";
import { useAsync, useAsyncFn } from "react-use";

import {
  downloadSrt,
  languageIdToName,
  searchSubtitles,
} from "@/backend/helpers/subs";
import { FlagIcon } from "@/components/FlagIcon";
import { Menu } from "@/components/player/internals/ContextMenu";
import { SelectableLink } from "@/components/player/internals/ContextMenu/Links";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";
import { useSubtitleStore } from "@/stores/subtitles";

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
// TODO make quick settings for caption language
// TODO fix language names, some are unknown
// TODO add search bar for languages
// TODO sort languages by common usage
export function CaptionsView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const setCaption = usePlayerStore((s) => s.setCaption);
  const lang = usePlayerStore((s) => s.caption.selected?.language);
  const setLanguage = useSubtitleStore((s) => s.setLanguage);
  const meta = usePlayerStore((s) => s.meta);

  const req = useAsync(async () => {
    if (!meta) throw new Error("No meta");
    return searchSubtitles(meta);
  }, [meta]);

  const [downloadReq, startDownload] = useAsyncFn(
    async (subtitleId: string, language: string) => {
      const srtData = await downloadSrt(subtitleId);
      setCaption({
        language,
        srtData,
        url: "", // TODO remove url
      });
      setLanguage(language);
    },
    [setCaption, setLanguage]
  );

  function disableCaption() {
    setCaption(null);
    setLanguage(null);
  }

  let downloadProgress: ReactNode = null;
  if (downloadReq.loading) downloadProgress = <p>downloading...</p>;
  else if (downloadReq.error) downloadProgress = <p>failed to download...</p>;

  let content: ReactNode = null;
  if (req.loading) content = <p>loading...</p>;
  else if (req.error) content = <p>errored!</p>;
  else if (req.value)
    content = req.value.map((v) => (
      <CaptionOption
        key={v.id}
        countryCode={v.attributes.language}
        selected={lang === v.attributes.language}
        onClick={() =>
          startDownload(v.attributes.legacy_subtitle_id, v.attributes.language)
        }
      >
        {languageIdToName(v.attributes.language) ?? "unknown"}
      </CaptionOption>
    ));

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
      <Menu.Section>
        {downloadProgress}
        <CaptionOption onClick={() => disableCaption()} selected={!lang}>
          Off
        </CaptionOption>
        {content}
      </Menu.Section>
    </>
  );
}
