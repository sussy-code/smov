import { SearchBarInput } from "components/SearchBar";
import { useSearchQuery } from "hooks/useSearchQuery";
import { MWMediaType } from "providers";
import { Redirect, Route, Switch } from "react-router-dom";
import { BookmarkContextProvider } from "state/bookmark";
import { WatchedContextProvider } from "state/watched";
import { NotFoundPage } from "views/notfound/NotFoundView";
import "./index.css";
import { MediaView } from "./views/MediaView";
import { SearchView } from "./views/SearchView";

function TestInput() {
  const [q1, c1, b1] = useSearchQuery();
  return (
    <div>
      <p>Normal:</p>
      <SearchBarInput onChange={c1} value={q1} onUnFocus={b1} />
    </div>
  );
}

function App() {
  return (
    <WatchedContextProvider>
      <BookmarkContextProvider>
        <Switch>
          <Route exact path="/">
            <Redirect to={`/search/${MWMediaType.MOVIE}`} />
          </Route>
          <Route exact path="/media/movie/:media" component={MediaView} />
          <Route exact path="/media/series/:media" component={MediaView} />
          <Route exact path="/search/:type/:query?" component={SearchView} />
          <Route exact path="/test/:type/:query?">
            <TestInput />
          </Route>
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </BookmarkContextProvider>
    </WatchedContextProvider>
  );
}

export default App;
