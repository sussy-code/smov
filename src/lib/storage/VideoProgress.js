import { versionedStoreBuilder } from './base.js';

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

// TODO implement the store into the rest of the codebase
export const VideoProgressStore = versionedStoreBuilder()
    .setKey('video-progress')
    .addVersion({
        version: 0,
        create() {
            return {}
        }
    })
    .build()
