import { ReactNode } from "react";

interface ThinContainerProps {
  classNames?: string;
  children?: ReactNode;
}

export function ThinContainer(props: ThinContainerProps) {
  return (
    <div
      className={`mx-auto w-[600px] max-w-full px-8 sm:px-0 ${
        props.classNames || ""
      }`}
    >
      {props.children}
    </div>
  );
}
