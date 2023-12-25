import classNames from "classnames";

export function Ol(props: { items: React.ReactNode[] }) {
  return (
    <ol>
      {props.items.map((child, i) => {
        return (
          <li
            className={classNames(
              "grid grid-cols-[auto,1fr] gap-6",
              i !== props.items.length - 1 ? "pb-12" : undefined,
            )}
          >
            <div className="relative z-0">
              <div className="w-7 h-7 rounded-full bg-about-circle text-about-circleText font-medium flex justify-center items-center relative z-10">
                {i + 1}
              </div>
              {i !== props.items.length - 1 ? (
                <div
                  className="h-[calc(100%+1.5rem)] w-px absolute top-6 left-1/2 transform -translate-x-1/2"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, transparent 5px, #1F1F29 5px, #1F1F29 10px)",
                    backgroundSize: "10px 10px",
                    backgroundRepeat: "Repeat",
                  }}
                />
              ) : null}
            </div>
            <div>{child}</div>
          </li>
        );
      })}
    </ol>
  );
}
