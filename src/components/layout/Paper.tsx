import { ReactNode } from "react";

export interface PaperProps {
  children?: ReactNode,
  className?: string,
}

export function Paper(props: PaperProps) {
  return (
    <div className={`bg-denim-200 lg:rounded-xl p-12 ${props.className}`}>
      {props.children}
    </div>
  )
}
