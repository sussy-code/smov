import { Icon, Icons } from "@/components/Icon";
import { Spinner } from "@/components/layout/Spinner";
import { ProgressRing } from "@/components/layout/ProgressRing";
import { createRef, useEffect, useRef } from "react";

interface PopoutListEntryTypes {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  isOnDarkBackground?: boolean;
  percentageCompleted?: number;
  loading?: boolean;
  errored?: boolean;
}

export function PopoutSection(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  const ref = createRef<HTMLDivElement>();
  const inited = useRef<boolean>(false);

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
      active.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });

      const activeYPositionCentered =
        active.getBoundingClientRect().top -
        wrapper.getBoundingClientRect().top +
        active.offsetHeight / 2;

      if (activeYPositionCentered >= wrapper.offsetHeight / 2) {
        // Check if the active element is below the vertical center line, then scroll it into center
        wrapper.scrollTo({
          top: activeYPositionCentered - wrapper.offsetHeight / 2,
        });
      }
    }
    inited.current = true;
  }, [ref]);

  return (
    <div className={["p-5", props.className || ""].join(" ")} ref={ref}>
      {props.children}
    </div>
  );
}

export function PopoutListEntry(props: PopoutListEntryTypes) {
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
      <div className="relative h-4 w-4 min-w-[1rem]">
        {props.errored && (
          <Icon
            icon={Icons.WARNING}
            className="absolute inset-0 text-rose-400"
          />
        )}
        {props.loading && !props.errored && (
          <Spinner className="absolute inset-0 text-base [--color:#9C93B5]" />
        )}
        {!props.loading && !props.errored && (
          <Icon
            className="absolute inset-0 translate-x-2 text-white opacity-0 transition-[opacity,transform] duration-100 group-hover:translate-x-0 group-hover:opacity-100"
            icon={Icons.CHEVRON_RIGHT}
          />
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
      </div>
    </div>
  );
}
