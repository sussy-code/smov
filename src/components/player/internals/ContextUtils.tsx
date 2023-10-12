import { Icon, Icons } from "@/components/Icon";

function Card(props: { children: React.ReactNode }) {
  return <div className="px-6 py-8">{props.children}</div>;
}

function Title(props: { children: React.ReactNode }) {
  return (
    <h3 className="uppercase font-bold text-video-context-type-secondary text-sm pl-1 pb-2 border-b border-opacity-25 border-video-context-border mb-6">
      {props.children}
    </h3>
  );
}

function Section(props: { children: React.ReactNode }) {
  return <div className="my-5">{props.children}</div>;
}

function Link(props: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex justify-between items-center py-2 pl-3 pr-3 -ml-3 rounded hover:bg-video-context-border hover:bg-opacity-10 w-full"
      style={{ width: "calc(100% + 1.5rem)" }}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

function LinkTitle(props: { children: React.ReactNode }) {
  return (
    <span className="text-video-context-type-main font-medium">
      {props.children}
    </span>
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

export const Context = {
  Card,
  Title,
  Section,
  Link,
  LinkTitle,
  LinkChevron,
};
