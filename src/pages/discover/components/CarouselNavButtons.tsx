import { Icon, Icons } from "@/components/Icon";

interface CarouselNavButtonsProps {
  categorySlug: string;
  carouselRefs: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
}

export function CarouselNavButtons({
  categorySlug,
  carouselRefs,
}: CarouselNavButtonsProps) {
  const handleScroll = (direction: "left" | "right") => {
    const carousel = carouselRefs.current[categorySlug];
    if (!carousel) return;

    const movieElements = carousel.getElementsByTagName("a");
    if (movieElements.length === 0) return;

    const movieWidth = movieElements[0].offsetWidth;
    const visibleMovies = Math.floor(carousel.offsetWidth / movieWidth);
    const scrollAmount = movieWidth * (visibleMovies > 5 ? 4 : 2);

    carousel.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <button
        type="button"
        className="absolute left-12 top-1/2 transform -translate-y-3/4 z-10"
        onClick={() => handleScroll("left")}
      >
        <Icon
          icon={Icons.CHEVRON_LEFT}
          className="cursor-pointer text-white flex justify-center items-center h-10 w-10 rounded-full bg-search-hoverBackground active:scale-110 transition-[transform,background-color] duration-200"
        />
      </button>
      <button
        type="button"
        className="absolute right-12 top-1/2 transform -translate-y-3/4 z-10"
        onClick={() => handleScroll("right")}
      >
        <Icon
          icon={Icons.CHEVRON_RIGHT}
          className="cursor-pointer text-white flex justify-center items-center h-10 w-10 rounded-full bg-search-hoverBackground active:scale-110 transition-[transform,background-color] duration-200"
        />
      </button>
    </>
  );
}
