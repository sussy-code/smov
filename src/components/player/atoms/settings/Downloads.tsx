import { useCallback, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/Button";
import { Icon, Icons } from "@/components/Icon";
import { OverlayPage } from "@/components/overlays/OverlayPage";
import { Menu } from "@/components/player/internals/ContextMenu";
import { convertSubtitlesToSrtDataurl } from "@/components/player/utils/captions";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";

function useDownloadLink() {
  const source = usePlayerStore((s) => s.source);
  const currentQuality = usePlayerStore((s) => s.currentQuality);
  const url = useMemo(() => {
    if (source?.type === "file" && currentQuality)
      return source.qualities[currentQuality]?.url ?? null;
    if (source?.type === "hls") return source.url;
    return null;
  }, [source, currentQuality]);
  return url;
}

function StyleTrans(props: { k: string }) {
  return (
    <Trans
      i18nKey={props.k}
      components={{
        bold: <Menu.Highlight />,
        br: <br />,
        ios_share: (
          <Icon icon={Icons.IOS_SHARE} className="inline-block text-xl -mb-1" />
        ),
        ios_files: (
          <Icon icon={Icons.IOS_FILES} className="inline-block text-xl -mb-1" />
        ),
      }}
    />
  );
}

export function DownloadView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const { t } = useTranslation();
  const downloadUrl = useDownloadLink();

  const sourceType = usePlayerStore((s) => s.source?.type);
  const selectedCaption = usePlayerStore((s) => s.caption?.selected);
  const openSubtitleDownload = useCallback(() => {
    const dataUrl = selectedCaption
      ? convertSubtitlesToSrtDataurl(selectedCaption?.srtData)
      : null;
    if (!dataUrl) return;
    window.open(dataUrl);
  }, [selectedCaption]);

  if (!downloadUrl) return null;

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/")}>
        {t("player.menus.downloads.title")}
      </Menu.BackLink>
      <Menu.Section>
        <div>
          {sourceType === "hls" ? (
            <>
              <Menu.Paragraph marginClass="mb-6">
                <StyleTrans k="player.menus.downloads.hlsDisclaimer" />
              </Menu.Paragraph>

              <Button className="w-full" href={downloadUrl} theme="purple">
                {t("player.menus.downloads.downloadPlaylist")}
              </Button>
              <Button
                className="w-full mt-2"
                onClick={openSubtitleDownload}
                disabled={!selectedCaption}
                theme="secondary"
              >
                {t("player.menus.downloads.downloadSubtitle")}
              </Button>
            </>
          ) : (
            <>
              <Menu.ChevronLink onClick={() => router.navigate("/download/pc")}>
                {t("player.menus.downloads.onPc.title")}
              </Menu.ChevronLink>
              <Menu.ChevronLink
                onClick={() => router.navigate("/download/ios")}
              >
                {t("player.menus.downloads.onIos.title")}
              </Menu.ChevronLink>
              <Menu.ChevronLink
                onClick={() => router.navigate("/download/android")}
              >
                {t("player.menus.downloads.onAndroid.title")}
              </Menu.ChevronLink>

              <Menu.Divider />

              <Menu.Paragraph marginClass="my-6">
                <StyleTrans k="player.menus.downloads.disclaimer" />
              </Menu.Paragraph>

              <Button className="w-full" href={downloadUrl} theme="purple">
                {t("player.menus.downloads.downloadVideo")}
              </Button>
              <Button
                className="w-full mt-2"
                onClick={openSubtitleDownload}
                disabled={!selectedCaption}
                theme="secondary"
                download="subtitles.srt"
              >
                {t("player.menus.downloads.downloadSubtitle")}
              </Button>
            </>
          )}
        </div>
      </Menu.Section>
    </>
  );
}

function AndroidExplanationView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const { t } = useTranslation();

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/download")}>
        {t("player.menus.downloads.onAndroid.shortTitle")}
      </Menu.BackLink>
      <Menu.Section>
        <Menu.Paragraph>
          <StyleTrans k="player.menus.downloads.onAndroid.1" />
        </Menu.Paragraph>
      </Menu.Section>
    </>
  );
}

function PCExplanationView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const { t } = useTranslation();

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/download")}>
        {t("player.menus.downloads.onPc.shortTitle")}
      </Menu.BackLink>
      <Menu.Section>
        <Menu.Paragraph>
          <StyleTrans k="player.menus.downloads.onPc.1" />
        </Menu.Paragraph>
      </Menu.Section>
    </>
  );
}

function IOSExplanationView({ id }: { id: string }) {
  const router = useOverlayRouter(id);

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/download")}>
        <StyleTrans k="player.menus.downloads.onIos.shortTitle" />
      </Menu.BackLink>
      <Menu.Section>
        <Menu.Paragraph>
          <StyleTrans k="player.menus.downloads.onIos.1" />
        </Menu.Paragraph>
      </Menu.Section>
    </>
  );
}

export function DownloadRoutes({ id }: { id: string }) {
  return (
    <>
      <OverlayPage id={id} path="/download" width={343} height={490}>
        <Menu.CardWithScrollable>
          <DownloadView id={id} />
        </Menu.CardWithScrollable>
      </OverlayPage>
      <OverlayPage id={id} path="/download/ios" width={343} height={440}>
        <Menu.CardWithScrollable>
          <IOSExplanationView id={id} />
        </Menu.CardWithScrollable>
      </OverlayPage>
      <OverlayPage id={id} path="/download/android" width={343} height={440}>
        <Menu.CardWithScrollable>
          <AndroidExplanationView id={id} />
        </Menu.CardWithScrollable>
      </OverlayPage>
      <OverlayPage id={id} path="/download/pc" width={343} height={440}>
        <Menu.CardWithScrollable>
          <PCExplanationView id={id} />
        </Menu.CardWithScrollable>
      </OverlayPage>
    </>
  );
}
