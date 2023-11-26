import { useHistory, useParams } from "react-router-dom";
import { useAsync } from "react-use";
import type { AsyncReturnType } from "type-fest";

import { DetailedMeta, getMetaFromId } from "@/backend/metadata/getmeta";
import { decodeTMDBId } from "@/backend/metadata/tmdb";
import { MWMediaType } from "@/backend/metadata/types/mw";
import { Button } from "@/components/buttons/Button";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { Loading } from "@/components/layout/Loading";
import { Paragraph } from "@/components/text/Paragraph";
import { Title } from "@/components/text/Title";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";

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

  const { error, value, loading } = useAsync(async () => {
    let data: ReturnType<typeof decodeTMDBId> = null;
    try {
      data = decodeTMDBId(params.media);
    } catch {
      // error dont matter, itll just be a 404
    }
    if (!data) return null;

    let meta: AsyncReturnType<typeof getMetaFromId> = null;
    try {
      meta = await getMetaFromId(data.type, data.id, params.season);
    } catch (err) {
      if ((err as any).status === 404) {
        return null;
      }
      throw err;
    }
    if (!meta) return null;

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

  if (error) {
    return (
      <ErrorLayout>
        <ErrorContainer>
          <IconPill icon={Icons.WAND}>Failed to load</IconPill>
          <Title>Failed to load meta data</Title>
          <Paragraph>
            Oh, my apowogies, sweetie! The itty-bitty movie-web did its utmost
            bestest, but alas, no wucky videos to be spotted anywhere (´⊙ω⊙`)
            Please don&apos;t be angwy, wittle movie-web ish twying so hard. Can
            you find it in your heart to forgive? UwU 💖
          </Paragraph>
          <Button
            href="/"
            theme="purple"
            padding="md:px-12 p-2.5"
            className="mt-6"
          >
            Go home
          </Button>
        </ErrorContainer>
      </ErrorLayout>
    );
  }

  if (!value && !loading) {
    return (
      <ErrorLayout>
        <ErrorContainer>
          <IconPill icon={Icons.WAND}>Not found</IconPill>
          <Title>This media doesnt exist</Title>
          <Paragraph>
            Oh, my apowogies, sweetie! The itty-bitty movie-web did its utmost
            bestest, but alas, no wucky videos to be spotted anywhere (´⊙ω⊙`)
            Please don&apos;t be angwy, wittle movie-web ish twying so hard. Can
            you find it in your heart to forgive? UwU 💖
          </Paragraph>
          <Button
            href="/"
            theme="purple"
            padding="md:px-12 p-2.5"
            className="mt-6"
          >
            Go home
          </Button>
        </ErrorContainer>
      </ErrorLayout>
    );
  }

  return (
    <ErrorLayout>
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    </ErrorLayout>
  );
}
