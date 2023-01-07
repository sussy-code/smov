import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MediaGrid } from "@/components/media/MediaGrid";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import { useLoading } from "@/hooks/useLoading";
import { MWMassProviderOutput, MWQuery, SearchProviders } from "@/providers";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchLoadingView } from "./SearchLoadingView";

function SearchSuffix(props: {
  fails: number;
  total: number;
  resultsSize: number;
}) {
  const { t } = useTranslation();

  const allFailed: boolean = props.fails === props.total;
  const icon: Icons = allFailed ? Icons.WARNING : Icons.EYE_SLASH;

  return (
    <div className="mt-40 mb-24  flex flex-col items-center justify-center space-y-3 text-center">
      <IconPatch
        icon={icon}
        className={`text-xl ${allFailed ? "text-red-400" : "text-bink-600"}`}
      />

      {/* standard suffix */}
      {!allFailed ? (
        <div>
          {props.fails > 0 ? (
            <p className="text-red-400">
              {t("search.providersFailed", {
                fails: props.fails,
                total: props.total,
              })}
            </p>
          ) : null}
          {props.resultsSize > 0 ? (
            <p>{t("search.allResults")}</p>
          ) : (
            <p>{t("search.noResults")}</p>
          )}
        </div>
      ) : null}

      {/* Error result */}
      {allFailed ? (
        <div>
          <p>{t("search.allFailed")}</p>
        </div>
      ) : null}
    </div>
  );
}

export function SearchResultsView({ searchQuery }: { searchQuery: MWQuery }) {
  const { t } = useTranslation();

  const [results, setResults] = useState<MWMassProviderOutput | undefined>();
  const [runSearchQuery, loading, error] = useLoading((query: MWQuery) =>
    SearchProviders(query)
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
  if (error) return <SearchSuffix resultsSize={0} fails={1} total={1} />;
  if (!results) return null;

  return (
    <div>
      {results?.results.length > 0 ? (
        <SectionHeading
          title={t("search.headingTitle") || "Search results"}
          icon={Icons.SEARCH}
        >
          <MediaGrid>
            {results.results.map((v) => (
              <WatchedMediaCard
                key={[v.mediaId, v.providerId].join("|")}
                media={v}
              />
            ))}
          </MediaGrid>
        </SectionHeading>
      ) : null}

      <SearchSuffix
        resultsSize={results.results.length}
        fails={results.stats.failed}
        total={results.stats.total}
      />
    </div>
  );
}
