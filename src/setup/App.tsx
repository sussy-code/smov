import { lazy, useEffect, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import { convertLegacyUrl } from "@/backend/metadata/getmeta";
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

// eslint-disable-next-line react/function-component-definition, react/prop-types
const LegacyUrlView: React.FC = ({ children }) => {
  const location = useLocation();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    // Call the conversion function and set the redirect URL if necessary
    convertLegacyUrl(location.pathname).then((convertedUrl) => {
      if (convertedUrl) {
        setRedirectUrl(convertedUrl);
      }
    });
  }, [location.pathname]);

  if (redirectUrl) {
    return <Redirect to={redirectUrl} />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

function App() {
  return (
    <SettingsProvider>
      <WatchedContextProvider>
        <BookmarkContextProvider>
          <BannerContextProvider>
            <Layout>
              <LegacyUrlView>
                <Switch>
                  {/* functional routes */}
                  <Route
                    exact
                    path="/v2-migration"
                    component={V2MigrationView}
                  />
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
              </LegacyUrlView>
            </Layout>
          </BannerContextProvider>
        </BookmarkContextProvider>
      </WatchedContextProvider>
    </SettingsProvider>
  );
}

export default App;
