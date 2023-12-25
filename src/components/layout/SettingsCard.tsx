import classNames from "classnames";

export function SettingsCard(props: {
  children: React.ReactNode;
  className?: string;
  paddingClass?: string;
}) {
  return (
    <div
      className={classNames(
        "w-full rounded-lg bg-settings-card-background bg-opacity-[0.15] border border-settings-card-border",
        props.paddingClass ?? "px-8 py-6",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

export function SolidSettingsCard(props: {
  children: React.ReactNode;
  className?: string;
  paddingClass?: string;
}) {
  return (
    <div
      className={classNames(
        "w-full rounded-lg bg-settings-card-altBackground bg-opacity-50",
        props.paddingClass ?? "px-8 py-6",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
