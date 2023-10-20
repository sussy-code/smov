import { Icon, Icons } from "@/components/Icon";

export function Title(props: {
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

export function IconButton(props: { icon: Icons; onClick?: () => void }) {
  return (
    <button type="button" onClick={props.onClick}>
      <Icon className="text-xl" icon={props.icon} />
    </button>
  );
}

export function Divider() {
  return <hr className="!my-4 border-0 w-full h-px bg-video-context-border" />;
}

export function SmallText(props: { children: React.ReactNode }) {
  return <p className="text-sm mt-8 font-medium">{props.children}</p>;
}

export function Anchor(props: {
  children: React.ReactNode;
  onClick: () => void;
}) {
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

export function FieldTitle(props: { children: React.ReactNode }) {
  return <p className="font-medium">{props.children}</p>;
}
