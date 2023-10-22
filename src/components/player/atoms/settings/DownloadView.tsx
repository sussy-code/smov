import { Menu } from "@/components/player/internals/ContextMenu";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";

export function DownloadView({ id }: { id: string }) {
  const router = useOverlayRouter(id);

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/")}>
        Download
      </Menu.BackLink>
      <Menu.Section>
        <div className="space-y-4 mt-3">
          <Menu.Paragraph>
            Downloads are taken directly from the provider. movie-web does not
            have control over how the downloads are provided.
          </Menu.Paragraph>
          <Menu.Paragraph>
            To download on iOS, click <Menu.Highlight>Share</Menu.Highlight>,
            then <Menu.Highlight>Save to File</Menu.Highlight> and then as after
            you click the button.
          </Menu.Paragraph>
          <Menu.Paragraph>
            To download on Android or PC, click or tap and hold on the video,
            then select save as.
          </Menu.Paragraph>
        </div>
      </Menu.Section>
    </>
  );
}
