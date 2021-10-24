import { SearchView } from './views/Search';
import { MovieView } from './views/Movie';
import { useMovie, MovieProvider } from './hooks/useMovie';
import './index.css';
import {store} from './lib/storage/watched.js'

function Router() {
  const { streamData } = useMovie();
  return streamData ? <MovieView /> : <SearchView />;
}

function App() {
  return (
    <MovieProvider>
      <div>
        <p>Testing</p>
        <button onClick={() => {
          const data = store.get();
          data.save();
        }}>Click me</button>
      </div>
      <Router />
    </MovieProvider>
  );
}

export default App;
