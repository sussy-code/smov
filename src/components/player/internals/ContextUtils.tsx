import classNames from "classnames";

import { Icon, Icons } from "@/components/Icon";

function Card(props: { children: React.ReactNode }) {
  return (
    <div className="h-full grid grid-rows-[1fr]">
      <div className="px-6 h-full overflow-y-auto overflow-x-hidden">
        {props.children}
      </div>
    </div>
  );
}

function CardWithScrollable(props: { children: React.ReactNode }) {
  return (
    <div className="[&>*]:px-6 h-full grid grid-rows-[auto,1fr] [&>*:nth-child(2)]:overflow-y-auto [&>*:nth-child(2)]:overflow-x-hidden">
      {props.children}
    </div>
  );
}

function SectionTitle(props: { children: React.ReactNode }) {
  return (
    <h3 className="uppercase font-bold text-video-context-type-secondary text-xs pt-8 pl-1 pb-2.5 border-b border-video-context-border">
      {props.children}
    </h3>
  );
}

function LinkTitle(props: { children: React.ReactNode; textClass?: string }) {
  return (
    <span
      className={classNames([
        "font-medium text-left",
        props.textClass || "text-video-context-type-main",
      ])}
    >
      <div>{props.children}</div>
    </span>
  );
}

function Section(props: { children: React.ReactNode; className?: string }) {
  return (
    <div className={classNames("pt-4 space-y-1", props.className)}>
      {props.children}
    </div>
  );
}

function Link(props: {
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  const classes = classNames(
    "flex justify-between items-center py-2 pl-3 pr-3 -ml-3 rounded w-full",
    {
      "cursor-default": !props.onClick,
      "hover:bg-video-context-border": !!props.onClick,
      "bg-video-context-border": props.active,
    }
  );
  const styles = { width: "calc(100% + 1.5rem)" };

  if (!props.onClick) {
    return (
      <div className={classes} style={styles}>
        {props.children}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      style={styles}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

function Title(props: {
  children: React.ReactNode;
  rightSide?: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-bold text-video-context-type-main pb-3 pt-5 border-b border-video-context-border flex justify-between items-center">
        <div className="flex items-center space-x-3">{props.children}</div>
        <div>{props.rightSide}</div>
      </h3>
    </div>
  );
}

function BackLink(props: {
  onClick?: () => void;
  children: React.ReactNode;
  rightSide?: React.ReactNode;
}) {
  return (
    <Title rightSide={props.rightSide}>
      <button
        type="button"
        className="-ml-2 p-2 rounded hover:bg-video-context-light hover:bg-opacity-10"
        onClick={props.onClick}
      >
        <Icon className="text-xl" icon={Icons.ARROW_LEFT} />
      </button>
      <span className="line-clamp-1 break-all">{props.children}</span>
    </Title>
  );
}

function LinkChevron(props: { children?: React.ReactNode }) {
  return (
    <span className="text-white flex items-center font-medium">
      {props.children}
      <Icon className="text-xl ml-1 -mr-1.5" icon={Icons.CHEVRON_RIGHT} />
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
  return <hr className="!my-4 border-0 w-full h-px bg-video-context-border" />;
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

function FieldTitle(props: { children: React.ReactNode }) {
  return <p className="font-medium">{props.children}</p>;
}

export const Context = {
  CardWithScrollable,
  SectionTitle,
  LinkChevron,
  IconButton,
  FieldTitle,
  SmallText,
  BackLink,
  LinkTitle,
  Section,
  Divider,
  Anchor,
  Title,
  Link,
  Card,
};
