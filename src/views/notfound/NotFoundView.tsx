import { ReactNode } from "react";
import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { Navigation } from "@/components/layout/Navigation";
import { ArrowLink } from "@/components/text/ArrowLink";
import { Title } from "@/components/text/Title";

function NotFoundWrapper(props: { children?: ReactNode }) {
  return (
    <div className="h-screen flex-1">
      <Navigation />
      <div className="flex h-full flex-col items-center justify-center p-5 text-center">
        {props.children}
      </div>
    </div>
  );
}

export function NotFoundMedia() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-5 text-center">
      <IconPatch
        icon={Icons.EYE_SLASH}
        className="mb-6 text-xl text-bink-600"
      />
      <Title>Couldn&apos;t find that media</Title>
      <p className="mt-5 mb-12 max-w-sm">
        We couldn&apos;t find the media you requested. Either it&apos;s been
        removed or you tampered with the URL
      </p>
      <ArrowLink to="/" linkText="Back to home" />
    </div>
  );
}

export function NotFoundProvider() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-5 text-center">
      <IconPatch
        icon={Icons.EYE_SLASH}
        className="mb-6 text-xl text-bink-600"
      />
      <Title>This provider has been disabled</Title>
      <p className="mt-5 mb-12 max-w-sm">
        We had issues with the provider or it was too unstable to use, so we had
        to disable it.
      </p>
      <ArrowLink to="/" linkText="Back to home" />
    </div>
  );
}

export function NotFoundPage() {
  return (
    <NotFoundWrapper>
      <IconPatch
        icon={Icons.EYE_SLASH}
        className="mb-6 text-xl text-bink-600"
      />
      <Title>Couldn&apos;t find that page</Title>
      <p className="mt-5 mb-12 max-w-sm">
        We looked everywhere: under the bins, in the closet, behind the proxy
        but ultimately couldn&apos;t find the page you are looking for.
      </p>
      <ArrowLink to="/" linkText="Back to home" />
    </NotFoundWrapper>
  );
}
