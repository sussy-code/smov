import classNames from "classnames";

import { getCountryCodeForLocale } from "@/utils/language";
import "flag-icons/css/flag-icons.min.css";

export interface FlagIconProps {
  country?: string;
  langCode?: string;
}

export function FlagIcon(props: FlagIconProps) {
  let countryCode: string | null = props.country ?? null;
  if (props.langCode) countryCode = getCountryCodeForLocale(props.langCode);

  if (props.langCode === "tok")
    return (
      <div className="w-8 h-6 rounded bg-[#c8e1ed] flex justify-center items-center">
        <img src="/flags/tokiPona.svg" className="w-7 h-5" />
      </div>
    );

  if (props.langCode === "pirate")
    return (
      <div className="w-8 h-6 rounded bg-[#2E3439] flex justify-center items-center">
        <img src="/flags/skull.svg" className="w-4 h-4" />
      </div>
    );

  if (props.langCode === "cat")
    return (
      <div className="w-8 h-6 rounded bg-[#505050] flex justify-center items-center">
        <img src="/flags/cat.png" className="w-4 h-4" />
      </div>
    );

  if (props.langCode === "uwu")
    return (
      <div className="w-8 h-6 rounded bg-[#222] flex justify-center items-center">
        <img src="/flags/uwu.png" className="w-6 h-6" />
      </div>
    );

  if (props.langCode === "minion")
    return (
      <div className="w-8 h-6 rounded bg-[#ffff1a] flex justify-center items-center">
        <div className="w-4 h-4 border-2 border-gray-500 rounded-full bg-white flex justify-center items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-900 relative">
            <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full transform -translate-x-1/3 -translate-y-1/3" />
          </div>
        </div>
      </div>
    );

  if (props.langCode === "futhark")
    return (
      <div className="w-8 h-6 rounded bg-gray-800 flex flex-col">
        <div className="flex-1 bg-brown-800" />
        <div className="h-2 bg-yellow-600 flex justify-center items-center">
          <span className="text-white text-lg translate-y-[-2px] font-bold z-50">
            ᚠ
          </span>
        </div>
        <div className="flex-1 bg-gray-600" />
      </div>
    );

  // Galicia - Not a country (Is a region of Spain) so have to add the flag manually
  if (props.langCode === "gl-ES")
    return (
      <div className="w-8 h-6 rounded bg-[#2E3439] flex justify-center items-center">
        <img src="/flags/galicia.svg" className="rounded" />
      </div>
    );

  let backgroundClass = "bg-video-context-flagBg";
  if (countryCode === "np") backgroundClass = "bg-white";

  return (
    <span
      className={classNames(
        "!w-8 min-w-8 h-6 rounded overflow-hidden bg-cover bg-center block fi",
        backgroundClass,
        countryCode ? `fi-${countryCode}` : undefined,
      )}
    />
  );
}
