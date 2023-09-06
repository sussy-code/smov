import { ReactElement, lazy, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom";

import { convertLegacyUrl, isLegacyUrl } from "@/backend/metadata/getmeta";
import { generateQuickSearchMediaUrl } from "@/backend/metadata/tmdb";
import { BannerContextProvider } from "@/hooks/useBanner";
import { AboutPage } from "@/pages/About";
import { DmcaPage } from "@/pages/Dmca";
import { NotFoundPage } from "@/pages/errors/NotFoundPage";
import { HomePage } from "@/pages/HomePage";
import { MediaView } from "@/pages/media/MediaView";
import { Layout } from "@/setup/Layout";
import { BookmarkContextProvider } from "@/state/bookmark";
import { SettingsProvider } from "@/state/settings";
import { WatchedContextProvider } from "@/state/watched";

function LegacyUrlView({ children }: { children: ReactElement }) {
  const location = useLocation();
  const { replace } = useHistory();

  useEffect(() => {
    const url = location.pathname;
    if (!isLegacyUrl(url)) return;
    convertLegacyUrl(location.pathname).then((convertedUrl) => {
      replace(convertedUrl ?? "/");
    });
  }, [location.pathname, replace]);

  if (isLegacyUrl(location.pathname)) return null;
  return children;
}

function QuickSearch() {
  const { query } = useParams<{ query: string }>();
  const { replace } = useHistory();

  useEffect(() => {
    if (query) {
      generateQuickSearchMediaUrl(query).then((url) => {
        replace(url ?? "/");
      });
    } else {
      replace("/");
    }
  }, [query, replace]);

  return null;
}

function App() {
  return (
    <SettingsProvider>
      <WatchedContextProvider>
        <BookmarkContextProvider>
          <BannerContextProvider>
            <Layout>
              <Switch>
                {/* functional routes */}
                <Route exact path="/s/:query">
                  <QuickSearch />
                </Route>

                {/* pages */}
                <Route exact path="/media/:media">
                  <LegacyUrlView>
                    <MediaView />
                  </LegacyUrlView>
                </Route>
                <Route exact path="/media/:media/:season/:episode">
                  <LegacyUrlView>
                    <MediaView />
                  </LegacyUrlView>
                </Route>
                <Route exact path="/search/:type/:query?">
                  <Redirect to="/browse/:query" />
                </Route>
                <Route exact path="/search/:type">
                  <Redirect to="/browse" />
                </Route>
                <Route
                  exact
                  path={["/browse/:query?", "/"]}
                  component={HomePage}
                />
                <Route exact path="/faq" component={AboutPage} />
                <Route exact path="/dmca" component={DmcaPage} />

                {/* other */}
                <Route
                  exact
                  path="/dev"
                  component={lazy(() => import("@/pages/DeveloperPage"))}
                />
                <Route
                  exact
                  path="/dev/video"
                  component={lazy(
                    () => import("@/pages/developer/VideoTesterView")
                  )}
                />
                {/* developer routes that can abuse workers are disabled in production */}
                {process.env.NODE_ENV === "development" ? (
                  <>
                    <Route
                      exact
                      path="/dev/test"
                      component={lazy(
                        () => import("@/pages/developer/TestView")
                      )}
                    />

                    <Route
                      exact
                      path="/dev/providers"
                      component={lazy(
                        () => import("@/pages/developer/ProviderTesterView")
                      )}
                    />
                    <Route
                      exact
                      path="/dev/embeds"
                      component={lazy(
                        () => import("@/pages/developer/EmbedTesterView")
                      )}
                    />
                  </>
                ) : null}
                <Route path="*" component={NotFoundPage} />
              </Switch>
            </Layout>
          </BannerContextProvider>
        </BookmarkContextProvider>
      </WatchedContextProvider>
    </SettingsProvider>
  );
}

export default App;
