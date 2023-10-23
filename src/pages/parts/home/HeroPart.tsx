import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Sticky from "react-stickynode";

import { ThinContainer } from "@/components/layout/ThinContainer";
import { SearchBarInput } from "@/components/SearchBar";
import { HeroTitle } from "@/components/text/HeroTitle";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { useBannerSize } from "@/stores/banner";

export interface HeroPartProps {
  setIsSticky: (val: boolean) => void;
  searchParams: ReturnType<typeof useSearchQuery>;
}

export function HeroPart({ setIsSticky, searchParams }: HeroPartProps) {
  const { t } = useTranslation();
  const [search, setSearch, setSearchUnFocus] = searchParams;
  const [, setShowBg] = useState(false);
  const bannerSize = useBannerSize();
  const stickStateChanged = useCallback(
    ({ status }: Sticky.Status) => {
      const val = status === Sticky.STATUS_FIXED;
      setShowBg(val);
      setIsSticky(val);
    },
    [setShowBg, setIsSticky]
  );

  return (
    <ThinContainer>
      <div className="mt-44 space-y-16 text-center">
        <div className="relative z-10 mb-16">
          <HeroTitle className="mx-auto max-w-xs">
            {t("search.title")}
          </HeroTitle>
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
  );
}
