import { MWCaption } from "@/backend/helpers/streams";
import { DetailedMeta } from "@/backend/metadata/getmeta";

export interface Thumbnail {
  from: number;
  to: number;
  imgUrl: string;
}
export type VideoPlayerMeta = {
  meta: DetailedMeta;
  captions: MWCaption[];
  episode?: {
    episodeId: string;
    seasonId: string;
  };
  seasons?: {
    id: string;
    number: number;
    title: string;
    episodes?: { id: string; number: number; title: string }[];
  }[];
};
