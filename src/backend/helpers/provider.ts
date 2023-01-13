import { DetailedMeta } from "../metadata/getmeta";
import { MWMediaType } from "../metadata/types";
import { MWEmbed } from "./embed";
import { MWStream } from "./streams";

export type MWProviderScrapeResult = {
  stream?: MWStream;
  embeds: MWEmbed[];
};

export type MWProviderContext = {
  progress(percentage: number): void;
  media: DetailedMeta;
};

export type MWProvider = {
  id: string;
  rank: number;
  disabled?: boolean;
  type: MWMediaType[];

  scrape(ctx: MWProviderContext): Promise<MWProviderScrapeResult>;
};
