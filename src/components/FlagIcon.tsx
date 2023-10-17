import classNames from "classnames";
import "flag-icons/css/flag-icons.min.css";

export interface FlagIconProps {
  countryCode?: string;
}

export function FlagIcon(props: FlagIconProps) {
  return (
    <span
      className={classNames(
        "!w-8 h-6 rounded overflow-hidden bg-video-context-flagBg bg-cover bg-center block fi",
        props.countryCode ? `fi-${props.countryCode}` : undefined
      )}
    />
  );
}
