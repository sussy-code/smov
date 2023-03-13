import { Redirect, Route, Switch } from "react-router-dom";
import { BookmarkContextProvider } from "@/state/bookmark";
import { WatchedContextProvider } from "@/state/watched";
import { SettingsProvider } from "@/state/settings";

import { NotFoundPage } from "@/views/notfound/NotFoundView";
import { MediaView } from "@/views/media/MediaView";
import { SearchView } from "@/views/search/SearchView";
import { MWMediaType } from "@/backend/metadata/types";
import { V2MigrationView } from "@/views/other/v2Migration";
import { DeveloperView } from "@/views/developer/DeveloperView";
import { VideoTesterView } from "@/views/developer/VideoTesterView";
import { ProviderTesterView } from "@/views/developer/ProviderTesterView";
import { EmbedTesterView } from "@/views/developer/EmbedTesterView";
import { SettingsView } from "@/views/settings/SettingsView";
import { BannerContextProvider } from "@/hooks/useBanner";
import { Layout } from "@/setup/Layout";
import { TestView } from "@/views/developer/TestView";

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
                <Route exact path="/settings" component={SettingsView} />

                {/* other */}
                <Route exact path="/dev" component={DeveloperView} />
                <Route exact path="/dev/test" component={TestView} />
                <Route exact path="/dev/video" component={VideoTesterView} />
                <Route
                  exact
                  path="/dev/providers"
                  component={ProviderTesterView}
                />
                <Route exact path="/dev/embeds" component={EmbedTesterView} />
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
