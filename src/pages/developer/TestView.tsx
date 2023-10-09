import { OverlayAnchor } from "@/components/overlays/OverlayAnchor";
import { Overlay, OverlayDisplay } from "@/components/overlays/OverlayDisplay";
import { OverlayPage } from "@/components/overlays/OverlayPage";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";

// simple empty view, perfect for putting in tests
export default function TestView() {
  const router = useOverlayRouter("test");

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
        <OverlayAnchor id="test">
          <div className="h-20 w-20 bg-white" />
        </OverlayAnchor>
        <Overlay id="test">
          <OverlayPage id="test" path="/">
            <div className="bg-blue-900 p-4">
              <p>HOME</p>
              <button
                type="button"
                onClick={() => {
                  router.navigate("/two");
                }}
              >
                open page two
              </button>
              <button
                type="button"
                onClick={() => {
                  router.navigate("/one");
                }}
              >
                open page one
              </button>
            </div>
          </OverlayPage>
          <OverlayPage id="test" path="/one">
            <div className="bg-blue-900 p-4">
              <p>ONE</p>
              <button
                type="button"
                onClick={() => {
                  router.navigate("/");
                }}
              >
                back home
              </button>
            </div>
          </OverlayPage>
          <OverlayPage id="test" path="/two">
            <div className="bg-blue-900 p-4">
              <p>TWO</p>
              <button
                type="button"
                onClick={() => {
                  router.navigate("/");
                }}
              >
                back home
              </button>
            </div>
          </OverlayPage>
        </Overlay>
      </div>
    </OverlayDisplay>
  );
}
