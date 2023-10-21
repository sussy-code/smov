import { useEffect, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface HistoryRoute {
  path: string;
}

interface HistoryStore {
  routes: HistoryRoute[];
  registerRoute(route: HistoryRoute): void;
}

export const useHistoryStore = create(
  immer<HistoryStore>((set) => ({
    routes: [],
    registerRoute(route) {
      set((s) => {
        s.routes.push(route);
      });
    },
  }))
);

export function useHistoryListener() {
  const history = useHistory();
  const loc = useLocation();
  const registerRoute = useHistoryStore((s) => s.registerRoute);
  useEffect(
    () =>
      history.listen((a) => {
        registerRoute({ path: a.pathname });
      }),
    [history, registerRoute]
  );

  useEffectOnce(() => {
    registerRoute({ path: loc.pathname });
  });
}

export function useLastNonPlayerLink() {
  const routes = useHistoryStore((s) => s.routes);
  const lastNonPlayerLink = useMemo(() => {
    const reversedRoutes = [...routes];
    reversedRoutes.reverse();
    const route = reversedRoutes.find((v) => !v.path.startsWith("/media"));
    return route?.path ?? "/";
  }, [routes]);
  return lastNonPlayerLink;
}
