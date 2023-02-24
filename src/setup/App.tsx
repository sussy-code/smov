import { Redirect, Route, Switch } from "react-router-dom";
import { useRegisterSW } from "virtual:pwa-register/react";
import { BookmarkContextProvider } from "@/state/bookmark";
import { WatchedContextProvider } from "@/state/watched";

import { NotFoundPage } from "@/views/notfound/NotFoundView";
import { MediaView } from "@/views/media/MediaView";
import { SearchView } from "@/views/search/SearchView";
import { MWMediaType } from "@/backend/metadata/types";
import { V2MigrationView } from "@/views/other/v2Migration";
import { DeveloperView } from "@/views/developer/DeveloperView";
import { VideoTesterView } from "@/views/developer/VideoTesterView";
import { ProviderTesterView } from "@/views/developer/ProviderTesterView";
import { EmbedTesterView } from "@/views/developer/EmbedTesterView";

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className="ReloadPrompt-container">
      {(offlineReady || needRefresh) && (
        <div className="ReloadPrompt-toast">
          <div className="ReloadPrompt-message">
            {offlineReady ? (
              <span>App ready to work offline</span>
            ) : (
              <span>
                New content available, click on reload button to update.
              </span>
            )}
          </div>
          {needRefresh && (
            <button
              type="button"
              className="ReloadPrompt-toast-button"
              onClick={() => updateServiceWorker(true)}
            >
              Reload
            </button>
          )}
          <button
            type="button"
            className="ReloadPrompt-toast-button"
            onClick={() => close()}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <WatchedContextProvider>
      <BookmarkContextProvider>
        <ReloadPrompt />
        <Switch>
          {/* functional routes */}
          <Route exact path="/v2-migration" component={V2MigrationView} />
          <Route exact path="/">
            <Redirect to={`/search/${MWMediaType.MOVIE}`} />
          </Route>

          {/* pages */}
          <Route exact path="/media/:media" component={MediaView} />
          <Route
            exact
            path="/media/:media/:season/:episode"
            component={MediaView}
          />
          <Route exact path="/search/:type/:query?" component={SearchView} />

          {/* other */}
          <Route exact path="/dev" component={DeveloperView} />
          <Route exact path="/dev/video" component={VideoTesterView} />
          <Route exact path="/dev/providers" component={ProviderTesterView} />
          <Route exact path="/dev/embeds" component={EmbedTesterView} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </BookmarkContextProvider>
    </WatchedContextProvider>
  );
}

export default App;
