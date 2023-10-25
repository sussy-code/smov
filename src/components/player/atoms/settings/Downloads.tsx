import { useMemo } from "react";

import { Button } from "@/components/Button";
import { Icon, Icons } from "@/components/Icon";
import { OverlayPage } from "@/components/overlays/OverlayPage";
import { Menu } from "@/components/player/internals/ContextMenu";
import { convertSubtitlesToDataurl } from "@/components/player/utils/captions";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";

function useDownloadLink() {
  const source = usePlayerStore((s) => s.source);
  const currentQuality = usePlayerStore((s) => s.currentQuality);
  const url = useMemo(() => {
    if (source?.type === "file" && currentQuality)
      return source.qualities[currentQuality]?.url ?? null;
    return null;
  }, [source, currentQuality]);
  return url;
}

export function DownloadView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const downloadUrl = useDownloadLink();

  const selectedCaption = usePlayerStore((s) => s.caption?.selected);
  const subtitleUrl = selectedCaption
    ? convertSubtitlesToDataurl(selectedCaption?.srtData)
    : null;

  console.log(subtitleUrl);

  if (!downloadUrl) return null;

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/")}>
        Download
      </Menu.BackLink>
      <Menu.Section>
        <div>
          <Menu.ChevronLink onClick={() => router.navigate("/download/pc")}>
            Downloading on PC
          </Menu.ChevronLink>
          <Menu.ChevronLink onClick={() => router.navigate("/download/ios")}>
            Downloading on iOS
          </Menu.ChevronLink>
          <Menu.ChevronLink
            onClick={() => router.navigate("/download/android")}
          >
            Downloading on Android
          </Menu.ChevronLink>

          <Menu.Divider />

          <Menu.Paragraph marginClass="my-6">
            Downloads are taken directly from the provider. movie-web does not
            have control over how the downloads are provided.
          </Menu.Paragraph>

          <Button className="w-full" href={downloadUrl} theme="purple">
            Download video
          </Button>
          <Button
            className="w-full mt-2"
            href={subtitleUrl ?? undefined}
            disabled={!subtitleUrl}
            theme="secondary"
            download
          >
            Download current caption
          </Button>
        </div>
      </Menu.Section>
    </>
  );
}

export function CantDownloadView({ id }: { id: string }) {
  const router = useOverlayRouter(id);

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/")}>
        Download
      </Menu.BackLink>
      <Menu.Section>
        <Menu.Paragraph>
          Insert explanation for why you can&apos;t download HLS here
        </Menu.Paragraph>
      </Menu.Section>
    </>
  );
}

function AndroidExplanationView({ id }: { id: string }) {
  const router = useOverlayRouter(id);

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/download")}>
        Download / Android
      </Menu.BackLink>
      <Menu.Section>
        <Menu.Paragraph>
          To download on Android, <Menu.Highlight>tap and hold</Menu.Highlight>{" "}
          on the video, then select <Menu.Highlight>save</Menu.Highlight>.
        </Menu.Paragraph>
      </Menu.Section>
    </>
  );
}

function PCExplanationView({ id }: { id: string }) {
  const router = useOverlayRouter(id);

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/download")}>
        Download / PC
      </Menu.BackLink>
      <Menu.Section>
        <Menu.Paragraph>
          On PC, right click the video and select{" "}
          <Menu.Highlight>Save video as</Menu.Highlight>
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
        Download / iOS
      </Menu.BackLink>
      <Menu.Section>
        <Menu.Paragraph>
          To download on iOS, click{" "}
          <Menu.Highlight>
            <Icon
              className="inline-block text-xl -mb-1"
              icon={Icons.IOS_SHARE}
            />
          </Menu.Highlight>
          , then{" "}
          <Menu.Highlight>
            Save to Files
            <Icon
              className="inline-block text-xl -mb-1 mx-1"
              icon={Icons.IOS_FILES}
            />
          </Menu.Highlight>{" "}
          . All that&apos;s left to do now is to pick a nice and cozy folder for
          your video!
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
      <OverlayPage id={id} path="/download/unable" width={343} height={440}>
        <Menu.CardWithScrollable>
          <CantDownloadView id={id} />
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
