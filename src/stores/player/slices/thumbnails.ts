import { MakeSlice } from "@/stores/player/slices/types";

export interface ThumbnailImage {
  at: number;
  data: string;
}

export interface ThumbnailSlice {
  thumbnails: {
    images: ThumbnailImage[];
    addImage(img: ThumbnailImage): void;
    resetImages(): void;
  };
}

export interface ThumbnailImagePosition {
  index: number;
  image: ThumbnailImage;
}

/**
 * get nearest image at the timestamp provided
 * @param images images, must be sorted
 */
export function nearestImageAt(
  images: ThumbnailImage[],
  at: number,
): ThumbnailImagePosition | null {
  // no images, early return
  if (images.length === 0) return null;

  const indexPastTimestamp = images.findIndex((v) => v.at > at);

  // no image found past timestamp, so last image must be closest
  if (indexPastTimestamp === -1)
    return {
      index: images.length - 1,
      image: images[images.length - 1],
    };

  const imagePastTimestamp = images[indexPastTimestamp];

  // if past timestamp is first image, just return that image
  if (indexPastTimestamp === 0)
    return {
      index: indexPastTimestamp,
      image: imagePastTimestamp,
    };

  //             distance before             distance past
  //                    |                          |
  //  [before] --------------------- [at] --------------------- [past]
  const imageBeforeTimestamp = images[indexPastTimestamp - 1];
  const distanceBefore = at - imageBeforeTimestamp.at;
  const distancePast = imagePastTimestamp.at - at;

  // if distance of before timestamp is smaller than the distance past
  // before is closer, return that
  //  [before] --X-------------- [past]
  if (distanceBefore < distancePast)
    return {
      index: indexPastTimestamp - 1,
      image: imageBeforeTimestamp,
    };

  // must be closer to past here, return past
  //  [before] --------------X-- [past]
  return {
    index: indexPastTimestamp,
    image: imagePastTimestamp,
  };
}

export const createThumbnailSlice: MakeSlice<ThumbnailSlice> = (set, get) => ({
  thumbnails: {
    images: [],
    resetImages() {
      set((s) => {
        s.thumbnails.images = [];
      });
    },
    addImage(img) {
      const store = get();
      const exactOrPastImageIndex = store.thumbnails.images.findIndex(
        (v) => v.at >= img.at,
      );

      // not found past or exact, so just append to the end
      if (exactOrPastImageIndex === -1) {
        set((s) => {
          s.thumbnails.images.push(img);
          s.thumbnails.images = [...s.thumbnails.images];
        });
        return;
      }

      const exactOrPastImage = store.thumbnails.images[exactOrPastImageIndex];

      // found exact, replace data
      if (exactOrPastImage.at === img.at) {
        set((s) => {
          s.thumbnails.images[exactOrPastImageIndex] = img;
          s.thumbnails.images = [...s.thumbnails.images];
        });
        return;
      }

      // found one past, insert right before it
      set((s) => {
        s.thumbnails.images.splice(exactOrPastImageIndex, 0, img);
        s.thumbnails.images = [...s.thumbnails.images];
      });
    },
  },
});
