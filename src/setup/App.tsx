import { Redirect, Route, Switch } from "react-router-dom";
import { BookmarkContextProvider } from "@/state/bookmark";
import { WatchedContextProvider } from "@/state/watched";

import { NotFoundPage } from "@/views/notfound/NotFoundView";
import { MediaView } from "@/views/media/MediaView";
import { SearchView } from "@/views/search/SearchView";
import { MWMediaType } from "@/backend/metadata/types";
import { V2MigrationView } from "@/views/other/v2Migration";
import { DeveloperView } from "@/views/developer/DeveloperView";
import { VideoTesterView } from "@/views/developer/VideoTesterView";
import { ProviderTesterView } from "@/views/developer/ProviderTesterView";
import { EmbedTesterView } from "@/views/developer/EmbedTesterView";

// TODO add "you are offline" status bar

function App() {
  return (
    <WatchedContextProvider>
      <BookmarkContextProvider>
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
          <Route exact path="/search/:type/:query?" component={SearchView} />

          {/* other */}
          <Route exact path="/dev" component={DeveloperView} />
          <Route exact path="/dev/video" component={VideoTesterView} />
          <Route exact path="/dev/providers" component={ProviderTesterView} />
          <Route exact path="/dev/embeds" component={EmbedTesterView} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </BookmarkContextProvider>
    </WatchedContextProvider>
  );
}

export default App;
