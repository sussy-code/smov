import classNames from "classnames";
import "flag-icons/css/flag-icons.min.css";

export interface FlagIconProps {
  countryCode?: string;
}

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
  sv: "se",
  et: "ee",
  ne: "np",
  uk: "ua",
  hi: "in",
};

export function FlagIcon(props: FlagIconProps) {
  let countryCode =
    (props.countryCode || "")?.split("-").pop()?.toLowerCase() || "";
  if (countryOverrides[countryCode])
    countryCode = countryOverrides[countryCode];

  if (countryCode === "tok")
    return (
      <div className="w-8 h-6 rounded bg-[#c8e1ed] flex justify-center items-center">
        <img src="/tokiPona.svg" className="w-7 h-5" />
      </div>
    );

  if (countryCode === "pirate")
    return (
      <div className="w-8 h-6 rounded bg-[#2E3439] flex justify-center items-center">
        <img src="/skull.svg" className="w-4 h-4" />
      </div>
    );

  if (countryCode === "minion")
    return (
      <div className="w-8 h-6 rounded bg-[#ffff1a] flex justify-center items-center">
        <div className="w-4 h-4 border-2 border-gray-500 rounded-full bg-white flex justify-center items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-900 relative">
            <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full transform -translate-x-1/3 -translate-y-1/3" />
          </div>
        </div>
      </div>
    );

  let backgroundClass = "bg-video-context-flagBg";
  if (countryCode === "np") backgroundClass = "bg-white";

  return (
    <span
      className={classNames(
        "!w-8 h-6 rounded overflow-hidden bg-cover bg-center block fi",
        backgroundClass,
        props.countryCode ? `fi-${countryCode}` : undefined,
      )}
    />
  );
}
