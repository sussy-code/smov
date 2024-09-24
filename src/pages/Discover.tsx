import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import DiscoverContent from "@/utils/discoverContent";

import { SubPageLayout } from "./layouts/SubPageLayout";
import { PageTitle } from "./parts/util/PageTitle";

export function Discover() {
  const { t } = useTranslation();
  return (
    <SubPageLayout>
      <Helmet>
        {/* Hide scrollbar lmao */}
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
            backgroundImage: `linear-gradient(to right, rgba(var(--colors-global-accentA)), rgba(var(--colors-buttons-toggle)))`,
          }}
        />
        <h1
          className="relative text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text z-10"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(var(--colors-global-accentA)), rgba(var(--colors-buttons-toggle)))`,
          }}
        >
          {t("global.pages.discover")} Movies & TV
        </h1>
        <p className="relative text-lg mt-4 text-gray-400 z-10">
          Explore the latest hits and timeless classics.
        </p>
      </div>
      <DiscoverContent />
    </SubPageLayout>
  );
}
