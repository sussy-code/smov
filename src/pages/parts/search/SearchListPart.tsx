import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAsyncFn } from "react-use";

import { searchForMedia } from "@/backend/metadata/search";
import { MWQuery } from "@/backend/metadata/types/mw";
import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MediaGrid } from "@/components/media/MediaGrid";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import { Button } from "@/pages/About";
import { SearchLoadingPart } from "@/pages/parts/search/SearchLoadingPart";
import { MediaItem } from "@/utils/mediaTypes";

function SearchSuffix(props: { failed?: boolean; results?: number }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const icon: Icons = props.failed ? Icons.WARNING : Icons.EYE_SLASH;

  return (
    <div className="mb-24 mt-40  flex flex-col items-center justify-center space-y-3 text-center">
      <IconPatch
        icon={icon}
        className={`text-xl ${
          props.failed ? "text-red-400" : "text-type-logo"
        }`}
      />

      {/* standard suffix */}
      {!props.failed ? (
        <div>
          {(props.results ?? 0) > 0 ? (
            <>
              <p>{t("home.search.allResults")}</p>
              <Button
                className="px-py p-[0.3em] mt-3 rounded-xl text-type-dimmed box-content text-[17px] bg-largeCard-background text-buttons-secondaryText justify-center items-center"
                onClick={() => navigate("/discover")}
              >
                {t("home.search.discoverMore")}
              </Button>
            </>
          ) : (
            <p>{t("home.search.noResults")}</p>
          )}
        </div>
      ) : null}

      {/* Error result */}
      {props.failed ? (
        <div>
          <p>{t("home.search.failed")}</p>
        </div>
      ) : null}
    </div>
  );
}

export function SearchListPart({ searchQuery }: { searchQuery: string }) {
  const { t } = useTranslation();

  const [results, setResults] = useState<MediaItem[]>([]);
  const [state, exec] = useAsyncFn((query: MWQuery) => searchForMedia(query));

  useEffect(() => {
    async function runSearch(query: MWQuery) {
      const searchResults = await exec(query);
      if (!searchResults) return;
      setResults(searchResults);
    }

    if (searchQuery !== "") runSearch({ searchQuery });
  }, [searchQuery, exec]);

  if (state.loading) return <SearchLoadingPart />;
  if (state.error) return <SearchSuffix failed />;
  if (!results) return null;

  return (
    <div>
      {results.length > 0 ? (
        <div>
          <SectionHeading
            title={t("home.search.sectionTitle")}
            icon={Icons.SEARCH}
          />
          <MediaGrid>
            {results.map((v) => (
              <WatchedMediaCard key={v.id.toString()} media={v} />
            ))}
          </MediaGrid>
        </div>
      ) : null}

      <SearchSuffix results={results.length} />
    </div>
  );
}
