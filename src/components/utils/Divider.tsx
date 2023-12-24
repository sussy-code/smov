import classNames from "classnames";

export function Divider(props: { marginClass?: string }) {
  return (
    <hr
      className={classNames(
        "w-full h-px border-0 bg-utils-divider bg-opacity-50",
        props.marginClass ?? "my-8",
      )}
    />
  );
}
