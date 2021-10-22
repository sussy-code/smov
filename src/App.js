import { SearchView } from './views/Search';
import { MovieView } from './views/Movie';
import { useMovie, MovieProvider } from './hooks/useMovie';
import './index.css';

function Router() {
  const { streamData } = useMovie();
  return streamData ? <MovieView /> : <SearchView />;
}

function App() {
  return (
    <MovieProvider>
      <Router />
    </MovieProvider>
  );
}

export default App;
