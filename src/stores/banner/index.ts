import { useEffect } from "react";
import { useMeasure } from "react-use";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface BannerInstance {
  id: string;
  height: number;
}

interface BannerStore {
  banners: BannerInstance[];
  isOnline: boolean;
  isTurnstile: boolean;
  location: string | null;
  ignoredBannerIds: string[];
  updateHeight(id: string, height: number): void;
  showBanner(id: string): void;
  hideBanner(id: string, force?: boolean): void;
  setLocation(loc: string | null): void;
  updateOnline(isOnline: boolean): void;
  updateTurnstile(isTurnstile: boolean): void;
}

export const useBannerStore = create(
  immer<BannerStore>((set) => ({
    banners: [],
    isOnline: true,
    isTurnstile: false,
    location: null,
    ignoredBannerIds: [],
    updateOnline(isOnline) {
      set((s) => {
        s.isOnline = isOnline;
      });
    },
    updateTurnstile(isTurnstile) {
      set((s) => {
        s.isTurnstile = isTurnstile;
      });
    },
    setLocation(loc) {
      set((s) => {
        s.location = loc;
      });
    },
    showBanner(id) {
      set((s) => {
        if (s.banners.find((v) => v.id === id)) return;
        if (s.ignoredBannerIds.includes(id)) return;
        s.banners.push({
          id,
          height: 0,
        });
      });
    },
    hideBanner(id, force = false) {
      set((s) => {
        if (force) s.ignoredBannerIds.push(id);
        s.banners = s.banners.filter((v) => v.id !== id);
      });
    },
    updateHeight(id, height) {
      set((s) => {
        const found = s.banners.find((v) => v.id === id);
        if (found) found.height = height;
      });
    },
  })),
);

export function useBannerSize(location?: string) {
  const loc = location ?? null;
  const banners = useBannerStore((s) => s.banners);
  const currentLocation = useBannerStore((s) => s.location);

  const size = banners.reduce((a, v) => a + v.height, 0);
  if (loc !== currentLocation) return 0;
  return size;
}

export function useRegisterBanner<T extends Element>(id: string) {
  const [ref, { height }] = useMeasure<T>();
  const updateHeight = useBannerStore((s) => s.updateHeight);
  const showBanner = useBannerStore((s) => s.showBanner);
  const hideBanner = useBannerStore((s) => s.hideBanner);

  useEffect(() => {
    showBanner(id);
    return () => {
      hideBanner(id);
    };
  }, [showBanner, hideBanner, id]);

  useEffect(() => {
    updateHeight(id, height);
  }, [height, id, updateHeight]);

  return [ref];
}
