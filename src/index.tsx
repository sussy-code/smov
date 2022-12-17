import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import "./index.css";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import App from "./App";
import './i18n';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <Suspense fallback="">
          <App />
        </Suspense>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
