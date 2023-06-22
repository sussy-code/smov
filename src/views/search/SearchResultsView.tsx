import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { searchForMedia } from "@/backend/metadata/search";
import { MWMediaMeta, MWQuery } from "@/backend/metadata/types/mw";
import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MediaGrid } from "@/components/media/MediaGrid";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import { useLoading } from "@/hooks/useLoading";

import { SearchLoadingView } from "./SearchLoadingView";

function SearchSuffix(props: { failed?: boolean; results?: number }) {
  const { t } = useTranslation();

  const icon: Icons = props.failed ? Icons.WARNING : Icons.EYE_SLASH;

  return (
    <div className="mb-24 mt-40  flex flex-col items-center justify-center space-y-3 text-center">
      <IconPatch
        icon={icon}
        className={`text-xl ${props.failed ? "text-red-400" : "text-bink-600"}`}
      />

      {/* standard suffix */}
      {!props.failed ? (
        <div>
          {(props.results ?? 0) > 0 ? (
            <p>{t("search.allResults")}</p>
          ) : (
            <p>{t("search.noResults")}</p>
          )}
        </div>
      ) : null}

      {/* Error result */}
      {props.failed ? (
        <div>
          <p>{t("search.allFailed")}</p>
        </div>
      ) : null}
    </div>
  );
}

export function SearchResultsView({ searchQuery }: { searchQuery: MWQuery }) {
  const { t } = useTranslation();

  const [results, setResults] = useState<MWMediaMeta[]>([]);
  const [runSearchQuery, loading, error] = useLoading((query: MWQuery) =>
    searchForMedia(query)
  );

  useEffect(() => {
    async function runSearch(query: MWQuery) {
      const searchResults = await runSearchQuery(query);
      if (!searchResults) return;
      setResults(searchResults);
    }

    if (searchQuery.searchQuery !== "") runSearch(searchQuery);
  }, [searchQuery, runSearchQuery]);

  if (loading) return <SearchLoadingView />;
  if (error) return <SearchSuffix failed />;
  if (!results) return null;

  return (
    <div>
      {results.length > 0 ? (
        <div>
          <SectionHeading
            title={t("search.headingTitle") || "Search results"}
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
