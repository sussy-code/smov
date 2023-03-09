import { Dropdown, OptionItem } from "@/components/Dropdown";
import { useSettings } from "@/state/settings";

export function SettingsView() {
  const languages: OptionItem[] = [
    { id: "en", name: "English" },
    { id: "tr", name: "Turkish" },
  ];
  const {
    language,
    captionSettings,
    setLanguage,
    setCaptionBackgroundColor,
    setCaptionColor,
    setCaptionFontSize,
  } = useSettings();
  const selectedLanguage = languages.find((lang) => lang.id === language) || {
    id: "en",
    name: "English",
  };
  return (
    <div className="flex aspect-square flex-row pl-28">
      <div className="flex flex-col p-10">
        <label className="font-bold text-white">Language</label>
        <Dropdown
          setSelectedItem={(item) => setLanguage(item.id)}
          selectedItem={selectedLanguage}
          options={languages}
        />
      </div>
      <div className="flex flex-col p-10">
        <div className="font-bold text-white">Caption Settings</div>
        <div className="flex flex-row">
          <div className="flex flex-col">
            <label className="font-bold text-white" htmlFor="fontSize">
              Font Size
            </label>
            <input
              onChange={(e) => setCaptionFontSize(e.target.valueAsNumber)}
              type="range"
              name="fontSize"
              id="fontSize"
              max={40}
              min={10}
              value={captionSettings.style.fontSize}
            />
            <div className="flex flex-row justify-between">
              <label className="font-bold text-white" htmlFor="color">
                Color
              </label>
              <input
                className="ml-10"
                onChange={(e) => setCaptionColor(e.target.value)}
                type="color"
                name="color"
                id="color"
                value={captionSettings.style.color}
              />
            </div>
            <div className="flex flex-row justify-between">
              <label className="font-bold text-white" htmlFor="bgColor">
                Background Color
              </label>
              <input
                className="ml-10"
                onChange={(e) => setCaptionBackgroundColor(e.target.value)}
                type="color"
                name="bgColor"
                id="bgColor"
                value={captionSettings.style.backgroundColor}
              />
            </div>
          </div>
        </div>
        <div className="text-white">
          {JSON.stringify(captionSettings, null, "\t\t")}
        </div>
      </div>
    </div>
  );
}
