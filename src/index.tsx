import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { conf } from "@/setup/config";

import App from "@/setup/App";
import "@/setup/i18n";
import "@/setup/index.css";
import "@/backend";
import { initializeChromecast } from "./setup/chromecast";

// initialize
const key =
  (window as any)?.__CONFIG__?.VITE_KEY ?? import.meta.env.VITE_KEY ?? null;
if (key) {
  (window as any).initMW(conf().BASE_PROXY_URL, key);
}
initializeChromecast();

// TODO video todos:
//  - captions
//  - chrome cast support
//  - bug: mobile controls start showing when resizing
//  - bug: popouts sometimes stop working when selecting different episode
//  - bug: unmounting player throws errors in console
//  - bug: safari fullscreen will make video overlap player controls
//  - bug: safari progress bar is fucked (video doesnt change time but video.currentTime does change)

// TODO stuff to test:
//  - browser: firefox, chrome, edge, safari desktop
//  - phones: android firefox, android chrome, iphone safari
//  - devices: ipadOS
//  - HLS
//  - HLS error handling
//  - video player error handling

// TODO backend system:
//  - caption support
//  - implement jons providers/embedscrapers
//  - AFTER all that: rank providers/embedscrapers

// TODO general todos:
//  - localize everything (fix loading screen text (series vs movies)) (and have EN file instead of en-gb)

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
