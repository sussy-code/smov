import { ReactNode } from "react";

interface WideContainerProps {
  classNames?: string;
  children?: ReactNode;
}

export function WideContainer(props: WideContainerProps) {
  return (
    <div
      className={`mx-auto w-[700px] max-w-full px-8 sm:px-4 ${
        props.classNames || ""
      }`}
    >
      {props.children}
    </div>
  );
}
