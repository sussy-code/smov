import { Route, Switch } from 'react-router-dom';
import './index.css';
import { MovieView } from './views/MovieView';
import { SearchView } from './views/SearchView';
import { SeriesView } from './views/SeriesView';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={SearchView} />
      <Route exact path="/media/movie" component={MovieView} />
      <Route exact path="/media/series" component={SeriesView} />
    </Switch>
  );
}

export default App;
