import './index.css';
import { SearchView } from './views/Search';
import { MovieView } from './views/Movie';
import { useMovie, MovieProvider} from './hooks/useMovie';

function Router() {
  const { streamData } = useMovie();
  if (streamData) return <MovieView />;
  else return <SearchView />;
}

function App() {
  return (
    <MovieProvider>
      <Router/>
    </MovieProvider>
  );
}

export default App;
