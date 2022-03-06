import { MWMediaType, MWMediaProviderMetadata } from "providers";
import { mediaProviders, mediaProvidersUnchecked } from "./providers";

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

/*
 ** Get a provider metadata
 */
export function getProviderMetadata(id: string): MWMediaProviderMetadata {
  const provider = mediaProvidersUnchecked.find((v) => v.id === id);

  if (!provider) {
    return {
      exists: false,
      type: [],
      enabled: false,
      id,
    };
  }

  return {
    exists: true,
    type: provider.type,
    enabled: provider.enabled,
    id,
    provider,
  };
}
