import Turnstile, { BoundTurnstileObject } from "react-turnstile";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { reportCaptchaSolve } from "@/backend/helpers/report";
import { conf } from "@/setup/config";

export interface TurnstileStore {
  turnstile: BoundTurnstileObject | null;
  cbs: ((token: string | null) => void)[];
  setTurnstile(v: BoundTurnstileObject | null): void;
  getToken(): Promise<string>;
  processToken(token: string | null): void;
}

export const useTurnstileStore = create(
  immer<TurnstileStore>((set, get) => ({
    turnstile: null,
    cbs: [],
    processToken(token) {
      const cbs = get().cbs;
      cbs.forEach((fn) => fn(token));
      set((s) => {
        s.cbs = [];
      });
    },
    getToken() {
      return new Promise((resolve, reject) => {
        set((s) => {
          s.cbs = [
            ...s.cbs,
            (token) => {
              if (!token) reject(new Error("Failed to get token"));
              else resolve(token);
            },
          ];
        });
      });
    },
    setTurnstile(v) {
      set((s) => {
        s.turnstile = v;
      });
    },
  })),
);

export function getTurnstile() {
  return useTurnstileStore.getState().turnstile;
}

export function isTurnstileInitialized() {
  return !!getTurnstile();
}

export async function getTurnstileToken() {
  const turnstile = getTurnstile();
  turnstile?.reset();
  turnstile?.execute();
  try {
    const token = await useTurnstileStore.getState().getToken();
    reportCaptchaSolve(true);
    return token;
  } catch (err) {
    reportCaptchaSolve(false);
    throw err;
  }
}

export function TurnstileProvider() {
  const siteKey = conf().TURNSTILE_KEY;
  const setTurnstile = useTurnstileStore((s) => s.setTurnstile);
  const processToken = useTurnstileStore((s) => s.processToken);
  if (!siteKey) return null;
  return (
    <Turnstile
      sitekey={siteKey}
      onLoad={(_widgetId, bound) => {
        setTurnstile(bound);
      }}
      onError={() => {
        processToken(null);
      }}
      onVerify={(token) => {
        processToken(token);
      }}
    />
  );
}
