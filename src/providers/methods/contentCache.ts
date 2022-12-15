import { SimpleCache } from "@/utils/cache";
import { MWPortableMedia, MWMedia } from "@/providers";

// cache
const contentCache = new SimpleCache<MWPortableMedia, MWMedia>();
contentCache.setCompare(
  (a, b) => a.mediaId === b.mediaId && a.providerId === b.providerId
);
contentCache.initialize();

export default contentCache;
