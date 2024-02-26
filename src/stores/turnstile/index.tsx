import classNames from "classnames";
import { useRef } from "react";
import Turnstile, { BoundTurnstileObject } from "react-turnstile";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { reportCaptchaSolve } from "@/backend/helpers/report";
import { conf } from "@/setup/config";

export interface TurnstileStore {
  isInWidget: boolean;
  turnstiles: {
    controls: BoundTurnstileObject;
    isInPopout: boolean;
    id: string;
  }[];
  cbs: ((token: string | null) => void)[];
  setTurnstile(
    id: string,
    v: BoundTurnstileObject | null,
    isInPopout: boolean,
  ): void;
  getToken(): Promise<string>;
  processToken(token: string | null, widgetId: string): void;
}

export const useTurnstileStore = create(
  immer<TurnstileStore>((set, get) => ({
    isInWidget: false,
    turnstiles: [],
    cbs: [],
    processToken(token, widgetId) {
      const cbs = get().cbs;
      const turnstile = get().turnstiles.find((v) => v.id === widgetId);
      if (turnstile?.id !== widgetId) return;
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
    setTurnstile(id, controls, isInPopout) {
      set((s) => {
        s.turnstiles = s.turnstiles.filter((v) => v.id !== id);
        if (controls) {
          s.turnstiles.push({
            controls,
            isInPopout,
            id,
          });
        }
      });
    },
  })),
);

export function getTurnstile() {
  const turnstiles = useTurnstileStore.getState().turnstiles;
  const inPopout = turnstiles.find((v) => v.isInPopout);
  if (inPopout) return inPopout;
  return turnstiles[0];
}

export function isTurnstileInitialized() {
  return !!getTurnstile();
}

export async function getTurnstileToken() {
  const turnstile = getTurnstile();
  try {
    // I hate turnstile
    (window as any).turnstile.execute(
      document.querySelector(`#${turnstile.id}`),
      {},
    );
    const token = await useTurnstileStore.getState().getToken();
    reportCaptchaSolve(true);
    return token;
  } catch (err) {
    reportCaptchaSolve(false);
    throw err;
  }
}

export function TurnstileProvider(props: {
  isInPopout?: boolean;
  onUpdateShow?: (show: boolean) => void;
}) {
  const siteKey = conf().TURNSTILE_KEY;
  const idRef = useRef<string | null>(null);
  const setTurnstile = useTurnstileStore((s) => s.setTurnstile);
  const processToken = useTurnstileStore((s) => s.processToken);
  if (!siteKey) return null;
  return (
    <div
      className={classNames({
        hidden: !props.isInPopout,
      })}
    >
      <Turnstile
        sitekey={siteKey}
        onLoad={(widgetId, bound) => {
          idRef.current = widgetId;
          setTurnstile(widgetId, bound, !!props.isInPopout);
        }}
        onError={() => {
          const id = idRef.current;
          if (!id) return;
          processToken(null, id);
        }}
        onVerify={(token) => {
          const id = idRef.current;
          if (!id) return;
          processToken(token, id);
          props.onUpdateShow?.(false);
        }}
        onBeforeInteractive={() => {
          props.onUpdateShow?.(true);
        }}
        refreshExpired="never"
        execution="render"
      />
    </div>
  );
}
