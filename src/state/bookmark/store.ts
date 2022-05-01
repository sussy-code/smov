import { versionedStoreBuilder } from 'utils/storage';

export const BookmarkStore = versionedStoreBuilder()
  .setKey('mw-bookmarks')
  .addVersion({
    version: 0,
    create() {
      return {
        bookmarks: []
      }
    }
  })
  .build()
