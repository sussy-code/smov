import { useCallback, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Sticky from "react-stickynode";

import { Navigation } from "@/components/layout/Navigation";
import { ThinContainer } from "@/components/layout/ThinContainer";
import { WideContainer } from "@/components/layout/WideContainer";
import { SearchBarInput } from "@/components/SearchBar";
import { Title } from "@/components/text/Title";
import { useBannerSize } from "@/hooks/useBanner";
import { useSearchQuery } from "@/hooks/useSearchQuery";

import { SearchResultsPartial } from "./SearchResultsPartial";

export function SearchView() {
  const { t } = useTranslation();
  const [search, setSearch, setSearchUnFocus] = useSearchQuery();
  const [showBg, setShowBg] = useState(false);
  const bannerSize = useBannerSize();

  const stickStateChanged = useCallback(
    ({ status }: Sticky.Status) => setShowBg(status === Sticky.STATUS_FIXED),
    [setShowBg]
  );

  return (
    <>
      <div className="relative z-10 mb-16 sm:mb-24">
        <Helmet>
          <title>{t("global.name")}</title>
        </Helmet>
        <Navigation bg={showBg} />
        <ThinContainer>
          <div className="mt-44 space-y-16 text-center">
            <div className="absolute bottom-0 left-0 right-0 flex h-0 justify-center">
              <div className="absolute bottom-4 h-[100vh] w-[3000px] rounded-[100%] bg-denim-300 md:w-[200vw]" />
            </div>
            <div className="relative z-10 mb-16">
              <Title className="mx-auto max-w-xs">{t("search.title")}</Title>
            </div>
            <div className="relative z-30">
              <Sticky
                enabled
                top={16 + bannerSize}
                onStateChange={stickStateChanged}
              >
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
