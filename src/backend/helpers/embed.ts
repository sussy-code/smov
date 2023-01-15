import { MWStream } from "./streams";

export enum MWEmbedType {
  OPENLOAD = "openload",
}

export type MWEmbed = {
  type: MWEmbedType | null;
  url: string;
};

export type MWEmbedContext = {
  progress(percentage: number): void;
  url: string;
};

export type MWEmbedScraper = {
  id: string;
  displayName: string;
  for: MWEmbedType;
  rank: number;
  disabled?: boolean;

  getStream(ctx: MWEmbedContext): Promise<MWStream>;
};
