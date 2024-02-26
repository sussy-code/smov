import classNames from "classnames";

export function Paragraph(props: {
  children: React.ReactNode;
  marginClass?: string;
}) {
  return (
    <p
      className={classNames(
        "text-errors-type-secondary",
        props.marginClass ?? "mt-6",
      )}
    >
      {props.children}
    </p>
  );
}
