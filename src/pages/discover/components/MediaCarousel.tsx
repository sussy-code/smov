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

  const filteredMedias = medias
    .filter(
      (media, index, self) =>
        index ===
        self.findIndex((m) => m.id === media.id && m.title === media.title),
    )
    .slice(0, 20);

  return (
    <>
      <h2 className="ml-2 md:ml-8 mt-2 text-2xl cursor-default font-bold text-white md:text-2xl mx-auto pl-5 text-balance">
        {displayCategory}
      </h2>
      <div className="relative overflow-hidden carousel-container">
        <div
          id={`carousel-${categorySlug}`}
          className="grid grid-flow-col auto-cols-max gap-4 pt-0 pb-4 overflow-auto scrollbar rounded-xl overflow-y-hidden md:pl-8 md:pr-8"
          ref={(el) => {
            carouselRefs.current[categorySlug] = el;
          }}
          onWheel={handleWheel}
        >
          <div className="md:w-12" />

          {filteredMedias.map((media) => (
            <div
              onContextMenu={(e: React.MouseEvent<HTMLDivElement>) =>
                e.preventDefault()
              }
              key={media.id}
              className="relative mt-4 group cursor-pointer user-select-none rounded-xl p-2 bg-transparent transition-colors duration-300 w-[10rem] md:w-[11.5rem] h-auto"
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

          <div className="md:w-12" />
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
