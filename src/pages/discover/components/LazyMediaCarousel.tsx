import { useEffect, useState } from "react";

import { Category, Genre, Media } from "@/pages/discover/common";
import { useIntersectionObserver } from "@/pages/discover/hooks/useIntersectionObserver";
import { useLazyTMDBData } from "@/pages/discover/hooks/useTMDBData";

import { MediaCarousel } from "./MediaCarousel";

interface LazyMediaCarouselProps {
  category?: Category | null;
  genre?: Genre | null;
  mediaType: "movie" | "tv";
  isMobile: boolean;
  carouselRefs: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
}

export function LazyMediaCarousel({
  category,
  genre,
  mediaType,
  isMobile,
  carouselRefs,
}: LazyMediaCarouselProps) {
  const [medias, setMedias] = useState<Media[]>([]);

  // Use intersection observer to detect when this component is visible
  const { targetRef, isIntersecting, hasIntersected } = useIntersectionObserver(
    { rootMargin: "200px" }, // Load when within 200px of viewport
    true, // Only trigger once
  );

  // Use the lazy loading hook to fetch data when visible
  const { media, isLoading } = useLazyTMDBData(
    genre || null,
    category || null,
    mediaType,
    hasIntersected,
  );

  // Update medias when data is loaded
  useEffect(() => {
    if (media.length > 0) {
      setMedias(media);
    }
  }, [media]);

  const categoryName = category?.name || genre?.name || "";

  return (
    <div ref={targetRef as React.RefObject<HTMLDivElement>}>
      {isIntersecting ? (
        <MediaCarousel
          medias={medias}
          category={categoryName}
          isTVShow={mediaType === "tv"}
          isMobile={isMobile}
          carouselRefs={carouselRefs}
        />
      ) : (
        <div className="relative overflow-hidden carousel-container">
          <h2 className="ml-2 md:ml-8 mt-2 text-2xl cursor-default font-bold text-white md:text-2xl mx-auto pl-5 text-balance">
            {categoryName} {mediaType === "tv" ? "Shows" : "Movies"}
          </h2>
          <div className="flex whitespace-nowrap pt-0 pb-4 overflow-auto scrollbar rounded-xl overflow-y-hidden h-[300px] animate-pulse bg-background-secondary/20">
            <div className="w-full text-center flex items-center justify-center">
              {isLoading ? "Loading..." : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
