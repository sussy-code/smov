import Fuse from "fuse.js";
import { ReactNode, useRef, useState } from "react";
import { useAsync, useAsyncFn } from "react-use";
import { convert } from "subsrt-ts";

import { SubtitleSearchItem, subtitleTypeList } from "@/backend/helpers/subs";
import { FlagIcon } from "@/components/FlagIcon";
import { useCaptions } from "@/components/player/hooks/useCaptions";
import { Menu } from "@/components/player/internals/ContextMenu";
import { Input } from "@/components/player/internals/ContextMenu/Input";
import { SelectableLink } from "@/components/player/internals/ContextMenu/Links";
import { getLanguageFromIETF } from "@/components/player/utils/language";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";
import { useSubtitleStore } from "@/stores/subtitles";
import { sortLangCodes } from "@/utils/sortLangCodes";

export function CaptionOption(props: {
  countryCode?: string;
  children: React.ReactNode;
  selected?: boolean;
  loading?: boolean;
  onClick?: () => void;
  error?: React.ReactNode;
}) {
  return (
    <SelectableLink
      selected={props.selected}
      loading={props.loading}
      error={props.error}
      onClick={props.onClick}
    >
      <span
        data-active-link={props.selected ? true : undefined}
        className="flex items-center"
      >
        <span data-code={props.countryCode} className="mr-3">
          <FlagIcon countryCode={props.countryCode} />
        </span>
        <span>{props.children}</span>
      </span>
    </SelectableLink>
  );
}

function searchSubs(
  subs: (SubtitleSearchItem & { languageName: string })[],
  searchQuery: string
) {
  const sorted = sortLangCodes(subs.map((t) => t.attributes.language));
  let results = subs.sort((a, b) => {
    return (
      sorted.indexOf(a.attributes.language) -
      sorted.indexOf(b.attributes.language)
    );
  });

  if (searchQuery.trim().length > 0) {
    const fuse = new Fuse(subs, {
      includeScore: true,
      keys: ["languageName"],
    });

    results = fuse.search(searchQuery).map((res) => res.item);
  }

  return results;
}

function CustomCaptionOption() {
  const lang = usePlayerStore((s) => s.caption.selected?.language);
  const setCaption = usePlayerStore((s) => s.setCaption);
  const setCustomSubs = useSubtitleStore((s) => s.setCustomSubs);
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <CaptionOption
      selected={lang === "custom"}
      onClick={() => fileInput.current?.click()}
    >
      Upload captions
      <input
        className="hidden"
        ref={fileInput}
        accept={subtitleTypeList.join(",")}
        type="file"
        onChange={(e) => {
          if (!e.target.files) return;
          const reader = new FileReader();
          reader.addEventListener("load", (event) => {
            if (!event.target || typeof event.target.result !== "string")
              return;
            const converted = convert(event.target.result, "srt");
            setCaption({
              language: "custom",
              srtData: converted,
            });
            setCustomSubs();
          });
          reader.readAsText(e.target.files[0], "utf-8");
        }}
      />
    </CaptionOption>
  );
}

export function CaptionsView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const lang = usePlayerStore((s) => s.caption.selected?.language);
  const [currentlyDownloading, setCurrentlyDownloading] = useState<
    string | null
  >(null);
  const { search, download, disable } = useCaptions();

  const [searchQuery, setSearchQuery] = useState("");

  const req = useAsync(async () => search(), [search]);

  const [downloadReq, startDownload] = useAsyncFn(
    async (subtitleId: string, language: string) => {
      setCurrentlyDownloading(subtitleId);
      return download(subtitleId, language);
    },
    [download, setCurrentlyDownloading]
  );

  let content: ReactNode = null;
  if (req.loading) content = <p>loading...</p>;
  else if (req.error) content = <p>errored!</p>;
  else if (req.value) {
    const subs = req.value.filter(Boolean).map((v) => {
      const languageName =
        getLanguageFromIETF(v.attributes.language) ?? "unknown";
      return {
        ...v,
        languageName,
      };
    });

    content = searchSubs(subs, searchQuery).map((v) => {
      return (
        <CaptionOption
          key={v.id}
          countryCode={v.attributes.language}
          selected={lang === v.attributes.language}
          loading={
            v.attributes.legacy_subtitle_id === currentlyDownloading &&
            downloadReq.loading
          }
          error={
            v.attributes.legacy_subtitle_id === currentlyDownloading &&
            downloadReq.error
              ? downloadReq.error
              : undefined
          }
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
      <div>
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
        <div className="mt-3">
          <Input value={searchQuery} onInput={setSearchQuery} />
        </div>
      </div>
      <Menu.ScrollToActiveSection
        loaded={req.loading}
        className="!pt-1 mt-2 pb-3"
      >
        <CaptionOption onClick={() => disable()} selected={!lang}>
          Off
        </CaptionOption>
        <CustomCaptionOption />
        {content}
      </Menu.ScrollToActiveSection>
    </>
  );
}
