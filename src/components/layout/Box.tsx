import { ReactNode } from "react";

export function Box(props: { children?: ReactNode }) {
  return (
    <div className="bg-video-scraping-card rounded-xl p-8">
      {props.children}
    </div>
  );
}
