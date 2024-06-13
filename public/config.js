window.__CONFIG__ = {
  // The URL for the CORS proxy, the URL must NOT end with a slash!
  // If not specified, the onboarding will not allow a "default setup". The user will have to use the extension or set up a proxy themselves
  VITE_CORS_PROXY_URL: "main--vocal-tartufo-ce8d0f.netlify.app",

  // The READ API key to access TMDB
  VITE_TMDB_READ_API_KEY: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmU4ZTg0NjcxNTZmZjcyNjliMDI5OWU4MGFlMjllNyIsInN1YiI6IjY2NTllOTc5Yzk0MGNmYzVjZDc1MjE2NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gOvLr1inXXHrTUsPeHROCHfqiPY1qZBBKNJDgeO7x1w",

  // The DMCA email displayed in the footer, null to hide the DMCA link
  VITE_DMCA_EMAIL: null,

  // Whether to disable hash-based routing, leave this as false if you don't know what this is
  VITE_NORMAL_ROUTER: true,

  // The backend URL to communicate with
  VITE_BACKEND_URL: "https://backend.watch.purplelight.me",

  // A comma separated list of disallowed IDs in the case of a DMCA claim - in the format "series-<id>" and "movie-<id>"
  VITE_DISALLOWED_IDS: "",

  VITE_ALLOW_AUTOPLAY: true,

  VITE_TURNSTILE_KEY: "",
};
