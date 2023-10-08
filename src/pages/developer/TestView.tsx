import { OverlayAnchor } from "@/components/overlays/OverlayAnchor";
import { Overlay, OverlayDisplay } from "@/components/overlays/OverlayDisplay";
import { OverlayPage } from "@/components/overlays/OverlayPage";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";

// simple empty view, perfect for putting in tests
export default function TestView() {
  const router = useOverlayRouter("test");
  const pages = ["", "/one", "/two"];

  return (
    <OverlayDisplay>
      <div className="h-[400px] w-[800px] flex justify-center items-center">
        <button
          type="button"
          onClick={() => {
            router.open();
          }}
        >
          Open
        </button>
        <button
          type="button"
          onClick={() => {
            router.navigate(pages[Math.floor(pages.length * Math.random())]);
          }}
        >
          random page
        </button>
        <OverlayAnchor id="test">
          <div className="h-20 w-20 bg-white" />
        </OverlayAnchor>
        <Overlay id="test">
          <OverlayPage {...router.pageProps("")}>Home</OverlayPage>
          <OverlayPage {...router.pageProps("/one")}>Page one</OverlayPage>
          <OverlayPage {...router.pageProps("/two")}>Page two</OverlayPage>
        </Overlay>
      </div>
    </OverlayDisplay>
  );
}
