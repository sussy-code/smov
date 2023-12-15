import { ReactNode } from "react";
import { Link as LinkRouter } from "react-router-dom";

export function MwLink(props: {
  children?: ReactNode;
  to?: string;
  url?: string;
  onClick?: () => void;
}) {
  const isExternal = !!props.url;
  const isInternal = !!props.to;
  const content = (
    <span className="group mt-1 cursor-pointer font-bold text-type-link hover:text-type-linkHover active:scale-95">
      {props.children}
    </span>
  );

  if (isExternal) return <a href={props.url}>{content}</a>;
  if (isInternal) return <LinkRouter to={props.to ?? ""}>{content}</LinkRouter>;
  return (
    <span onClick={() => props.onClick && props.onClick()}>{content}</span>
  );
}
