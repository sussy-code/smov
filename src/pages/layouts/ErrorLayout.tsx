import classNames from "classnames";
import { ReactNode } from "react";

export function ErrorContainer(props: {
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div
      className={classNames(
        "w-full p-6 text-center flex flex-col items-center",
        props.maxWidth ?? "max-w-[28rem]",
      )}
    >
      {props.children}
    </div>
  );
}

export function ErrorLayout(props: { children?: ReactNode }) {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      {props.children}
    </div>
  );
}
