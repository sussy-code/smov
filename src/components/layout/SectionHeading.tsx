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
      <p className="flex items-center uppercase font-bold text-denim-700 mb-3">
        {props.icon ? (
          <span className="text-xl mr-2">
            <Icon icon={props.icon} />
          </span>
        ) : null}
        {props.title}
      </p>
      {props.children}
    </div>
  );
}
