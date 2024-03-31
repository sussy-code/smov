import { useTranslation } from "react-i18next";
import { useAsync } from "react-use";

import { isExtensionActive } from "@/backend/extension/messaging";
import { Toggle } from "@/components/buttons/Toggle";
import { FlagIcon } from "@/components/FlagIcon";
import { Dropdown } from "@/components/form/Dropdown";
import { Heading1 } from "@/components/utils/Text";
import { appLanguageOptions } from "@/setup/i18n";
import { getLocaleInfo, sortLangCodes } from "@/utils/language";

function useIsExtensionActive() {
  const { loading, value } = useAsync(async () => {
    const extensionStatus = (await isExtensionActive()) ? "success" : "unset";
    return extensionStatus === "success";
  }, []);

  return {
    loading,
    active: value,
  };
}

export function PreferencesPart(props: {
  language: string;
  setLanguage: (l: string) => void;
  enableThumbnails: boolean;
  setEnableThumbnails: (v: boolean) => void;
  enableAutoplay: boolean;
  setEnableAutoplay: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const sorted = sortLangCodes(appLanguageOptions.map((item) => item.code));
  const { loading, active } = useIsExtensionActive();

  const extensionActive = active && !loading;

  const options = appLanguageOptions
    .sort((a, b) => sorted.indexOf(a.code) - sorted.indexOf(b.code))
    .map((opt) => ({
      id: opt.code,
      name: `${opt.name}${opt.nativeName ? ` — ${opt.nativeName}` : ""}`,
      leftIcon: <FlagIcon langCode={opt.code} />,
    }));

  const selected = options.find(
    (item) => item.id === getLocaleInfo(props.language)?.code,
  );

  return (
    <div className="space-y-12">
      <Heading1 border>{t("settings.preferences.title")}</Heading1>
      <div>
        <p className="text-white font-bold mb-3">
          {t("settings.preferences.language")}
        </p>
        <p className="max-w-[20rem] font-medium">
          {t("settings.preferences.languageDescription")}
        </p>
        <Dropdown
          options={options}
          selectedItem={selected || options[0]}
          setSelectedItem={(opt) => props.setLanguage(opt.id)}
        />
      </div>

      <div>
        <p className="text-white font-bold mb-3">
          {t("settings.preferences.thumbnail")}
        </p>
        <p className="max-w-[25rem] font-medium">
          {t("settings.preferences.thumbnailDescription")}
        </p>
        <div
          onClick={() => props.setEnableThumbnails(!props.enableThumbnails)}
          className="bg-dropdown-background hover:bg-dropdown-hoverBackground select-none my-4 cursor-pointer space-x-3 flex items-center max-w-[25rem] py-3 px-4 rounded-lg"
        >
          <Toggle enabled={props.enableThumbnails} />
          <p className="flex-1 text-white font-bold">
            {t("settings.preferences.thumbnailLabel")}
          </p>
        </div>
      </div>
      <div>
        <p className="text-white font-bold mb-3">
          {t("settings.preferences.autoplay")}
        </p>
        <p className="max-w-[25rem] font-medium">
          {t("settings.preferences.autoplayDescription")}
        </p>
        <div
          onClick={() =>
            extensionActive
              ? props.setEnableAutoplay(!props.enableAutoplay)
              : null
          }
          className="bg-dropdown-background hover:bg-dropdown-hoverBackground select-none my-4 cursor-pointer space-x-3 flex items-center max-w-[25rem] py-3 px-4 rounded-lg"
          style={{
            pointerEvents: extensionActive ? "auto" : "none",
            opacity: extensionActive ? 1 : 0.5,
            cursor: extensionActive ? "pointer" : "not-allowed",
          }}
        >
          <Toggle enabled={props.enableAutoplay && extensionActive} />
          <p className="flex-1 text-white font-bold">
            {t("settings.preferences.autoplayLabel")}
          </p>
        </div>
      </div>
    </div>
  );
}
