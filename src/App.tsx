import { GetProviderFromId, SearchProviders, MWMedia, MWMediaType } from '@/scrapers';
import { useState } from 'react';
import './index.css';

function App() {
  const [results, setResults] = useState<MWMedia[]>([]);

  async function runSearch() {
    const results = await SearchProviders({ type: MWMediaType.MOVIE, searchQuery: "abc" });
    setResults(results);
  }

  return (
    <>
      <h1>Search</h1>
      <button onClick={() => runSearch()}>Search</button>
      <h1>Search results</h1>
      {results.map(v=>(
        <p>{v.title} ({GetProviderFromId(v.providerId)?.displayName})</p>
      ))}
    </>
  );
}

export default App;
