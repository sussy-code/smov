import { Icon, Icons } from "components/Icon";
import { ReactNode } from "react";

interface SectionHeadingProps {
  icon?: Icons;
  title: string;
  children?: ReactNode;
}

export function SectionHeading(props: SectionHeadingProps) {
  return (
    <div className="mt-12">
      <p className="text-denim-700 mb-4 flex items-center font-bold uppercase">
        {props.icon ? (
          <span className="mr-2 text-xl">
            <Icon icon={props.icon} />
          </span>
        ) : null}
        {props.title}
      </p>
      {props.children}
    </div>
  );
}
