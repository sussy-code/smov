import { ReactNode } from "react";
import { useAsync, useAsyncFn } from "react-use";

import {
  downloadSrt,
  getHighestRatedSubs,
  getOpenSubsId,
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
  return (
    <SelectableLink selected={props.selected} onClick={props.onClick}>
      <span className="flex items-center">
        <span className="mr-3">
          <FlagIcon countryCode={props.countryCode} />
        </span>
        <span>{props.children}</span>
      </span>
    </SelectableLink>
  );
}

export function CaptionsView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const setCaption = usePlayerStore((s) => s.setCaption);
  const lang = usePlayerStore((s) => s.caption.selected?.language);
  const setLanguage = useSubtitleStore((s) => s.setLanguage);
  const meta = usePlayerStore((s) => s.meta);

  const req = useAsync(async () => {
    if (!meta) throw new Error("No meta");
    const subId = await getOpenSubsId(meta);
    if (!subId) throw new Error("No sub id found");
    const subs = await getHighestRatedSubs(subId);
    return {
      subId,
      subs,
    };
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
    content = req.value.subs.map((v) => (
      <CaptionOption
        key={v.id}
        countryCode={v.language}
        selected={lang === v.language}
        onClick={() => startDownload(v.id, v.language)}
      >
        {v.language}
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
