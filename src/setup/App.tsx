import { Redirect, Route, Switch } from "react-router-dom";
import { BookmarkContextProvider } from "@/state/bookmark";
import { WatchedContextProvider } from "@/state/watched";

import { NotFoundPage } from "@/views/notfound/NotFoundView";
import { MediaView } from "@/views/media/MediaView";
import { SearchView } from "@/views/search/SearchView";
import { MWMediaType } from "@/backend/metadata/types";
import { V2MigrationView } from "@/views/other/v2Migration";

function App() {
  return (
    <WatchedContextProvider>
      <BookmarkContextProvider>
        <Switch>
          <Route exact path="/v2-migration" component={V2MigrationView} />
          <Route exact path="/">
            <Redirect to={`/search/${MWMediaType.MOVIE}`} />
          </Route>
          <Route exact path="/media/:media" component={MediaView} />
          <Route
            exact
            path="/media/:media/:season/:episode"
            component={MediaView}
          />
          <Route exact path="/search/:type/:query?" component={SearchView} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </BookmarkContextProvider>
    </WatchedContextProvider>
  );
}

export default App;
