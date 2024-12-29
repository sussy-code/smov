import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { Loading } from "@/components/layout/Loading";
import { WideContainer } from "@/components/layout/WideContainer";
import { useDebounce } from "@/hooks/useDebounce";
import { useRandomTranslation } from "@/hooks/useRandomTranslation";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { HomeLayout } from "@/pages/layouts/HomeLayout";
import { BookmarksPart } from "@/pages/parts/home/BookmarksPart";
import { HeroPart } from "@/pages/parts/home/HeroPart";
import { WatchingPart } from "@/pages/parts/home/WatchingPart";
import { SearchListPart } from "@/pages/parts/search/SearchListPart";
import { SearchLoadingPart } from "@/pages/parts/search/SearchLoadingPart";
import DiscoverContent from "@/utils/discoverContent";

import { PopupModal } from "./parts/home/PopupModal";

function useSearch(search: string) {
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearch = useDebounce<string>(search, 500);
  useEffect(() => {
    setSearching(search !== "");
    setLoading(search !== "");
  }, [search]);
  useEffect(() => {
    setLoading(false);
  }, [debouncedSearch]);

  return {
    loading,
    searching,
  };
}

// What the sigma?

export function HomePage() {
  const { t } = useTranslation();
  const { t: randomT } = useRandomTranslation();
  const emptyText = randomT(`home.search.empty`);
  const [showBg, setShowBg] = useState<boolean>(false);
  const searchParams = useSearchQuery();
  const [search] = searchParams;
  const s = useSearch(search);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showWatching, setShowWatching] = useState(false);

  // State to track whether content is loading or loaded
  const [loading, setLoading] = useState(true);

  // Simulate loading media cards
  useEffect(() => {
    const simulateLoading = async () => {
      // Simulate a loading time with setTimeout or fetch data here
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      }); // Simulate 2s loading time
      setLoading(false); // After loading, set loading to false
    };

    simulateLoading();
  }, []);

  const [showModal, setShowModal] = useState(() => {
    const isSafari =
      typeof navigator !== "undefined" &&
      /Safari/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent);

    const isMac =
      typeof navigator !== "undefined" && /Mac/.test(navigator.platform);

    const isIOS =
      typeof navigator !== "undefined" &&
      /iPhone|iPad|iPod/.test(navigator.userAgent);

    return isSafari && (isMac || isIOS);
  });

  return (
    <HomeLayout showBg={showBg}>
      <div className="mb-16 sm:mb-24">
        <Helmet>
          <style type="text/css">{`
            html, body {
              scrollbar-gutter: stable;
            }
          `}</style>
          <title>{t("global.name")}</title>
        </Helmet>

        {/* Popup Modal */}
        {showModal && (
          <PopupModal
            title="Issue on Safari (iOS/macOS)"
            message={
              <p>
                Due to a recent update, many P-Stream sources are broken on iOS
                and macOS.
                <br />
                The only available source on Safari right now is SoaperTV.
                <br />
                <br />
                <strong>Workaround: </strong>
                Please switch to Chrome on desktop where all sources are still
                working. (And where the extension is available!)
                <br />
                <br />
                I&apos;m working on a fix. For updates on this issue please join
                the{" "}
                <a
                  href="https://discord.com/invite/7z6znYgrTG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-onboarding-link"
                >
                  P-Stream Discord
                </a>
                . Sorry for the inconvenience.
              </p>
            }
            onClose={() => setShowModal(false)}
          />
        )}
        {/* END */}

        <HeroPart searchParams={searchParams} setIsSticky={setShowBg} />
      </div>
      <WideContainer>
        {s.loading ? (
          <SearchLoadingPart />
        ) : s.searching ? (
          <SearchListPart searchQuery={search} />
        ) : (
          <div className="flex flex-col gap-8">
            <WatchingPart onItemsChange={setShowWatching} />
            <BookmarksPart onItemsChange={setShowBookmarks} />
          </div>
        )}
        {!(showBookmarks || showWatching) ? (
          <div className="flex flex-col translate-y-[-30px] items-center justify-center">
            <p className="text-[18.5px] pb-3">{emptyText}</p>
          </div>
        ) : null}
      </WideContainer>
      {/* Conditional rendering: show loading screen or the content */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <Loading />
          <p className="text-lg font-medium text-gray-400 animate-pulse mt-4">
            Fetching the latest movies & TV shows...
          </p>
          <p className="text-sm text-gray-500">
            Please wait while we load the best recommendations for you.
          </p>
        </div>
      ) : (
        <div className="pt-10 px-0 w-full max-w-[100dvw] justify-center items-center">
          <DiscoverContent />
        </div>
      )}
    </HomeLayout>
  );
}
