import { Redirect, Route, Switch } from "react-router-dom";
import { MWMediaType } from "@/providers";
import { BookmarkContextProvider } from "@/state/bookmark";
import { WatchedContextProvider } from "@/state/watched";
import { NotFoundPage } from "@/views/notfound/NotFoundView";
import "./index.css";
import { MediaView } from "./views/MediaView";
import { SearchView } from "./views/SearchView";

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
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </BookmarkContextProvider>
    </WatchedContextProvider>
  );
}

export default App;
