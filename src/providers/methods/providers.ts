import { theFlixScraper } from "providers/list/theflix";
import { gDrivePlayerScraper } from "providers/list/gdriveplayer";
import { MWWrappedMediaProvider, WrapProvider } from "providers/wrapper";
import { gomostreamScraper } from "providers/list/gomostream";
import { xemovieScraper } from "providers/list/xemovie";

export const mediaProvidersUnchecked: MWWrappedMediaProvider[] = [
  WrapProvider(theFlixScraper),
  WrapProvider(gDrivePlayerScraper),
  WrapProvider(gomostreamScraper),
  WrapProvider(xemovieScraper),
];

export const mediaProviders: MWWrappedMediaProvider[] =
  mediaProvidersUnchecked.filter((v) => v.enabled);
