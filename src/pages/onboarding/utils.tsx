import classNames from "classnames";
import { ReactNode } from "react";

import { Icon, Icons } from "@/components/Icon";
import { Heading2, Heading3, Paragraph } from "@/components/utils/Text";

export function Card(props: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      className="bg-onboarding-card hover:bg-onboarding-cardHover transition-colors duration-300 border border-onboarding-border rounded-lg p-7 cursor-pointer "
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}

export function CardContent(props: {
  title: ReactNode;
  description: ReactNode;
  subtitle: ReactNode;
  colorClass: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid grid-rows-[1fr,auto] h-full">
      <div>
        <Icon
          icon={Icons.RISING_STAR}
          className={classNames("text-4xl mb-8 block", props.colorClass)}
        />
        <Heading3
          className={classNames(
            "!mt-0 !mb-0 !text-xs uppercase",
            props.colorClass,
          )}
        >
          {props.subtitle}
        </Heading3>
        <Heading2 className="!mb-0 !mt-1 !text-base">{props.title}</Heading2>
        <Paragraph className="max-w-[320px] !my-4">
          {props.description}
        </Paragraph>
      </div>
      <div>{props.children}</div>
    </div>
  );
}

export function Link(props: { children: React.ReactNode }) {
  return (
    <a className="text-onboarding-link cursor-pointer flex gap-2 items-center group hover:opacity-75 transition-opacity">
      {props.children}
      <Icon
        icon={Icons.ARROW_RIGHT}
        className="group-hover:translate-x-0.5 transition-transform text-xl group-active:translate-x-0"
      />
    </a>
  );
}
