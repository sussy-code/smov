import { FlagIcon } from "@/components/FlagIcon";
import { Dropdown } from "@/components/form/Dropdown";
import { Heading1 } from "@/components/utils/Text";
import { appLanguageOptions } from "@/setup/i18n";
import { sortLangCodes } from "@/utils/sortLangCodes";

export function LocalePart(props: {
  language: string;
  setLanguage: (l: string) => void;
}) {
  const sorted = sortLangCodes(appLanguageOptions.map((t) => t.code));

  const options = appLanguageOptions
    .sort((a, b) => sorted.indexOf(a.code) - sorted.indexOf(b.code))
    .map((opt) => ({
      id: opt.code,
      name: `${opt.name} — ${opt.nativeName}`,
      leftIcon: <FlagIcon countryCode={opt.code} />,
    }));

  const selected = options.find((t) => t.id === props.language);

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
        setSelectedItem={(opt) => props.setLanguage(opt.id)}
      />
    </div>
  );
}
