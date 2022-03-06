import {
  convertMediaToPortable,
  getProviderFromId,
  MWMediaMeta,
  MWMediaType,
} from "providers";
import { Link } from "react-router-dom";
import { Icon, Icons } from "components/Icon";
import { serializePortableMedia } from "hooks/usePortableMedia";
import { DotList } from "components/text/DotList";

export interface MediaCardProps {
  media: MWMediaMeta;
  watchedPercentage: number;
  linkable?: boolean;
}

function MediaCardContent({
  media,
  linkable,
  watchedPercentage,
}: MediaCardProps) {
  const provider = getProviderFromId(media.providerId);

  if (!provider) {
    return null;
  }

  return (
    <article
      className={`bg-denim-300 group relative mb-4 flex overflow-hidden rounded py-4 px-5 ${
        linkable ? "hover:bg-denim-400" : ""
      }`}
    >
      {/* progress background */}
      {watchedPercentage > 0 ? (
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <div
            className="bg-bink-300 relative h-full bg-opacity-30"
            style={{
              width: `${watchedPercentage}%`,
            }}
          >
            <div className="from-bink-400 absolute right-0 top-0 bottom-0 ml-auto w-40 bg-gradient-to-l to-transparent opacity-40" />
          </div>
        </div>
      ) : null}

      <div className="relative flex flex-1">
        {/* card content */}
        <div className="flex-1">
          <h1 className="mb-1 font-bold text-white">{media.title}</h1>
          <DotList
            className="text-xs"
            content={[provider.displayName, media.mediaType, media.year]}
          />
        </div>

        {/* hoverable chevron */}
        <div
          className={`flex translate-x-3 items-center justify-end text-xl text-white opacity-0 transition-[opacity,transform] ${
            linkable ? "group-hover:translate-x-0 group-hover:opacity-100" : ""
          }`}
        >
          <Icon icon={Icons.CHEVRON_RIGHT} />
        </div>
      </div>
    </article>
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
