import { ReactNode } from "react";

interface WideContainerProps {
  classNames?: string;
  children?: ReactNode;
  ultraWide?: boolean;
}

export function WideContainer(props: WideContainerProps) {
  return (
    <div
      className={`mx-auto max-w-full px-8 ${
        props.ultraWide
          ? "w-[1300px] 2xl:w-[2000px] 3xl:w-[2400px] 4xl:w-[2800px]"
          : "w-[900px] 2xl:w-[1400px] 3xl:w-[1600px] 4xl:w-[1800px]"
      } ${props.classNames || ""}`}
    >
      {props.children}
    </div>
  );
}
