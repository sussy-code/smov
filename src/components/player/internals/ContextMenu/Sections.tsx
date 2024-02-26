import classNames from "classnames";
import { useEffect, useRef } from "react";

export function SectionTitle(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={classNames(
        "uppercase font-bold text-video-context-type-secondary text-xs pt-8 pl-1 pb-2.5 border-b border-video-context-border",
        props.className,
      )}
    >
      {props.children}
    </h3>
  );
}

export function Section(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={classNames("pt-4 space-y-1", props.className)}>
      {props.children}
    </div>
  );
}

export function ScrollToActiveSection(props: {
  children: React.ReactNode;
  className?: string;
  loaded?: boolean;
}) {
  const scrollingContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const active =
      scrollingContainer.current?.querySelector("[data-active-link]");

    const boxRect = scrollingContainer.current?.getBoundingClientRect();
    const activeLinkRect = active?.getBoundingClientRect();
    if (!activeLinkRect || !boxRect) return;

    const activeYPos = activeLinkRect.top - boxRect.top;

    scrollingContainer.current?.scrollTo(
      0,
      activeYPos - boxRect.height / 2 + activeLinkRect.height / 2,
    );
  }, [props.loaded]);

  return (
    <div
      ref={scrollingContainer}
      className={classNames("pt-4 space-y-1", props.className)}
    >
      {props.children}
    </div>
  );
}
