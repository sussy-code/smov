import { versionedStoreBuilder } from './base.js';

export const store = versionedStoreBuilder()
    .setKey('test-store')
    .addVersion(0, (d) => {
        d.v0 = "v0";
    }, () => ({ v0: "v0" }))
    .addVersion(1, (d) => {
        d.v1 = "v1";
    }, () => ({ v1: "v1" }))
    .addVersion(2, (d) => {
        d.v2 = "v2";
    }, () => ({ v2: "v2" }))
    .build()
