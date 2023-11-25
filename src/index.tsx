import "core-js/stable";
import "./stores/__old/imports";
import "@/setup/ga";
import "@/setup/index.css";

import React, { Suspense, useCallback } from "react";
import type { ReactNode } from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { useAsync } from "react-use";
import { registerSW } from "virtual:pwa-register";

import { Button } from "@/components/Button";
import { Icon, Icons } from "@/components/Icon";
import { Loading } from "@/components/layout/Loading";
import { useAuthRestore } from "@/hooks/auth/useAuthRestore";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { ErrorBoundary } from "@/pages/errors/ErrorBoundary";
import { MigrationPart } from "@/pages/parts/migrations/MigrationPart";
import { LargeTextPart } from "@/pages/parts/util/LargeTextPart";
import App from "@/setup/App";
import { conf } from "@/setup/config";
import i18n from "@/setup/i18n";
import { useAuthStore } from "@/stores/auth";
import { BookmarkSyncer } from "@/stores/bookmarks/BookmarkSyncer";
import { useLanguageStore } from "@/stores/language";
import { ProgressSyncer } from "@/stores/progress/ProgressSyncer";
import { SettingsSyncer } from "@/stores/subtitles/SettingsSyncer";
import { useThemeStore } from "@/stores/theme";

import { initializeChromecast } from "./setup/chromecast";
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
  return (
    <LargeTextPart iconSlot={<Loading />}>Loading {props.type}</LargeTextPart>
  );
}

function ErrorScreen(props: {
  children: ReactNode;
  showResetButton?: boolean;
}) {
  const setBackendUrl = useAuthStore((s) => s.setBackendUrl);
  const resetBackend = useCallback(() => {
    setBackendUrl(null);
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }, [setBackendUrl]);

  return (
    <LargeTextPart
      iconSlot={
        <Icon className="text-type-danger text-2xl" icon={Icons.WARNING} />
      }
    >
      {props.children}
      {props.showResetButton ? (
        <div className="mt-6">
          <Button theme="secondary" onClick={resetBackend}>
            Reset back-end
          </Button>
        </div>
      ) : null}
    </LargeTextPart>
  );
}

function AuthWrapper() {
  const status = useAuthRestore();
  const backendUrl = conf().BACKEND_URL;
  const userBackendUrl = useBackendUrl();

  if (status.loading) return <LoadingScreen type="user" />;
  if (status.error)
    return (
      <ErrorScreen showResetButton={backendUrl !== userBackendUrl}>
        {backendUrl !== userBackendUrl
          ? "Failed to fetch user data. Try resetting the backend URL"
          : "Failed to fetch user data."}
      </ErrorScreen>
    );
  return <App />;
}

function MigrationRunner() {
  const status = useAsync(async () => {
    i18n.changeLanguage(useLanguageStore.getState().language);
    await initializeOldStores();
  }, []);

  if (status.loading) return <MigrationPart />;
  if (status.error)
    return <ErrorScreen>Failed to migrate your data.</ErrorScreen>;
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
            <ProgressSyncer />
            <BookmarkSyncer />
            <SettingsSyncer />
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
