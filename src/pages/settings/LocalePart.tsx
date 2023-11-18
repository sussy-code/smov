import { Dropdown } from "@/components/Dropdown";
import { FlagIcon } from "@/components/FlagIcon";
import { Heading1 } from "@/components/utils/Text";
import { appLanguageOptions } from "@/setup/i18n";
import { useLanguageStore } from "@/stores/language";
import { sortLangCodes } from "@/utils/sortLangCodes";

export function LocalePart() {
  const sorted = sortLangCodes(appLanguageOptions.map((t) => t.id));
  const { language, setLanguage } = useLanguageStore();

  const options = appLanguageOptions
    .sort((a, b) => sorted.indexOf(a.id) - sorted.indexOf(b.id))
    .map((opt) => ({
      id: opt.id,
      name: `${opt.englishName} — ${opt.nativeName}`,
      leftIcon: <FlagIcon countryCode={opt.id} />,
    }));

  const selected = options.find((t) => t.id === language);

  return (
    <div>
      <Heading1 border>Locale</Heading1>
      <p className="text-white font-bold mb-3">Application language</p>
      <p className="max-w-[20rem] font-medium">
        Language applied to the entire application.
      </p>
      <Dropdown
        options={options}
        selectedItem={selected || options[0]}
        setSelectedItem={(opt) => setLanguage(opt.id)}
      />
    </div>
  );
}
