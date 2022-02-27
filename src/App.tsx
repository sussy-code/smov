import { MWMediaType } from "providers";
import { Redirect, Route, Switch } from "react-router-dom";
import { BookmarkContextProvider } from "state/bookmark";
import { WatchedContextProvider } from "state/watched";
import "./index.css";
import { MediaView } from "./views/MediaView";
import { SearchView } from "./views/SearchView";

function App() {
  return (
    <WatchedContextProvider>
      <BookmarkContextProvider>
        <Switch>
          <Route exact path="/">
            <Redirect to={`/${MWMediaType.MOVIE}`} />
          </Route>
          <Route exact path="/media/movie/:media" component={MediaView} />
          <Route exact path="/media/series/:media" component={MediaView} />
          <Route exact path="/:type/:query?" component={SearchView} />
        </Switch>
      </BookmarkContextProvider>
    </WatchedContextProvider>
  );
}

export default App;
