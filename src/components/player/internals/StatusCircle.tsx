import { a, to, useSpring } from "@react-spring/web";
import classNames from "classnames";

import { Icon, Icons } from "@/components/Icon";
import { Transition } from "@/components/utils/Transition";

export interface StatusCircleProps {
  type: "loading" | "success" | "error" | "noresult" | "waiting";
  percentage?: number;
  className?: string;
}

export interface StatusCircleLoading extends StatusCircleProps {
  type: "loading";
  percentage: number;
}

function statusIsLoading(
  props: StatusCircleProps | StatusCircleLoading,
): props is StatusCircleLoading {
  return props.type === "loading";
}

export function StatusCircle(props: StatusCircleProps | StatusCircleLoading) {
  const [spring] = useSpring(
    () => ({
      percentage: statusIsLoading(props) ? props.percentage : 0,
    }),
    [props],
  );

  return (
    <div
      className={classNames(
        {
          "p-0.5 border-current border-[3px] rounded-full h-6 w-6 relative transition-colors":
            true,
          "text-video-scraping-loading": props.type === "loading",
          "text-video-scraping-noresult text-opacity-50":
            props.type === "waiting",
          "text-video-scraping-error bg-video-scraping-error":
            props.type === "error",
          "text-green-500 bg-green-500": props.type === "success",
          "text-video-scraping-noresult bg-video-scraping-noresult":
            props.type === "noresult",
        },
        props.className,
      )}
    >
      <Transition animation="fade" show={statusIsLoading(props)}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          className="rounded-full -rotate-90"
        >
          <a.circle
            strokeWidth="32"
            strokeDasharray={to(spring.percentage, (val) => `${val} 100`)}
            r="25%"
            cx="50%"
            cy="50%"
            fill="transparent"
            stroke="currentColor"
            className="transition-[strokeDasharray]"
          />
        </svg>
      </Transition>
      <Transition animation="fade" show={props.type === "error"}>
        <Icon
          className="absolute inset-0 flex items-center justify-center text-background-main"
          icon={Icons.X}
        />
      </Transition>
      <Transition animation="fade" show={props.type === "success"}>
        <Icon
          className="absolute inset-0 flex items-center text-sm justify-center text-background-main"
          icon={Icons.CHECKMARK}
        />
      </Transition>
      <Transition animation="fade" show={props.type === "noresult"}>
        <div className="absolute inset-0 flex items-center">
          <div className="h-[3px] flex-1 mx-1 rounded-full bg-background-main" />
        </div>
      </Transition>
    </div>
  );
}
