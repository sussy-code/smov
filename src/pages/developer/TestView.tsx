import { useEffect, useRef } from "react";

import { OverlayAnchor } from "@/components/overlays/OverlayAnchor";
import { Overlay, OverlayDisplay } from "@/components/overlays/OverlayDisplay";
import { OverlayPage } from "@/components/overlays/OverlayPage";
import { OverlayRouter } from "@/components/overlays/OverlayRouter";
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
        <OverlayAnchor id={router.id}>
          <div className="h-20 w-20 hover:w-24 mt-[50rem] bg-white" />
        </OverlayAnchor>
        <Overlay id={router.id}>
          <OverlayRouter id={router.id}>
            <OverlayPage id={router.id} path="/" width={400} height={400}>
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
            <OverlayPage id={router.id} path="/one" width={300} height={300}>
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
            <OverlayPage id={router.id} path="/two" width={200} height={200}>
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
          </OverlayRouter>
        </Overlay>
      </div>
    </OverlayDisplay>
  );
}
