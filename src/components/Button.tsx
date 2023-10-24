import classNames from "classnames";
import { ReactNode } from "react";
import { useHistory } from "react-router-dom";

import { Icon, Icons } from "@/components/Icon";

interface Props {
  icon?: Icons;
  onClick?: () => void;
  children?: ReactNode;
  theme?: "white" | "purple" | "secondary";
  padding?: string;
  className?: string;
  href?: string;
}

export function Button(props: Props) {
  const history = useHistory();

  let colorClasses = "bg-white hover:bg-gray-200 text-black";
  if (props.theme === "purple")
    colorClasses =
      "bg-video-buttons-purple hover:bg-video-buttons-purpleHover text-white";
  if (props.theme === "secondary")
    colorClasses =
      "bg-video-buttons-cancel hover:bg-video-buttons-cancelHover transition-colors duration-100 text-white";

  const classes = classNames(
    "cursor-pointer inline-flex items-center justify-center rounded-lg font-medium transition-[transform,background-color] duration-100 active:scale-105 md:px-8",
    props.padding ?? "px-4 py-3",
    props.className,
    colorClasses
  );

  const content = (
    <>
      {props.icon ? (
        <span className="mr-3 hidden md:inline-block">
          <Icon icon={props.icon} />
        </span>
      ) : null}
      {props.children}
    </>
  );

  function goTo(href: string) {
    history.push(href);
  }

  if (props.href && props.href.startsWith("https://"))
    return (
      <a className={classes} href={props.href} target="_blank" rel="noreferrer">
        {content}
      </a>
    );

  if (props.href)
    return (
      <a className={classes} onClick={() => goTo(props.href || "")}>
        {content}
      </a>
    );

  return (
    <button type="button" onClick={props.onClick} className={classes}>
      {content}
    </button>
  );
}

interface ButtonPlainProps {
  onClick?: () => void;
  children?: ReactNode;
  theme?: "white" | "purple" | "secondary";
  className?: string;
}

export function ButtonPlain(props: ButtonPlainProps) {
  let colorClasses = "bg-white hover:bg-gray-200 text-black";
  if (props.theme === "purple")
    colorClasses =
      "bg-video-buttons-purple hover:bg-video-buttons-purpleHover text-white";
  if (props.theme === "secondary")
    colorClasses =
      "bg-video-buttons-cancel hover:bg-video-buttons-cancelHover transition-colors duration-100 text-white";

  const classes = classNames(
    "cursor-pointer inline-flex items-center justify-center rounded-lg font-medium transition-[transform,background-color] duration-100 active:scale-105 md:px-8",
    "px-4 py-3",
    props.className,
    colorClasses
  );

  return (
    <button type="button" onClick={props.onClick} className={classes}>
      {props.children}
    </button>
  );
}
