import { ReactElement, lazy, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";

import { convertLegacyUrl, isLegacyUrl } from "@/backend/metadata/getmeta";
import { MWMediaType } from "@/backend/metadata/types/mw";
import { BannerContextProvider } from "@/hooks/useBanner";
import { Layout } from "@/setup/Layout";
import { BookmarkContextProvider } from "@/state/bookmark";
import { SettingsProvider } from "@/state/settings";
import { WatchedContextProvider } from "@/state/watched";
import { MediaView } from "@/views/media/MediaView";
import { NotFoundPage } from "@/views/notfound/NotFoundView";
import { V2MigrationView } from "@/views/other/v2Migration";
import { SearchView } from "@/views/search/SearchView";

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

function App() {
  return (
    <SettingsProvider>
      <WatchedContextProvider>
        <BookmarkContextProvider>
          <BannerContextProvider>
            <Layout>
              <Switch>
                {/* functional routes */}
                <Route exact path="/v2-migration" component={V2MigrationView} />
                <Route exact path="/">
                  <Redirect to={`/search/${MWMediaType.MOVIE}`} />
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
                <Route
                  exact
                  path="/search/:type/:query?"
                  component={SearchView}
                />

                {/* other */}
                <Route
                  exact
                  path="/dev"
                  component={lazy(
                    () => import("@/views/developer/DeveloperView")
                  )}
                />
                <Route
                  exact
                  path="/dev/video"
                  component={lazy(
                    () => import("@/views/developer/VideoTesterView")
                  )}
                />
                {/* developer routes that can abuse workers are disabled in production */}
                {process.env.NODE_ENV === "development" ? (
                  <>
                    <Route
                      exact
                      path="/dev/test"
                      component={lazy(
                        () => import("@/views/developer/TestView")
                      )}
                    />

                    <Route
                      exact
                      path="/dev/providers"
                      component={lazy(
                        () => import("@/views/developer/ProviderTesterView")
                      )}
                    />
                    <Route
                      exact
                      path="/dev/embeds"
                      component={lazy(
                        () => import("@/views/developer/EmbedTesterView")
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
