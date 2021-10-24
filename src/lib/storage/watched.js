import { versionedStoreBuilder } from './base.js';

// TODO implement watched store
// TODO implement the store into the rest of the codebase
export const store = versionedStoreBuilder()
    .setKey('test-store')
    .addVersion({
        version: 0,
    })
    .addVersion({
        version: 1,
        migrate(d) {
            d.v1 = "v1"
            return d;
        },
    })
    .addVersion({
        version: 2,
        migrate(d) {
            d.v2 = "v2"
            return d;
        },
        create() {
            return {
                v2: "v2"
            }
        }
    })
    .build()
