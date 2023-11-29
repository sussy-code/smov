import { ReactElement, lazy, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom";

import { convertLegacyUrl, isLegacyUrl } from "@/backend/metadata/getmeta";
import { generateQuickSearchMediaUrl } from "@/backend/metadata/tmdb";
import { useOnlineListener } from "@/hooks/usePing";
import { AboutPage } from "@/pages/About";
import { AdminPage } from "@/pages/admin/AdminPage";
import VideoTesterView from "@/pages/developer/VideoTesterView";
import { DmcaPage } from "@/pages/Dmca";
import { NotFoundPage } from "@/pages/errors/NotFoundPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/Login";
import { PlayerView } from "@/pages/PlayerView";
import { RegisterPage } from "@/pages/Register";
import { SettingsPage } from "@/pages/Settings";
import { Layout } from "@/setup/Layout";
import { useHistoryListener } from "@/stores/history";
import { useLanguageListener } from "@/stores/language";

function LegacyUrlView({ children }: { children: ReactElement }) {
  const location = useLocation();
  const { replace } = useHistory();

  useEffect(() => {
    const url = location.pathname;
    if (!isLegacyUrl(url)) return;
    convertLegacyUrl(location.pathname).then((convertedUrl) => {
      replace(convertedUrl ?? "/");
    });
  }, [location.pathname, replace]);

  if (isLegacyUrl(location.pathname)) return null;
  return children;
}

function QuickSearch() {
  const { query } = useParams<{ query: string }>();
  const { replace } = useHistory();

  useEffect(() => {
    if (query) {
      generateQuickSearchMediaUrl(query).then((url) => {
        replace(url ?? "/");
      });
    } else {
      replace("/");
    }
  }, [query, replace]);

  return null;
}

function App() {
  useHistoryListener();
  useOnlineListener();
  useLanguageListener();

  return (
    <Layout>
      <Switch>
        {/* functional routes */}
        <Route exact path="/s/:query">
          <QuickSearch />
        </Route>
        <Route exact path="/search/:type">
          <Redirect to="/browse" push={false} />
        </Route>
        <Route exact path="/search/:type/:query?">
          {({ match }) => {
            if (match?.params.query)
              return (
                <Redirect to={`/browse/${match?.params.query}`} push={false} />
              );
            return <Redirect to="/browse" push={false} />;
          }}
        </Route>

        {/* pages */}
        <Route exact path={["/media/:media", "/media/:media/:season/:episode"]}>
          <LegacyUrlView>
            <PlayerView />
          </LegacyUrlView>
        </Route>
        <Route exact path={["/browse/:query?", "/"]} component={HomePage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/faq" component={AboutPage} />
        <Route exact path="/dmca" component={DmcaPage} />

        {/* Settings page */}
        <Route exact path="/settings" component={SettingsPage} />

        {/* admin routes */}
        <Route exact path="/admin" component={AdminPage} />

        {/* other */}
        <Route
          exact
          path="/dev"
          component={lazy(() => import("@/pages/DeveloperPage"))}
        />
        <Route path="/dev/video">
          <VideoTesterView />
        </Route>
        {/* developer routes that can abuse workers are disabled in production */}
        {process.env.NODE_ENV === "development" ? (
          <Route
            path="/dev/test"
            component={lazy(() => import("@/pages/developer/TestView"))}
          />
        ) : null}
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </Layout>
  );
}

export default App;
