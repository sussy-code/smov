import { createRef, useEffect, useRef } from "react";

import { Icon, Icons } from "@/components/Icon";
import { ProgressRing } from "@/components/layout/ProgressRing";
import { Spinner } from "@/components/layout/Spinner";

interface PopoutListEntryBaseTypes {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  isOnDarkBackground?: boolean;
}

interface PopoutListEntryTypes extends PopoutListEntryBaseTypes {
  percentageCompleted?: number;
  loading?: boolean;
  errored?: boolean;
}

interface PopoutListEntryRootTypes extends PopoutListEntryBaseTypes {
  right?: React.ReactNode;
  noChevron?: boolean;
}

interface PopoutListActionTypes extends PopoutListEntryBaseTypes {
  icon?: Icons;
  right?: React.ReactNode;
  download?: string;
  href?: string;
  noChevron?: boolean;
}

interface ScrollToActiveProps {
  children: React.ReactNode;
  className?: string;
}

interface PopoutSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export function ScrollToActive(props: ScrollToActiveProps) {
  const ref = createRef<HTMLDivElement>();
  const inited = useRef<boolean>(false);

  const SAFE_OFFSET = 30;

  // Scroll to "active" child on first load (AKA mount except React dumb)
  useEffect(() => {
    if (inited.current) return;
    if (!ref.current) return;

    const el = ref.current as HTMLDivElement;

    // Find nearest scroll container, or self
    const wrapper: HTMLDivElement | null = el.classList.contains(
      "overflow-y-auto"
    )
      ? el
      : el.closest(".overflow-y-auto");

    const active: HTMLDivElement | null | undefined =
      wrapper?.querySelector(".active");

    if (wrapper && active) {
      let wrapperHeight = 0;
      let activePos = 0;
      let activeHeight = 0;
      let wrapperScroll = 0;

      const getCoords = () => {
        const activeRect = active.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();
        wrapperHeight = wrapperRect.height;
        activeHeight = activeRect.height;
        activePos = activeRect.top - wrapperRect.top + wrapper.scrollTop;
        wrapperScroll = wrapper.scrollTop;
      };
      getCoords();

      const isVisible =
        activePos + activeHeight <
          wrapperScroll + wrapperHeight - SAFE_OFFSET ||
        activePos > wrapperScroll + SAFE_OFFSET;
      if (isVisible) {
        const activeMiddlePos = activePos + activeHeight / 2; // pos of middle of active element
        const viewMiddle = wrapperHeight / 2; // half of the available height
        const pos = activeMiddlePos - viewMiddle;
        wrapper.scrollTo({
          top: pos,
        });
      }
    }
    inited.current = true;
  }, [ref]);

  return (
    <div className={props.className} ref={ref}>
      {props.children}
    </div>
  );
}

export function PopoutSection(props: PopoutSectionProps) {
  return (
    <ScrollToActive className={["p-5", props.className || ""].join(" ")}>
      {props.children}
    </ScrollToActive>
  );
}

export function PopoutListEntryBase(props: PopoutListEntryRootTypes) {
  const bg = props.isOnDarkBackground ? "bg-ash-200" : "bg-ash-400";
  const hover = props.isOnDarkBackground
    ? "hover:bg-ash-200"
    : "hover:bg-ash-400";

  return (
    <div
      className={[
        "group -mx-2 flex cursor-pointer items-center justify-between space-x-1 rounded p-2 font-semibold transition-[background-color,color] duration-150",
        hover,
        props.active
          ? `${bg} active text-white outline-denim-700`
          : "text-denim-700 hover:text-white",
      ].join(" ")}
      onClick={props.onClick}
    >
      {props.active && (
        <div className="absolute left-0 h-8 w-0.5 bg-bink-500" />
      )}
      <span className="truncate">{props.children}</span>
      <div className="relative min-h-[1rem] min-w-[1rem]">
        {!props.noChevron && (
          <Icon
            className="absolute inset-0 translate-x-2 text-white opacity-0 transition-[opacity,transform] duration-100 group-hover:translate-x-0 group-hover:opacity-100"
            icon={Icons.CHEVRON_RIGHT}
          />
        )}
        {props.right}
      </div>
    </div>
  );
}

export function PopoutListEntry(props: PopoutListEntryTypes) {
  return (
    <PopoutListEntryBase
      isOnDarkBackground={props.isOnDarkBackground}
      active={props.active}
      onClick={props.onClick}
      noChevron={props.loading || props.errored}
      right={
        <>
          {props.errored && (
            <Icon
              icon={Icons.WARNING}
              className="absolute inset-0 text-rose-400"
            />
          )}
          {props.loading && !props.errored && (
            <Spinner className="absolute inset-0 text-base [--color:#9C93B5]" />
          )}
          {props.percentageCompleted && !props.loading && !props.errored ? (
            <ProgressRing
              className="absolute inset-0 text-bink-600 opacity-100 transition-[opacity] group-hover:opacity-0"
              backingRingClassname="stroke-ash-500"
              percentage={
                props.percentageCompleted > 90 ? 100 : props.percentageCompleted
              }
            />
          ) : (
            ""
          )}
        </>
      }
    >
      {props.children}
    </PopoutListEntryBase>
  );
}

export function PopoutListAction(props: PopoutListActionTypes) {
  const entry = (
    <PopoutListEntryBase
      active={props.active}
      isOnDarkBackground={props.isOnDarkBackground}
      right={props.right}
      onClick={props.href ? undefined : props.onClick}
      noChevron={props.noChevron}
    >
      <div className="flex items-center space-x-3">
        {props.icon ? <Icon className="text-xl" icon={props.icon} /> : null}
        <div>{props.children}</div>
      </div>
    </PopoutListEntryBase>
  );

  return props.href ? (
    <a
      href={props.href ? props.href : undefined}
      rel="noreferrer"
      target="_blank"
      download={props.download ? props.download : undefined}
      onClick={props.onClick}
    >
      {entry}
    </a>
  ) : (
    entry
  );
}
