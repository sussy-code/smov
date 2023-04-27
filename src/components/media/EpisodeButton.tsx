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
      className={`transition-[background-color, transform, box-shadow] relative mb-3 mr-3 inline-flex h-10 w-10 cursor-pointer select-none items-center justify-center overflow-hidden rounded bg-denim-500 font-bold text-white hover:bg-denim-400 active:scale-110 ${
        props.active ? "shadow-[inset_0_0_0_2px] shadow-bink-500" : ""
      }`}
    >
      <div
        className="absolute bottom-0 left-0 top-0 bg-bink-500 bg-opacity-50"
        style={{
          width: `${props.progress || 0}%`,
        }}
      />
      <span className="relative">{props.episodeNumber}</span>
    </div>
  );
}
