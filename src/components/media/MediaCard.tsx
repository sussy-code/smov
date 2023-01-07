import { Link } from "react-router-dom";
import {
  convertMediaToPortable,
  getProviderFromId,
  MWMediaMeta,
  MWMediaType,
} from "@/providers";
import { serializePortableMedia } from "@/hooks/usePortableMedia";
import { DotList } from "@/components/text/DotList";

export interface MediaCardProps {
  media: MWMediaMeta;
  // eslint-disable-next-line react/no-unused-prop-types
  watchedPercentage: number;
  linkable?: boolean;
  series?: boolean;
}

// TODO add progress back

function MediaCardContent({ media, series, linkable }: MediaCardProps) {
  const provider = getProviderFromId(media.providerId);

  if (!provider) {
    return null;
  }

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
        <div className="mb-4 aspect-[2/3] w-full rounded-xl bg-denim-500" />
        <h1 className="mb-1 max-h-[4.5rem] text-ellipsis break-words font-bold text-white line-clamp-3">
          <span>{media.title}</span>
          {series && media.seasonId && media.episodeId ? (
            <span className="ml-2 text-xs text-denim-700">
              S{media.seasonId} E{media.episodeId}
            </span>
          ) : null}
        </h1>
        <DotList
          className="text-xs"
          content={[provider.displayName, media.mediaType, media.year]}
        />
      </article>
    </div>
  );
}

export function MediaCard(props: MediaCardProps) {
  let link = "movie";
  if (props.media.mediaType === MWMediaType.SERIES) link = "series";

  const content = <MediaCardContent {...props} />;

  if (!props.linkable) return <span>{content}</span>;
  return (
    <Link
      to={`/media/${link}/${serializePortableMedia(
        convertMediaToPortable(props.media)
      )}`}
    >
      {content}
    </Link>
  );
}
