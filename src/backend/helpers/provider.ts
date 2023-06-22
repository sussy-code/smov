import { MWEmbed } from "./embed";
import { MWStream } from "./streams";
import { DetailedMeta } from "../metadata/getmeta";
import { MWMediaType } from "../metadata/types/mw";

export type MWProviderScrapeResult = {
  stream?: MWStream;
  embeds: MWEmbed[];
};

type MWProviderBase = {
  progress(percentage: number): void;
  media: DetailedMeta;
};
type MWProviderTypeSpecific =
  | {
      type: MWMediaType.MOVIE | MWMediaType.ANIME;
      episode?: undefined;
      season?: undefined;
    }
  | {
      type: MWMediaType.SERIES;
      episode: string;
      season: string;
    };
export type MWProviderContext = MWProviderTypeSpecific & MWProviderBase;

export type MWProvider = {
  id: string;
  displayName: string;
  rank: number;
  disabled?: boolean;
  type: MWMediaType[];

  scrape(ctx: MWProviderContext): Promise<MWProviderScrapeResult>;
};
