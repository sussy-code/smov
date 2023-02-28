import { FloatingView } from "@/components/popout/FloatingView";
import { useFloatingRouter } from "@/hooks/useFloatingRouter";
import { DownloadAction } from "@/video/components/actions/list-entries/DownloadAction";
import { CaptionsSelectionAction } from "../actions/CaptionsSelectionAction";
import { SourceSelectionAction } from "../actions/SourceSelectionAction";
import { CaptionSelectionPopout } from "./CaptionSelectionPopout";
import { PopoutSection } from "./PopoutUtils";

function TestPopout(props: { router: ReturnType<typeof useFloatingRouter> }) {
  const isCollapsed = props.router.isLoaded("embed");

  return (
    <div>
      <p onClick={() => props.router.navigate("/")}>go back</p>
      <p>{isCollapsed ? "opened" : "closed"}</p>
      <p onClick={() => props.router.navigate("/source/embed")}>Open</p>
    </div>
  );
}

export function SettingsPopout() {
  const floatingRouter = useFloatingRouter();
  const { pageProps, navigate, isLoaded, isActive } = floatingRouter;

  return (
    <>
      <FloatingView {...pageProps("/")} width={320}>
        <PopoutSection>
          <DownloadAction />
          <SourceSelectionAction onClick={() => navigate("/source")} />
          <CaptionsSelectionAction onClick={() => navigate("/captions")} />
        </PopoutSection>
      </FloatingView>
      <FloatingView
        active={isActive("source")}
        show={isLoaded("source")}
        height={500}
        width={320}
      >
        <TestPopout router={floatingRouter} />
        {/* <SourceSelectionPopout /> */}
      </FloatingView>
      <FloatingView {...pageProps("captions")} height={500} width={320}>
        <CaptionSelectionPopout />
      </FloatingView>
    </>
  );
}
