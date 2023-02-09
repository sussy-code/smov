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
//  - chrome cast support
//  - bug: unmounting player throws errors in console
//  - bug: safari fullscreen will make video overlap player controls
//  - improvement: make scrapers use fuzzy matching on normalized titles
//  - bug: source selection doesnt work with HLS
//  - bug: .ass subtitle files are fucked
//  - improvement: episode watch at the ending should not startAt

// TODO stuff to test:
//  - browser: firefox, chrome, edge, safari desktop
//  - phones: android firefox, android chrome, iphone safari
//  - devices: ipadOS
//  - HLS
//  - HLS error handling
//  - video player error handling

// TODO backend system:
//  - implement jons providers/embedscrapers
//  - AFTER all that: rank providers/embedscrapers

// TODO general todos:
//  - localize everything (fix loading screen text (series vs movies))

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
