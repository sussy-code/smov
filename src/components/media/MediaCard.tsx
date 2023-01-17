import { Link } from "react-router-dom";
import { DotList } from "@/components/text/DotList";
import { MWMediaMeta } from "@/backend/metadata/types";
import { mediaTypeToJW } from "@/backend/metadata/justwatch";

export interface MediaCardProps {
  media: MWMediaMeta;
  linkable?: boolean;
  series?: {
    episode: number;
    season: number;
  };
  percentage?: number;
}

function MediaCardContent({
  media,
  linkable,
  series,
  percentage,
}: MediaCardProps) {
  const percentageString = `${Math.round(percentage ?? 0).toFixed(0)}%`;

  return (
    <div
      className={`group -m-3 mb-2 rounded-xl bg-denim-300 bg-opacity-0 transition-colors duration-100 ${
        linkable ? "hover:bg-opacity-100" : ""
      }`}
    >
      <article
        className={`relative mb-2 p-3 transition-transform duration-100 ${
          linkable ? "group-hover:scale-95" : ""
        }`}
      >
        <div
          className="relative mb-4 aspect-[2/3] w-full overflow-hidden rounded-xl bg-denim-500 bg-cover"
          style={{
            backgroundImage: media.poster ? `url(${media.poster})` : undefined,
          }}
        >
          {series ? (
            <div className="absolute right-2 top-2 rounded-md bg-denim-200 py-1 px-2 transition-colors group-hover:bg-denim-500">
              <p className="text-center text-xs font-bold text-slate-400 transition-colors group-hover:text-white">
                S{series.season} E{series.episode}
              </p>
            </div>
          ) : null}

          {percentage !== undefined ? (
            <>
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-denim-300 to-transparent transition-colors group-hover:from-denim-100" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-denim-300 to-transparent transition-colors group-hover:from-denim-100" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="relative h-1 overflow-hidden rounded-full bg-denim-600">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-bink-700"
                    style={{
                      width: percentageString,
                    }}
                  />
                </div>
              </div>
            </>
          ) : null}
        </div>
        <h1 className="mb-1 max-h-[4.5rem] text-ellipsis break-words font-bold text-white line-clamp-3">
          <span>{media.title}</span>
        </h1>
        <DotList className="text-xs" content={[media.type, media.year]} />
      </article>
    </div>
  );
}

export function MediaCard(props: MediaCardProps) {
  const content = <MediaCardContent {...props} />;

  if (!props.linkable) return <span>{content}</span>;
  return (
    <Link
      to={`/media/${encodeURIComponent(
        mediaTypeToJW(props.media.type)
      )}-${encodeURIComponent(props.media.id)}`}
    >
      {content}
    </Link>
  );
}
