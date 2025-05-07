import classNames from "classnames";

export function VerticalLine(props: { className?: string }) {
  return (
    <div className={classNames("w-full grid justify-center", props.className)}>
      <div className="w-px h-10 bg-onboarding-divider" />
    </div>
  );
}
