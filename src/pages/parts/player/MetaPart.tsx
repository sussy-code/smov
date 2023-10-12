import { useHistory, useParams } from "react-router-dom";
import { useAsync } from "react-use";

import { DetailedMeta, getMetaFromId } from "@/backend/metadata/getmeta";
import { decodeTMDBId } from "@/backend/metadata/tmdb";
import { MWMediaType } from "@/backend/metadata/types/mw";

export interface MetaPartProps {
  onGetMeta?: (meta: DetailedMeta, episodeId?: string) => void;
}

export function MetaPart(props: MetaPartProps) {
  const params = useParams<{
    media: string;
    episode?: string;
    season?: string;
  }>();
  const history = useHistory();

  const { loading, error } = useAsync(async () => {
    const data = decodeTMDBId(params.media);
    if (!data) return;

    const meta = await getMetaFromId(data.type, data.id, params.season);
    if (!meta) return;

    // replace link with new link if youre not already on the right link
    let epId = params.episode;
    if (meta.meta.type === MWMediaType.SERIES) {
      let ep = meta.meta.seasonData.episodes.find(
        (v) => v.id === params.episode
      );
      if (!ep) ep = meta.meta.seasonData.episodes[0];
      epId = ep.id;
      if (
        params.season !== meta.meta.seasonData.id ||
        params.episode !== ep.id
      ) {
        history.replace(
          `/media/${params.media}/${meta.meta.seasonData.id}/${ep.id}`
        );
      }
    }

    props.onGetMeta?.(meta, epId);
  }, []);

  return (
    <div className="flex items-center justify-center">
      {loading ? <p>loading meta...</p> : null}
      {error ? <p>failed to load meta!</p> : null}
    </div>
  );
}
