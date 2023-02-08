import { Icon, Icons } from "@/components/Icon";
import { ProgressRing } from "@/components/layout/ProgressRing";

interface PopoutListEntryTypes {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  isOnDarkBackground?: boolean;
  percentageCompleted?: number;
}

export function PopoutSection(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={["p-5", props.className || ""].join(" ")}>
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
          ? `${bg} text-white outline-denim-700`
          : "text-denim-700 hover:text-white",
      ].join(" ")}
      onClick={props.onClick}
    >
      {props.active && (
        <div className="absolute left-0 h-8 w-0.5 bg-bink-500" />
      )}
      <span className="truncate">{props.children}</span>
      <div className="relative h-4 w-4 min-w-[1rem]">
        <Icon
          className="absolute inset-0 translate-x-2 text-white opacity-0 transition-[opacity,transform] duration-100 group-hover:translate-x-0 group-hover:opacity-100"
          icon={Icons.CHEVRON_RIGHT}
        />
        {props.percentageCompleted ? (
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
