import classNames from "classnames";
import "flag-icons/css/flag-icons.min.css";

export interface FlagIconProps {
  countryCode?: string;
}

export function FlagIcon(props: FlagIconProps) {
  // Country code overrides
  const countryOverrides: Record<string, string> = {
    en: "gb",
    cs: "cz",
    el: "gr",
    fa: "ir",
    ko: "kr",
    he: "il",
    ze: "cn",
    ar: "sa",
    ja: "jp",
    bs: "ba",
    vi: "vn",
    zh: "cn",
    sl: "si",
  };

  let countryCode =
    (props.countryCode || "")?.split("-").pop()?.toLowerCase() || "";
  if (countryOverrides[countryCode])
    countryCode = countryOverrides[countryCode];

  if (countryCode === "pirate")
    return (
      <div className="w-8 h-6 rounded bg-[#2E3439] flex justify-center items-center">
        <img src="/skull.svg" className="w-4 h-4" />
      </div>
    );

  return (
    <span
      className={classNames(
        "!w-8 h-6 rounded overflow-hidden bg-video-context-flagBg bg-cover bg-center block fi",
        props.countryCode ? `fi-${countryCode}` : undefined
      )}
    />
  );
}
