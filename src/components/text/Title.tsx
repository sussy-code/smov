import classNames from "classnames";

export function Title(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={classNames(
        "text-white text-3xl font-bold text-opacity-100 mt-6",
        props.className,
      )}
    >
      {props.children}
    </h2>
  );
}
