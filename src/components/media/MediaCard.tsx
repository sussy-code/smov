import { GetProviderFromId, MWMedia, MWMediaType } from "@/scrapers";
import { Link } from "react-router-dom";

export interface MediaCardProps {
  media: MWMedia;
  watchedPercentage: Number;
}

function MediaCardContent({ media, watchedPercentage }: MediaCardProps) {
  return (
    <>
      <p>{media.title} ({GetProviderFromId(media.providerId)?.displayName})</p>
      <p>{watchedPercentage}% watched</p>
      <hr/>
    </>
  )
}

export function MediaCard(props: MediaCardProps) {
  const provider = GetProviderFromId(props.media.providerId);
  let link = "movie"
  if (provider?.type === MWMediaType.SERIES)
    link = "series";

  return (
    <Link to={`/media/${link}`}>
      <MediaCardContent {...props} />
    </Link>
  )
}
