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
  updateHeight(id: string, height: number): void;
  showBanner(id: string): void;
  hideBanner(id: string): void;
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
        s.banners.push({
          id,
          height: 0,
        });
      });
    },
    hideBanner(id) {
      set((s) => {
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
