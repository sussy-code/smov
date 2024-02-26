import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface OverlayTransition {
  from: string;
  to: string;
}

export interface OverlayRoute {
  id: string;
  height: number;
  width: number;
}

export interface ActiveAnchorPoint {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface OverlayStore {
  transition: null | OverlayTransition;
  routes: Record<string, OverlayRoute>;
  anchorPoint: ActiveAnchorPoint | null;
  setTransition(newTrans: OverlayTransition | null): void;
  registerRoute(route: OverlayRoute): void;
  setAnchorPoint(point: ActiveAnchorPoint | null): void;
}

export const useOverlayStore = create(
  immer<OverlayStore>((set) => ({
    transition: null,
    routes: {},
    anchorPoint: null,
    setTransition(newTrans) {
      set((s) => {
        s.transition = newTrans;
      });
    },
    registerRoute(route) {
      set((s) => {
        s.routes[route.id] = route;
      });
    },
    setAnchorPoint(point) {
      set((s) => {
        s.anchorPoint = point;
      });
    },
  })),
);
