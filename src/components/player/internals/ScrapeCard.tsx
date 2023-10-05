import classNames from "classnames";
import { ReactNode } from "react";

import { StatusCircle } from "@/components/player/internals/StatusCircle";
import { Transition } from "@/components/Transition";

export interface ScrapeItemProps {
  status: "failure" | "pending" | "notfound" | "success" | "waiting";
  name: string;
  id?: string;
  percentage?: number;
  children?: ReactNode;
}

export interface ScrapeCardProps extends ScrapeItemProps {
  hasChildren?: boolean;
}

const statusTextMap: Partial<Record<ScrapeCardProps["status"], string>> = {
  notfound: "Doesn't have the video",
  failure: "Error occured",
  pending: "Checking for videos...",
};

const statusMap: Record<ScrapeCardProps["status"], StatusCircle["type"]> = {
  failure: "error",
  notfound: "noresult",
  pending: "loading",
  success: "success",
  waiting: "waiting",
};

export function ScrapeItem(props: ScrapeItemProps) {
  const text = statusTextMap[props.status];
  const status = statusMap[props.status];

  return (
    <div className="grid gap-6 grid-cols-[auto,1fr]" data-source-id={props.id}>
      <StatusCircle type={status} percentage={props.percentage ?? 0} />
      <div>
        <p className="font-bold text-white">{props.name}</p>
        <div className="h-4">
          <Transition animation="fade" show={!!text}>
            <p>{text}</p>
          </Transition>
        </div>
        {props.children}
      </div>
    </div>
  );
}

export function ScrapeCard(props: ScrapeCardProps) {
  return (
    <div
      data-source-id={props.id}
      className={classNames({
        "!bg-opacity-100": props.hasChildren,
        "w-72 rounded-md p-6 bg-video-scraping-card bg-opacity-0": true,
      })}
    >
      <ScrapeItem {...props} />
    </div>
  );
}
