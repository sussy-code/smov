import { ReactNode } from "react";

export interface PaperProps {
  children?: ReactNode;
  className?: string;
}

export function Paper(props: PaperProps) {
  return (
    <div
      className={`bg-denim-200 px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-12 lg:rounded-xl ${props.className}`}
    >
      {props.children}
    </div>
  );
}
