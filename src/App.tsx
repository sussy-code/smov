import { MWMediaType } from "providers";
import { Redirect, Route, Switch } from "react-router-dom";
import { WatchedContextProvider } from "state/watched/context";
import "./index.css";
import { MovieView } from "./views/MovieView";
import { SearchView } from "./views/SearchView";
import { SeriesView } from "./views/SeriesView";

function App() {
  return (
    <WatchedContextProvider>
      <Switch>
        <Route exact path="/">
          <Redirect to={`/${MWMediaType.MOVIE}`} />
        </Route>
        <Route exact path="/media/movie/:media" component={MovieView} />
        <Route exact path="/media/series/:media" component={SeriesView} />
        <Route exact path="/:type/:query?" component={SearchView} />
      </Switch>
    </WatchedContextProvider>
  );
}

export default App;
