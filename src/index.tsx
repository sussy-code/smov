import React, { ReactNode, Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { conf } from "@/setup/config";

import App from "@/setup/App";
import "@/setup/i18n";
import "@/setup/index.css";
import "@/backend";
import { initializeChromecast } from "./setup/chromecast";
import { initializeStores } from "./utils/storage";

// initialize
const key =
  (window as any)?.__CONFIG__?.VITE_KEY ?? import.meta.env.VITE_KEY ?? null;
if (key) {
  (window as any).initMW(conf().BASE_PROXY_URL, key);
}
initializeChromecast();

// TODO video todos:
//  - chrome cast support
//  - bug: safari fullscreen will make video overlap player controls

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

const LazyLoadedApp = React.lazy(async () => {
  await initializeStores();
  return {
    default: App,
  };
});

function TheRouter(props: { children: ReactNode }) {
  const normalRouter = conf().NORMAL_ROUTER;

  if (normalRouter) return <BrowserRouter>{props.children}</BrowserRouter>;
  return <HashRouter>{props.children}</HashRouter>;
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <TheRouter>
        <Suspense fallback="">
          <LazyLoadedApp />
        </Suspense>
      </TheRouter>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
