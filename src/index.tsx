import "core-js/stable";
import React, { Suspense } from "react";
import type { ReactNode } from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { useAsync } from "react-use";
import { registerSW } from "virtual:pwa-register";

import { useAuthRestore } from "@/hooks/auth/useAuthRestore";
import { ErrorBoundary } from "@/pages/errors/ErrorBoundary";
import { MigrationPart } from "@/pages/parts/migrations/MigrationPart";
import App from "@/setup/App";
import { conf } from "@/setup/config";
import i18n from "@/setup/i18n";
import "@/setup/ga";
import "@/setup/index.css";
import { useLanguageStore } from "@/stores/language";
import { useThemeStore } from "@/stores/theme";

import { initializeChromecast } from "./setup/chromecast";
import "./stores/__old/imports";
import { initializeOldStores } from "./stores/__old/migrations";

// initialize
const key =
  (window as any)?.__CONFIG__?.VITE_KEY ?? import.meta.env.VITE_KEY ?? null;
if (key) {
  (window as any).initMW(conf().PROXY_URLS, key);
}
initializeChromecast();
registerSW({
  immediate: true,
});

function LoadingScreen(props: { type: "user" | "lazy" }) {
  return <p>Loading: {props.type}</p>;
}

function AuthWrapper() {
  const status = useAuthRestore();

  // TODO what to do when failing to load user data?
  if (status.loading) return <LoadingScreen type="user" />;
  if (status.error) return <p>Failed to fetch user data</p>;
  return <App />;
}

function MigrationRunner() {
  const status = useAsync(async () => {
    i18n.changeLanguage(useLanguageStore.getState().language);
    await initializeOldStores();
  }, []);

  if (status.loading) return <MigrationPart />;
  if (status.error) return <p>Failed to migrate</p>;
  return <AuthWrapper />;
}

function TheRouter(props: { children: ReactNode }) {
  const normalRouter = conf().NORMAL_ROUTER;

  if (normalRouter) return <BrowserRouter>{props.children}</BrowserRouter>;
  return <HashRouter>{props.children}</HashRouter>;
}

function ThemeProvider(props: { children: ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const themeSelector = theme ? `theme-${theme}` : undefined;

  return <div className={themeSelector}>{props.children}</div>;
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <Suspense fallback={<LoadingScreen type="lazy" />}>
          <ThemeProvider>
            <TheRouter>
              <MigrationRunner />
            </TheRouter>
          </ThemeProvider>
        </Suspense>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
