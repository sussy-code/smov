import { Icon, Icons } from "@/components/Icon";
import { Flare } from "@/components/utils/Flare";

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
        <Flare.Base className="group -m-[0.705em] rounded-full bg-search-hoverBackground transition-transform duration-300 focus:relative focus:z-10 hover:bg-mediaCard-hoverBackground tabbable hover:scale-110">
          <Flare.Light
            flareSize={90}
            cssColorVar="--colors-mediaCard-hoverAccent"
            backgroundClass="bg-mediaCard-hoverBackground duration-100"
            className="rounded-full group-hover:opacity-100 z-20"
          />
          <Flare.Child className="cursor-pointer text-white flex justify-center items-center h-10 w-10 rounded-full active:scale-110 transition-[transform,background-color] duration-200 z-30">
            <Icon icon={Icons.CHEVRON_LEFT} />
          </Flare.Child>
        </Flare.Base>
      </button>
      <button
        type="button"
        className="absolute right-12 top-1/2 transform -translate-y-3/4 z-10"
        onClick={() => handleScroll("right")}
      >
        <Flare.Base className="group -m-[0.705em] rounded-full bg-search-hoverBackground transition-transform duration-300 focus:relative focus:z-10 hover:bg-mediaCard-hoverBackground tabbable hover:scale-110">
          <Flare.Light
            flareSize={90}
            cssColorVar="--colors-mediaCard-hoverAccent"
            backgroundClass="bg-mediaCard-hoverBackground duration-100"
            className="rounded-full group-hover:opacity-100 z-20"
          />
          <Flare.Child className="cursor-pointer text-white flex justify-center items-center h-10 w-10 rounded-full active:scale-110 transition-[transform,background-color] duration-200 z-30">
            <Icon icon={Icons.CHEVRON_RIGHT} />
          </Flare.Child>
        </Flare.Base>
      </button>
    </>
  );
}
