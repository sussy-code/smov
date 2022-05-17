import { ReactNode } from "react";

export interface PaperProps {
  children?: ReactNode,
  className?: string,
}

export function Paper(props: PaperProps) {
  return (
    <div className={`bg-denim-200 lg:rounded-xl px-4 sm:px-8 md:px-12 py-6 sm:py-8 md:py-12 ${props.className}`}>
      {props.children}
    </div>
  )
}
