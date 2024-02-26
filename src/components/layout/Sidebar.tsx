import classNames from "classnames";

import { Icon, Icons } from "@/components/Icon";

export function SidebarSection(props: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={props.className ?? ""}>
      <p className="text-sm font-bold uppercase text-settings-sidebar-type-secondary mb-2">
        {props.title}
      </p>
      {props.children}
    </section>
  );
}

export function SidebarLink(props: {
  children: React.ReactNode;
  icon: Icons;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={classNames(
        "tabbable w-full px-3 py-2 flex items-center space-x-3 cursor-pointer rounded my-2",
        props.active
          ? "bg-settings-sidebar-activeLink text-settings-sidebar-type-activated"
          : null,
      )}
    >
      <Icon
        className={classNames(
          "text-2xl text-settings-sidebar-type-icon",
          props.active ? "text-settings-sidebar-type-iconActivated" : null,
        )}
        icon={props.icon}
      />
      <span>{props.children}</span>
    </button>
  );
}
