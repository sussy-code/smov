import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { Loading } from "@/components/layout/Loading";
import DiscoverContent from "@/utils/discoverContent";

import { SubPageLayout } from "./layouts/SubPageLayout";
import { PageTitle } from "./parts/util/PageTitle";

export function Discover() {
  const { t } = useTranslation();

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

  return (
    <SubPageLayout>
      <Helmet>
        {/* Hide scrollbar */}
        <style type="text/css">{`
            html, body {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
          `}</style>
      </Helmet>

      <PageTitle subpage k="global.pages.discover" />

      <div className="relative w-full max-w-screen-xl mx-auto px-4 text-center mt-12 mb-12">
        <div
          className="absolute inset-0 mx-auto h-[400px] max-w-[800px] rounded-full blur-[100px] opacity-20 transform -translate-y-[100px] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(var(--colors-buttons-purpleHover)), rgba(var(--colors-progress-filled)))`,
          }}
        />
        <h1
          className="relative text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text z-10"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(var(--colors-buttons-purpleHover)), rgba(var(--colors-progress-filled)))`,
          }}
        >
          {t("global.pages.discover")} Movies & TV
        </h1>
        <p className="relative text-lg mt-4 text-gray-400 z-10">
          Explore the latest hits and timeless classics.
        </p>
      </div>

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
        <DiscoverContent />
      )}
    </SubPageLayout>
  );
}
