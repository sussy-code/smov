window.__CONFIG__ = {
  // The URL for the CORS proxy, the URL must NOT end with a slash!
  // If not specified, the onboarding will not allow a "default setup". The user will have to use the extension or set up a proxy themselves
  VITE_CORS_PROXY_URL: "https://bare-kessia-fmeee-fc3d6526.koyeb.app,https://glowing-puppy-71e225.netlify.app,https://ver1.fmeee.ovh",

  // The READ API key to access TMDB
  VITE_TMDB_READ_API_KEY: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTFiMGE2NjEyMTlhY2QxODVhZTY0ZGQ2MGI4ZTU1ZiIsInN1YiI6IjY1YjNmY2U0MGVkMmFiMDE2Mzg2N2JhOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.z434agsWfhKJSIuvHsV9zfFyswty8tvVdN08Ou_7MG0",

  // The DMCA email displayed in the footer, null to hide the DMCA link
  VITE_DMCA_EMAIL: "fmeee-dmca@mail.ru",

  // Whether to disable hash-based routing, leave this as false if you don't know what this is
  VITE_NORMAL_ROUTER: false,

  // The backend URL to communicate with
  VITE_BACKEND_URL: "https://backend.undi.rest/",

  // A comma separated list of disallowed IDs in the case of a DMCA claim - in the format "series-<id>" and "movie-<id>"
  VITE_DISALLOWED_IDS: ""
};
