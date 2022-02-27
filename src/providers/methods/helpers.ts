import { MWMediaType } from "providers";
import { mediaProviders } from "./providers";

/*
 ** Fetch all enabled providers for a specific type
 */
 export function GetProvidersForType(type: MWMediaType) {
  return mediaProviders.filter((v) => v.type.includes(type));
}

/*
 ** Get a provider by a id
 */
 export function getProviderFromId(id: string) {
  return mediaProviders.find((v) => v.id === id);
}
