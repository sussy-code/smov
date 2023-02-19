import { ReactNode } from "react";
import { Link as LinkRouter } from "react-router-dom";

interface ILinkPropsBase {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface ILinkPropsExternal extends ILinkPropsBase {
  url: string;
  newTab?: boolean;
}

interface ILinkPropsInternal extends ILinkPropsBase {
  to: string;
}

type LinkProps = ILinkPropsExternal | ILinkPropsInternal | ILinkPropsBase;

export function Link(props: LinkProps) {
  const isExternal = !!(props as ILinkPropsExternal).url;
  const isInternal = !!(props as ILinkPropsInternal).to;
  const content = (
    <span className="cursor-pointer font-bold text-bink-600 hover:text-bink-700">
      {props.children}
    </span>
  );

  if (isExternal)
    return (
      <a
        target={(props as ILinkPropsExternal).newTab ? "_blank" : undefined}
        rel="noreferrer"
        href={(props as ILinkPropsExternal).url}
      >
        {content}
      </a>
    );
  if (isInternal)
    return (
      <LinkRouter to={(props as ILinkPropsInternal).to}>{content}</LinkRouter>
    );
  return (
    <span onClick={() => props.onClick && props.onClick()}>{content}</span>
  );
}
