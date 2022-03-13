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

export const VideoProgressStore = versionedStoreBuilder()
  .setKey("video-progress")
  .addVersion({
    version: 0,
  })
  .addVersion({
    version: 1,
    migrate(data: any) {
      // TODO migration
    },
    create() {
      return {
        items: [],
      };
    },
  })
  .build();
