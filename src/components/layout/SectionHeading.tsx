import { Icon, Icons } from "components/Icon";
import { ArrowLink } from "components/Text/ArrowLink";
import { ReactNode } from "react";

interface SectionHeadingProps {
  icon?: Icons;
  title: string;
  children?: ReactNode;
  linkText?: string;
  onClick?: () => void;
}

export function SectionHeading(props: SectionHeadingProps) {
  return (
    <div className="mt-12">
      <div className="mb-4 flex items-end">
        <p className="text-denim-700 flex flex-1 items-center font-bold uppercase">
          {props.icon ? (
            <span className="mr-2 text-xl">
              <Icon icon={props.icon} />
            </span>
          ) : null}
          {props.title}
        </p>
        {props.linkText ? (
          <ArrowLink
            linkText={props.linkText}
            direction="left"
            onClick={props.onClick}
          />
        ) : null}
      </div>
      {props.children}
    </div>
  );
}
