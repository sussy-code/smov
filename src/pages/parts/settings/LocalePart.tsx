import { useTranslation } from "react-i18next";

import { FlagIcon } from "@/components/FlagIcon";
import { Dropdown } from "@/components/form/Dropdown";
import { Heading1 } from "@/components/utils/Text";
import { appLanguageOptions } from "@/setup/i18n";
import { sortLangCodes } from "@/utils/sortLangCodes";

export function LocalePart(props: {
  language: string;
  setLanguage: (l: string) => void;
}) {
  const { t } = useTranslation();
  const sorted = sortLangCodes(appLanguageOptions.map((item) => item.code));

  const options = appLanguageOptions
    .sort((a, b) => sorted.indexOf(a.code) - sorted.indexOf(b.code))
    .map((opt) => ({
      id: opt.code,
      name: `${opt.name} — ${opt.nativeName}`,
      leftIcon: <FlagIcon countryCode={opt.code} />,
    }));

  const selected = options.find((item) => item.id === props.language);

  return (
    <div>
      <Heading1 border>{t("settings.locale.title")}</Heading1>
      <p className="text-white font-bold mb-3">
        {t("settings.locale.language")}
      </p>
      <p className="max-w-[20rem] font-medium">
        {t("settings.locale.languageDescription")}
      </p>
      <Dropdown
        options={options}
        selectedItem={selected || options[0]}
        setSelectedItem={(opt) => props.setLanguage(opt.id)}
      />
    </div>
  );
}
