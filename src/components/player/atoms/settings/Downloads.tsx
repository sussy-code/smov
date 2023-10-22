import { Icon, Icons } from "@/components/Icon";
import { OverlayPage } from "@/components/overlays/OverlayPage";
import { Menu } from "@/components/player/internals/ContextMenu";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";

export function DownloadView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const source = usePlayerStore((s) => s.source);
  if (source?.type === "hls") return null;

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/")}>
        Download
      </Menu.BackLink>
      <Menu.Section>
        <div className="mt-3">
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

          <Menu.Paragraph>
            Downloads are taken directly from the provider. movie-web does not
            have control over how the downloads are provided.
          </Menu.Paragraph>

          <a
            href="https://pastebin.com/x9URMct0"
            rel="noreferrer"
            target="_blank"
            download
            className="cursor-pointer flex justify-center items-center w-full p-2.5 !mt-6 rounded-lg bg-video-context-download-button hover:bg-video-context-download-hover transition-colors duration-150 text-white font-medium"
          >
            Download
          </a>
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
          On PC, click the{" "}
          <Menu.Highlight>
            three dots
            <Icon
              className="inline-block text-xl -mb-1"
              icon={Icons.MORE_VERTICAL}
            />
          </Menu.Highlight>{" "}
          and click <Menu.Highlight>download</Menu.Highlight>.
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
      <OverlayPage id={id} path="/download" width={343} height={440}>
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
