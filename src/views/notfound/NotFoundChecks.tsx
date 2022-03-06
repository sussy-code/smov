import { getProviderMetadata, MWPortableMedia } from "providers";
import { ReactNode } from "react";
import { NotFoundMedia, NotFoundProvider } from "./NotFoundView";

export interface NotFoundChecksProps {
  portable: MWPortableMedia | undefined;
  children?: ReactNode;
}

/*
 ** Component that only renders children if the passed-in portable is fully correct
 */
export function NotFoundChecks(props: NotFoundChecksProps) {
  const providerMeta = props.portable
    ? getProviderMetadata(props.portable.providerId)
    : undefined;

  if (!providerMeta || !providerMeta.exists) {
    return <NotFoundMedia />;
  }

  if (!providerMeta.enabled) {
    return <NotFoundProvider />;
  }

  return <>{props.children}</>;
}
