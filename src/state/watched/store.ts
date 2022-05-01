import { MWMediaType } from "providers";
import { versionedStoreBuilder } from "utils/storage";
import { WatchedStoreData } from "./context";

export const VideoProgressStore = versionedStoreBuilder()
  .setKey("video-progress")
  .addVersion({
    version: 0,
  })
  .addVersion({
    version: 1,
    migrate(data: any) {
      const output: WatchedStoreData = { items: [] };

      if (!data || data.constructor !== Object)
        return output;

      Object.keys(data).forEach((scraperId) => {
        if (scraperId === "--version") return;
        if (scraperId === "save") return;

        if (data[scraperId].movie && data[scraperId].movie.constructor === Object) {
          Object.keys(data[scraperId].movie).forEach((movieId) => {
            try {
              output.items.push({
                mediaId: movieId.includes("player.php") ? movieId.split("player.php%3Fimdb%3D")[1] : movieId,
                mediaType: MWMediaType.MOVIE,
                providerId: scraperId,
                title: data[scraperId].movie[movieId].full.meta.title,
                year: data[scraperId].movie[movieId].full.meta.year,
                progress: data[scraperId].movie[movieId].full.currentlyAt,
                percentage: Math.round((data[scraperId].movie[movieId].full.currentlyAt / data[scraperId].movie[movieId].full.totalDuration) * 100)
              });
            } catch (err) {
              console.error(`Failed to migrate movie: ${scraperId}/${movieId}`, data[scraperId].movie[movieId]);
            }
          });
        }

        if (data[scraperId].show && data[scraperId].show.constructor === Object) {
          Object.keys(data[scraperId].show).forEach((showId) => {
            if (data[scraperId].show[showId].constructor !== Object)
              return;
            Object.keys(data[scraperId].show[showId]).forEach((episodeId) => {
              try {
                output.items.push({
                  mediaId: showId,
                  mediaType: MWMediaType.SERIES,
                  providerId: scraperId,
                  title: data[scraperId].show[showId][episodeId].meta.title,
                  year: data[scraperId].show[showId][episodeId].meta.year,
                  percentage: Math.round((data[scraperId].show[showId][episodeId].currentlyAt / data[scraperId].show[showId][episodeId].totalDuration) * 100),
                  progress: data[scraperId].show[showId][episodeId].currentlyAt,
                  episodeId: data[scraperId].show[showId][episodeId].show.episode,
                  seasonId: data[scraperId].show[showId][episodeId].show.season,
                });
              } catch (err) {
                console.error(`Failed to migrate series: ${scraperId}/${showId}/${episodeId}`, data[scraperId].show[showId][episodeId]);
              }
            });
          });
        }
      });

      return output;
    },
    create() {
      return {
        items: [],
      };
    },
  })
  .build();
