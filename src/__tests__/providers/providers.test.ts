import { describe, it } from "vitest";

import "@/backend";
import { testData } from "@/__tests__/providers/testdata";
import { getProviders } from "@/backend/helpers/register";
import { runProvider } from "@/backend/helpers/run";
import { MWMediaType } from "@/backend/metadata/types/mw";

describe("providers", () => {
  const providers = getProviders();

  it("have at least one provider", ({ expect }) => {
    expect(providers.length).toBeGreaterThan(0);
  });

  for (const provider of providers) {
    describe(provider.displayName, () => {
      it("must have at least one type", async ({ expect }) => {
        expect(provider.type.length).toBeGreaterThan(0);
      });

      if (provider.type.includes(MWMediaType.MOVIE)) {
        it("must work with movies", async ({ expect }) => {
          const movie = testData.find((v) => v.meta.type === MWMediaType.MOVIE);
          if (!movie) throw new Error("no movie to test with");
          const results = await runProvider(provider, {
            media: movie,
            progress() {},
            type: movie.meta.type as any,
          });
          expect(results).toBeTruthy();
        });
      }

      if (provider.type.includes(MWMediaType.SERIES)) {
        it("must work with series", async ({ expect }) => {
          const show = testData.find((v) => v.meta.type === MWMediaType.SERIES);
          if (show?.meta.type !== MWMediaType.SERIES)
            throw new Error("no show to test with");
          const results = await runProvider(provider, {
            media: show,
            progress() {},
            type: show.meta.type as MWMediaType.SERIES,
            episode: show.meta.seasonData.episodes[0].id,
            season: show.meta.seasons[0].id,
          });
          expect(results).toBeTruthy();
        });
      }
    });
  }
});
