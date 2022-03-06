import { tempScraper } from "providers/list/temp";
import { theFlixScraper } from "providers/list/theflix";
import { MWWrappedMediaProvider, WrapProvider } from "providers/wrapper";

export const mediaProvidersUnchecked: MWWrappedMediaProvider[] = [
  WrapProvider(theFlixScraper),
  WrapProvider(tempScraper),
];

export const mediaProviders: MWWrappedMediaProvider[] =
  mediaProvidersUnchecked.filter((v) => v.enabled);
