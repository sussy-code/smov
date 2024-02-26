import { MWMediaMeta } from "@/backend/metadata/types/mw";

export interface StoreMediaItem {
  meta: MWMediaMeta;
  series?: {
    episodeId: string;
    seasonId: string;
    episode: number;
    season: number;
  };
}

export interface WatchedStoreItem {
  item: StoreMediaItem;
  progress: number;
  percentage: number;
  watchedAt: number;
}

export interface WatchedStoreData {
  items: WatchedStoreItem[];
}
