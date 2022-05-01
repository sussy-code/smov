import { ReactNode } from "react";

interface ThinContainerProps {
  classNames?: string;
  children?: ReactNode;
}

export function ThinContainer(props: ThinContainerProps) {
  return (
    <div
      className={`max-w-[600px] mx-auto px-2 sm:px-0 ${props.classNames || ""}`}
    >
      {props.children}
    </div>
  );
}
