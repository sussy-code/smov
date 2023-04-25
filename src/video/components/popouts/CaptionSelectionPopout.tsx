import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import {
  customCaption,
  getCaptionUrl,
  makeCaptionId,
  parseSubtitles,
  subtitleTypeList,
} from "@/backend/helpers/captions";
import { MWCaption, MWCaptionType } from "@/backend/helpers/streams";
import { Icon, Icons } from "@/components/Icon";
import { FloatingCardView } from "@/components/popout/FloatingCard";
import { FloatingView } from "@/components/popout/FloatingView";
import { useFloatingRouter } from "@/hooks/useFloatingRouter";
import { useLoading } from "@/hooks/useLoading";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useMeta } from "@/video/state/logic/meta";
import { useSource } from "@/video/state/logic/source";

import { PopoutListEntry, PopoutSection } from "./PopoutUtils";

export function CaptionSelectionPopout(props: {
  router: ReturnType<typeof useFloatingRouter>;
  prefix: string;
}) {
  const { t } = useTranslation();

  const descriptor = useVideoPlayerDescriptor();
  const meta = useMeta(descriptor);
  const source = useSource(descriptor);
  const controls = useControls(descriptor);
  const linkedCaptions = useMemo(
    () =>
      meta?.captions.map((v) => ({ ...v, id: makeCaptionId(v, true) })) ?? [],
    [meta]
  );
  const loadingId = useRef<string>("");
  const [setCaption, loading, error] = useLoading(
    async (caption: MWCaption, isLinked: boolean) => {
      const id = makeCaptionId(caption, isLinked);
      loadingId.current = id;
      const blobUrl = await getCaptionUrl(caption);
      const result = await fetch(blobUrl);
      const text = await result.text();
      parseSubtitles(text); // This will throw if the file is invalid
      controls.setCaption(id, blobUrl);
      // sometimes this doesn't work, so we add a small delay
      setTimeout(() => {
        controls.closePopout();
      }, 100);
    }
  );

  const currentCaption = source.source?.caption?.id;
  const customCaptionUploadElement = useRef<HTMLInputElement>(null);
  return (
    <FloatingView
      {...props.router.pageProps(props.prefix)}
      width={320}
      height={500}
    >
      <FloatingCardView.Header
        title={t("videoPlayer.popouts.captions")}
        description={t("videoPlayer.popouts.descriptions.captions")}
        goBack={() => props.router.navigate("/")}
        action={
          <button
            type="button"
            onClick={() =>
              props.router.navigate(`${props.prefix}/caption-settings`)
            }
            className="flex cursor-pointer items-center space-x-2 transition-colors duration-200 hover:text-white"
          >
            <span>{t("videoPlayer.popouts.captionPreferences.title")}</span>
            <Icon icon={Icons.GEAR} />
          </button>
        }
      />
      <FloatingCardView.Content noSection>
        <PopoutSection>
          <PopoutListEntry
            active={!currentCaption}
            onClick={() => {
              controls.clearCaption();
              controls.closePopout();
            }}
          >
            {t("videoPlayer.popouts.noCaptions")}
          </PopoutListEntry>
          <PopoutListEntry
            key={customCaption}
            active={currentCaption === customCaption}
            loading={loading && loadingId.current === customCaption}
            errored={error && loadingId.current === customCaption}
            onClick={() => customCaptionUploadElement.current?.click()}
          >
            {currentCaption === customCaption
              ? t("videoPlayer.popouts.customCaption")
              : t("videoPlayer.popouts.uploadCustomCaption")}
            <input
              className="hidden"
              ref={customCaptionUploadElement}
              accept={subtitleTypeList.join(",")}
              type="file"
              onChange={(e) => {
                if (!e.target.files) return;
                const customSubtitle = {
                  langIso: "custom",
                  url: URL.createObjectURL(e.target.files[0]),
                  type: MWCaptionType.UNKNOWN,
                };
                setCaption(customSubtitle, false);
              }}
            />
          </PopoutListEntry>
        </PopoutSection>

        <p className="sticky top-0 z-10 flex items-center space-x-1 bg-ash-300 px-5 py-3 text-xs font-bold uppercase">
          <Icon className="text-base" icon={Icons.LINK} />
          <span>{t("videoPlayer.popouts.linkedCaptions")}</span>
        </p>

        <PopoutSection className="pt-0">
          <div>
            {linkedCaptions.map((link) => (
              <PopoutListEntry
                key={link.langIso}
                active={link.id === currentCaption}
                loading={loading && link.id === loadingId.current}
                errored={error && link.id === loadingId.current}
                onClick={() => {
                  loadingId.current = link.id;
                  setCaption(link, true);
                }}
              >
                {link.langIso}
              </PopoutListEntry>
            ))}
          </div>
        </PopoutSection>
      </FloatingCardView.Content>
    </FloatingView>
  );
}
