import { theFlixScraper } from "providers/list/theflix";
import { gDrivePlayerScraper } from "providers/list/gdriveplayer";
import { MWWrappedMediaProvider, WrapProvider } from "providers/wrapper";

export const mediaProvidersUnchecked: MWWrappedMediaProvider[] = [
  WrapProvider(theFlixScraper),
  WrapProvider(gDrivePlayerScraper),
];

export const mediaProviders: MWWrappedMediaProvider[] =
  mediaProvidersUnchecked.filter((v) => v.enabled);
