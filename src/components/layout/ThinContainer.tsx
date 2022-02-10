import { ReactNode } from "react";

interface ThinContainerProps {
  classNames?: string,
  children?: ReactNode,
}

export function ThinContainer(props: ThinContainerProps) {
  return (<div className={`max-w-[600px] mx-auto ${props.classNames || ""}`}>
    {props.children}
  </div>)
}
