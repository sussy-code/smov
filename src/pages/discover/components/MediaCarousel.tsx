import { MediaCard } from "@/components/media/MediaCard";
import { Media } from "@/pages/discover/common";

import { CarouselNavButtons } from "./CarouselNavButtons";

interface MediaCarouselProps {
  medias: Media[];
  category: string;
  isTVShow: boolean;
  isMobile: boolean;
  carouselRefs: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
}

export function MediaCarousel({
  medias,
  category,
  isTVShow,
  isMobile,
  carouselRefs,
}: MediaCarouselProps) {
  const categorySlug = `${category.toLowerCase().replace(/ /g, "-")}`;
  const browser = !!window.chrome;
  let isScrolling = false;

  const handleWheel = (e: React.WheelEvent) => {
    if (isScrolling) return;
    isScrolling = true;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (browser) {
      setTimeout(() => {
        isScrolling = false;
      }, 345);
    } else {
      isScrolling = false;
    }
  };

  function getDisplayCategory(
    categoryName: string,
    isTVShowCondition: boolean,
  ): string {
    switch (categoryName) {
      case "Now Playing":
        return "In Cinemas";
      case categoryName.match(/^Popular (Movies|Shows) on .+/)?.input:
        return categoryName;
      default:
        return categoryName.endsWith("Movie")
          ? `${categoryName}s`
          : isTVShowCondition
            ? `${categoryName} Shows`
            : `${categoryName} Movies`;
    }
  }

  const displayCategory = getDisplayCategory(category, isTVShow);

  return (
    <>
      <h2 className="ml-2 md:ml-8 mt-2 text-2xl cursor-default font-bold text-white md:text-2xl mx-auto pl-5 text-balance z-[99]">
        {displayCategory}
      </h2>
      <div className="relative overflow-hidden carousel-container">
        <div
          id={`carousel-${categorySlug}`}
          className="flex whitespace-nowrap pt-0 pb-4 overflow-auto scrollbar rounded-xl overflow-y-hidden"
          ref={(el) => {
            carouselRefs.current[categorySlug] = el;
          }}
          onWheel={handleWheel}
        >
          {medias
            .filter(
              (media, index, self) =>
                index ===
                self.findIndex(
                  (m) => m.id === media.id && m.title === media.title,
                ),
            )
            .slice(0, 25)
            .map((media, index, array) => (
              <div
                onContextMenu={(e: React.MouseEvent<HTMLDivElement>) =>
                  e.preventDefault()
                }
                key={media.id}
                className={`relative mt-4 group cursor-pointer user-select-none rounded-xl p-2 bg-background-main transition-colors duration-300 bg-transparent min-w-[200px] max-w-[200px] max-h-[500px] ${
                  index === 0
                    ? "ml-6 md:ml-[6.5rem] mr-[0.2em] md:mr-[0.5em]"
                    : index === array.length - 1
                      ? "mr-6 md:mr-[6.5rem] ml-[0.2em] md:ml-[0.5em]"
                      : "mx-2 md:mx-3"
                }`}
              >
                <MediaCard
                  linkable
                  key={media.id}
                  media={{
                    id: media.id.toString(),
                    title: media.title || media.name || "",
                    poster: `https://image.tmdb.org/t/p/w342${media.poster_path}`,
                    type: isTVShow ? "show" : "movie",
                    year: isTVShow
                      ? media.first_air_date
                        ? parseInt(media.first_air_date.split("-")[0], 10)
                        : undefined
                      : media.release_date
                        ? parseInt(media.release_date.split("-")[0], 10)
                        : undefined,
                  }}
                />
              </div>
            ))}
        </div>

        {!isMobile && (
          <CarouselNavButtons
            categorySlug={categorySlug}
            carouselRefs={carouselRefs}
          />
        )}
      </div>
    </>
  );
}
