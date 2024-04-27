import classNames from "classnames";
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

export function ThiccContainer(props: ThinContainerProps) {
  return (
    <div
      className={`mx-auto w-[980px] max-w-full px-6 sm:px-0 ${
        props.classNames || ""
      }`}
    >
      {props.children}
    </div>
  );
}

export function CenterContainer(props: ThinContainerProps) {
  return (
    <div
      className={classNames(
        "min-h-screen w-full flex justify-center p-8 py-24 items-center",
        props.classNames,
      )}
    >
      <div className="w-[700px] max-w-full">{props.children}</div>
    </div>
  );
}
