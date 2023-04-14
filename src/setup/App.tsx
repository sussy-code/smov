import { lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { BookmarkContextProvider } from "@/state/bookmark";
import { WatchedContextProvider } from "@/state/watched";
import { SettingsProvider } from "@/state/settings";

import { NotFoundPage } from "@/views/notfound/NotFoundView";
import { MediaView } from "@/views/media/MediaView";
import { SearchView } from "@/views/search/SearchView";
import { MWMediaType } from "@/backend/metadata/types";
import { V2MigrationView } from "@/views/other/v2Migration";
import { BannerContextProvider } from "@/hooks/useBanner";
import { Layout } from "@/setup/Layout";

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
                <Route exact path="/media/:media" component={MediaView} />
                <Route
                  exact
                  path="/media/:media/:season/:episode"
                  component={MediaView}
                />
                <Route
                  exact
                  path="/search/:type/:query?"
                  component={SearchView}
                />

                {/* other */}
                {process.env.NODE_ENV === "development" ? (
                  <>
                    <Route
                      exact
                      path="/dev"
                      component={lazy(
                        () => import("@/views/developer/DeveloperView")
                      )}
                    />
                    <Route
                      exact
                      path="/dev/test"
                      component={lazy(
                        () => import("@/views/developer/TestView")
                      )}
                    />
                    <Route
                      exact
                      path="/dev/video"
                      component={lazy(
                        () => import("@/views/developer/VideoTesterView")
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
