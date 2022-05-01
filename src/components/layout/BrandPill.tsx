import { Icon, Icons } from "components/Icon";

export function BrandPill(props: { clickable?: boolean }) {
  return (
    <div
      className={`bg-bink-100 text-bink-600 flex items-center space-x-2 rounded-full bg-opacity-50 px-4 py-2 ${
        props.clickable
          ? "hover:bg-bink-200 hover:text-bink-700 transition-[transform,background-color] hover:scale-105 active:scale-95"
          : ""
      }`}
    >
      <Icon className="text-xl" icon={Icons.MOVIE_WEB} />
      <span className="font-semibold text-white">movie-web</span>
    </div>
  );
}
