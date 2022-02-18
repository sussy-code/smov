import { Icon, Icons } from "components/Icon";
import { Link as LinkRouter } from "react-router-dom";

interface ILinkPropsBase {
  linkText: string;
  className?: string;
  onClick?: () => void;
  direction?: "left" | "right";
}

interface ILinkPropsExternal extends ILinkPropsBase {
  url: string;
}

interface ILinkPropsInternal extends ILinkPropsBase {
  to: string;
}

export type LinkProps =
  | ILinkPropsExternal
  | ILinkPropsInternal
  | ILinkPropsBase;

export function Link(props: LinkProps) {
  const direction = props.direction || "right";
  const isExternal = !!(props as ILinkPropsExternal).url;
  const isInternal = !!(props as ILinkPropsInternal).to;
  const content = (
    <span className="text-bink-600 hover:text-bink-700 group inline-flex cursor-pointer items-center space-x-1 font-bold active:scale-95">
      {direction === "left" ? (
        <span className="text-xl transition-transform group-hover:-translate-x-1">
          <Icon icon={Icons.ARROW_LEFT} />
        </span>
      ) : null}
      <span className="flex-1">{props.linkText}</span>
      {direction === "right" ? (
        <span className="text-xl transition-transform group-hover:translate-x-1">
          <Icon icon={Icons.ARROW_RIGHT} />
        </span>
      ) : null}
    </span>
  );

  if (isExternal)
    return <a href={(props as ILinkPropsExternal).url}>{content}</a>;
  else if (isInternal)
    return (
      <LinkRouter to={(props as ILinkPropsInternal).to}>{content}</LinkRouter>
    );
  return (
    <span onClick={() => props.onClick && props.onClick()}>{content}</span>
  );
}
