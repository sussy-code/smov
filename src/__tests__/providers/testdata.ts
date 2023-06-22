import { DetailedMeta } from "@/backend/metadata/getmeta";
import { MWMediaType } from "@/backend/metadata/types/mw";

export const testData: DetailedMeta[] = [
  {
    imdbId: "tt10954562",
    tmdbId: "572716",
    meta: {
      id: "439596",
      title: "Hamilton",
      type: MWMediaType.MOVIE,
      year: "2020",
      seasons: undefined,
    },
  },
  {
    imdbId: "tt11126994",
    tmdbId: "94605",
    meta: {
      id: "222333",
      title: "Arcane",
      type: MWMediaType.SERIES,
      year: "2021",
      seasons: [
        {
          id: "230301",
          number: 1,
          title: "Season 1",
        },
      ],
      seasonData: {
        id: "230301",
        number: 1,
        title: "Season 1",
        episodes: [
          {
            id: "4243445",
            number: 1,
            title: "Welcome to the Playground",
          },
        ],
      },
    },
  },
];
