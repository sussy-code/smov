import './index.css';
import { SearchView } from './views/Search';
import { NotFound } from './views/NotFound';
import { MovieView } from './views/Movie';
import { useMovie, MovieProvider} from './hooks/useMovie';

function Router() {
  const { page } = useMovie();

  if (page === "search") {
    return <SearchView/>
  }

  if (page === "movie") {
    return <MovieView/>
  }

  return (
    <NotFound/>
  )
}

function App() {
  return (
    <MovieProvider>
      <Router/>
    </MovieProvider>
  );
}

export default App;
