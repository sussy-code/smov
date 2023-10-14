import classNames from "classnames";

import { Icon, Icons } from "@/components/Icon";

function Card(props: { children: React.ReactNode }) {
  return <div className="px-6 py-0">{props.children}</div>;
}

function Title(props: { children: React.ReactNode }) {
  return (
    <h3 className="uppercase mt-8 font-bold text-video-context-type-secondary text-sm pl-1 pb-2.5 border-b border-opacity-25 border-video-context-border mb-6">
      {props.children}
    </h3>
  );
}

function LinkTitle(props: { children: React.ReactNode; textClass?: string }) {
  return (
    <span
      className={classNames([
        "font-medium",
        props.textClass || "text-video-context-type-main",
      ])}
    >
      <div>{props.children}</div>
    </span>
  );
}

function Section(props: { children: React.ReactNode }) {
  return <div className="my-5">{props.children}</div>;
}

function Link(props: {
  onClick?: () => void;
  children: React.ReactNode;
  noHover?: boolean;
}) {
  return (
    <button
      type="button"
      className={classNames([
        "flex justify-between items-center py-2 pl-3 pr-3 -ml-3 rounded w-full",
        props.noHover
          ? "cursor-default"
          : "hover:bg-video-context-border hover:bg-opacity-10",
      ])}
      style={{ width: "calc(100% + 1.5rem)" }}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

function BackLink(props: {
  onClick?: () => void;
  children: React.ReactNode;
  rightSide?: React.ReactNode;
}) {
  return (
    <h3 className="font-bold text-video-context-type-main pb-4 pt-5 border-b border-opacity-25 border-video-context-border mb-6 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          className="-ml-1 p-1 rounded hover:bg-video-context-light hover:bg-opacity-10"
          onClick={props.onClick}
        >
          <Icon className="text-xl" icon={Icons.ARROW_LEFT} />
        </button>
        <span>{props.children}</span>
      </div>
      <div>{props.rightSide}</div>
    </h3>
  );
}

function LinkChevron(props: { children?: React.ReactNode }) {
  return (
    <span className="text-white flex items-center font-medium">
      {props.children}
      <Icon className="text-xl ml-1" icon={Icons.CHEVRON_RIGHT} />
    </span>
  );
}

function IconButton(props: { icon: Icons; onClick?: () => void }) {
  return (
    <button type="button" onClick={props.onClick}>
      <Icon className="text-xl" icon={props.icon} />
    </button>
  );
}

function Divider() {
  return (
    <hr className="my-4 border-0 w-full h-px bg-video-context-border bg-opacity-25" />
  );
}

function SmallText(props: { children: React.ReactNode }) {
  return <p className="text-sm mt-8 font-medium">{props.children}</p>;
}

function Anchor(props: { children: React.ReactNode; onClick: () => void }) {
  return (
    <a
      type="button"
      className="text-video-context-type-accent cursor-pointer"
      onClick={props.onClick}
    >
      {props.children}
    </a>
  );
}

export const Context = {
  Card,
  Title,
  BackLink,
  Section,
  Link,
  LinkTitle,
  LinkChevron,
  IconButton,
  Divider,
  SmallText,
  Anchor,
};
