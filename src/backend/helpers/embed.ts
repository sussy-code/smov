import { MWEmbedStream } from "./streams";

export enum MWEmbedType {
  M4UFREE = "m4ufree",
  STREAMM4U = "streamm4u",
  PLAYM4U = "playm4u",
  UPCLOUD = "upcloud",
  STREAMSB = "streamsb",
  MP4UPLOAD = "mp4upload",
}

export type MWEmbed = {
  type: MWEmbedType;
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

  getStream(ctx: MWEmbedContext): Promise<MWEmbedStream>;
};
