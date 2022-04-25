import { versionedStoreBuilder } from "utils/storage";

/*
version 0
{
    [{scraperid}]: {
        movie: {
            [{movie-id}]: {
                full: {
                    currentlyAt: number,
                    totalDuration: number,
                    updatedAt: number, // unix timestamp in ms
                    meta: FullMetaObject, // no idea whats in here
                }
            }
        },
        show: {
            [{show-id}]: {
                [{season}-{episode}]: {
                    currentlyAt: number,
                    totalDuration: number,
                    updatedAt: number, // unix timestamp in ms
                    show: {
                        episode: string,
                        season: string,
                    },
                    meta: FullMetaObject, // no idea whats in here
                }
            }
        }
    }
}
*/

/*
item = {
  mediaId: media.mediaId,
  mediaType: media.mediaType,
  providerId: media.providerId,
  title: media.title,
  year: media.year,
  percentage: 0,
  progress: 0,
  episodeId: media.episodeId,
  seasonId: media.seasonId,
};
*/

export const VideoProgressStore = versionedStoreBuilder()
  .setKey("video-progress")
  .addVersion({
    version: 0,
  })
  .addVersion({
    version: 1,
    migrate(data: any) {
      const output: any = { items: [] as any };

      Object.keys(data).forEach((scraperId) => {
        if (scraperId === "--version") return;
        if (scraperId === "save") return;

        if (data[scraperId].movie) {
          Object.keys(data[scraperId].movie).forEach((movieId) => {
            output.items.push({
              mediaId: movieId.includes("player.php") ? movieId.split("player.php%3Fimdb%3D")[1] : movieId,
              mediaType: "movie",
              providerId: scraperId,
              title: data[scraperId].movie[movieId].full.meta.title,
              year: data[scraperId].movie[movieId].full.meta.year,
              progress: data[scraperId].movie[movieId].full.currentlyAt,
              percentage: Math.round((data[scraperId].movie[movieId].full.currentlyAt / data[scraperId].movie[movieId].full.totalDuration) * 100)
            });
          });
        }

        if (data[scraperId].show) {
          Object.keys(data[scraperId].show).forEach((showId) => {
            Object.keys(data[scraperId].show[showId]).forEach((episodeId) => {
              output.items.push({
                mediaId: showId,
                mediaType: "series",
                providerId: scraperId,
                title: data[scraperId].show[showId][episodeId].meta.title,
                year: data[scraperId].show[showId][episodeId].meta.year,
                percentage: Math.round((data[scraperId].show[showId][episodeId].currentlyAt / data[scraperId].show[showId][episodeId].totalDuration) * 100),
                progress: data[scraperId].show[showId][episodeId].currentlyAt,
                episodeId: data[scraperId].show[showId][episodeId].show.episode,
                seasonId: data[scraperId].show[showId][episodeId].show.season,
              });
            });
          });
        }
      });

      console.log(output);
      return output;
    },
    create() {
      return {
        items: [],
      };
    },
  })
  .build();
