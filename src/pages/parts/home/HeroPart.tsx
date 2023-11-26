import { useCallback, useState } from "react";
import Sticky from "react-sticky-el";

import { SearchBarInput } from "@/components/form/SearchBar";
import { ThinContainer } from "@/components/layout/ThinContainer";
import { HeroTitle } from "@/components/text/HeroTitle";
import { useRandomTranslation } from "@/hooks/useRandomTranslation";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { useBannerSize } from "@/stores/banner";

export interface HeroPartProps {
  setIsSticky: (val: boolean) => void;
  searchParams: ReturnType<typeof useSearchQuery>;
}

export function HeroPart({ setIsSticky, searchParams }: HeroPartProps) {
  const { t } = useRandomTranslation();
  const [search, setSearch, setSearchUnFocus] = searchParams;
  const [, setShowBg] = useState(false);
  const bannerSize = useBannerSize();
  const stickStateChanged = useCallback(
    (isFixed) => {
      setShowBg(isFixed);
      setIsSticky(isFixed);
    },
    [setShowBg, setIsSticky]
  );

  let time = "night";
  const hour = new Date().getHours();
  if (hour < 12) time = "morning";
  else if (hour < 19) time = "day";

  const title = t(`search.title.${time}`);

  return (
    <ThinContainer>
      <div className="mt-44 space-y-16 text-center">
        <div className="relative z-10 mb-16">
          <HeroTitle className="mx-auto max-w-xs">{title}</HeroTitle>
        </div>
        <div className="relative h-20 z-30">
          <Sticky
            topOffset={-16 + bannerSize}
            stickyStyle={{
              paddingTop: `${16 + bannerSize}px`,
            }}
            onFixedToggle={stickStateChanged}
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
