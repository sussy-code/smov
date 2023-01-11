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
