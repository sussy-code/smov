import { Route, Switch } from "react-router-dom";
import { WatchedContextProvider } from "state/watched/context";
import "./index.css";
import { MovieView } from "./views/MovieView";
import { SearchView } from "./views/SearchView";
import { SeriesView } from "./views/SeriesView";

function App() {
  return (
    <WatchedContextProvider>
      <Switch>
        <Route exact path="/" component={SearchView} />
        <Route exact path="/media/movie/:media" component={MovieView} />
        <Route exact path="/media/series/:media" component={SeriesView} />
      </Switch>
    </WatchedContextProvider>
  );
}

export default App;
