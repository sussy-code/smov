import classNames from "classnames";

export function SectionTitle(props: { children: React.ReactNode }) {
  return (
    <h3 className="uppercase font-bold text-video-context-type-secondary text-xs pt-8 pl-1 pb-2.5 border-b border-video-context-border">
      {props.children}
    </h3>
  );
}

export function Section(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={classNames("pt-4 space-y-1", props.className)}>
      {props.children}
    </div>
  );
}
