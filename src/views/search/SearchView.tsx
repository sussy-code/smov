import { useCallback, useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { ThinContainer } from "@/components/layout/ThinContainer";
import { SearchBarInput } from "@/components/SearchBar";
import Sticky from "react-stickynode";
import { Title } from "@/components/text/Title";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { WideContainer } from "@/components/layout/WideContainer";
import { useTranslation } from "react-i18next";
import { SearchResultsPartial } from "./SearchResultsPartial";

export function SearchView() {
  const { t } = useTranslation();
  const [search, setSearch, setSearchUnFocus] = useSearchQuery();
  const [showBg, setShowBg] = useState(false);

  const stickStateChanged = useCallback(
    ({ status }: Sticky.Status) => setShowBg(status === Sticky.STATUS_FIXED),
    [setShowBg]
  );

  return (
    <>
      <div className="relative z-10 mb-24">
        <Navigation bg={showBg} />
        <ThinContainer>
          <div className="mt-44 space-y-16 text-center">
            <div className="absolute left-0 bottom-0 right-0 flex h-0 justify-center">
              <div className="absolute bottom-4 h-[100vh] w-[300vh] rounded-[100%] bg-denim-300" />
            </div>
            <div className="relative z-20">
              <div className="mb-16">
                <Title className="mx-auto max-w-xs">{t("search.title")}</Title>
              </div>
              <Sticky enabled top={16} onStateChange={stickStateChanged}>
                <SearchBarInput
                  onChange={setSearch}
                  value={search}
                  onUnFocus={setSearchUnFocus}
                  placeholder={
                    t("search.placeholder") || "What do you want to watch?"
                  }
                />
              </Sticky>
            </div>
          </div>
        </ThinContainer>
      </div>
      <WideContainer>
        <SearchResultsPartial search={search} />
      </WideContainer>
    </>
  );
}
