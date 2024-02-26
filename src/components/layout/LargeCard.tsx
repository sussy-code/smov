import classNames from "classnames";

export function LargeCard(props: {
  children: React.ReactNode;
  top?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      {props.top ? (
        <div className="inline-block transform translate-y-1/2">
          {props.top}
        </div>
      ) : null}
      <div className="w-full rounded-xl bg-largeCard-background bg-opacity-50 max-w-[600px] mx-auto p-[3rem]">
        {props.children}
      </div>
    </div>
  );
}

export function LargeCardText(props: {
  title: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      <div className="flex flex-col items-center text-center max-w-[318px]">
        {props.icon ? (
          <div className="text-2xl mb-4 text-largeCard-icon">{props.icon}</div>
        ) : null}
        <h2 className="text-xl text-white font-bold">{props.title}</h2>
        {props.children ? (
          <div className="text-type-text mt-4">{props.children}</div>
        ) : null}
      </div>
    </div>
  );
}

export function LargeCardButtons(props: {
  children: React.ReactNode;
  splitAlign?: boolean;
}) {
  return (
    <div className="mt-12">
      <div
        className={classNames("mx-auto", {
          "flex flex-row-reverse justify-between items-center":
            props.splitAlign,
          "flex max-w-xs flex-col-reverse gap-3": !props.splitAlign,
        })}
      >
        {props.children}
      </div>
    </div>
  );
}
