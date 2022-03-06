export interface EpisodeProps {
  progress?: number;
  episodeNumber: number;
  onClick?: () => void;
  active?: boolean;
}

export function Episode(props: EpisodeProps) {
  return (
    <div
      onClick={props.onClick}
      className={`bg-denim-500 hover:bg-denim-400 transition-[background-color, transform] relative mr-3 mb-3 inline-flex h-10 w-10 cursor-pointer select-none items-center justify-center overflow-hidden rounded border-2 border-transparent font-bold text-white active:scale-110 ${
        props.active ? "border-bink-500 bg-bink-200" : ""
      }`}
    >
      <div
        className="bg-bink-500 absolute bottom-0 top-0 left-0 bg-opacity-50"
        style={{
          width: `${props.progress || 0}%`,
        }}
      />
      <span className="relative">{props.episodeNumber}</span>
    </div>
  );
}
