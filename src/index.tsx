import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { conf } from "@/setup/config";

import App from "@/setup/App";
import "@/setup/i18n";
import "@/setup/index.css";
import "@/backend";

// initialize
const key =
  (window as any)?.__CONFIG__?.VITE_KEY ?? import.meta.env.VITE_KEY ?? null;
if (key) {
  (window as any).initMW(conf().BASE_PROXY_URL, key);
}

// TODO video todos:
//  - captions
//  - mobile UI
//  - season/episode select
//  - chrome cast support
//  - airplay support
//  - source selection
//  - safari fullscreen will make video overlap player controls
//  - safari progress bar is fucked (video doesnt change time but video.currentTime does change)

// TODO stuff to test:
//  - browser: firefox, chrome, edge, safari desktop
//  - phones: android firefox, android chrome, iphone safari
//  - devices: ipadOS
//  - HLS
//  - HLS error handling
//  - video player error handling

// TODO backend system:
//  - caption support
//  - move over old providers to new system
//  - implement jons providers/embedscrapers
//  - AFTER all that: rank providers/embedscrapers

// TODO general todos:
//  - localize everything

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <Suspense fallback="">
          <App />
        </Suspense>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
