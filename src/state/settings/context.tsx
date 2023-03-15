import { useStore } from "@/utils/storage";
import { createContext, ReactNode, useContext, useMemo } from "react";
import { SettingsStore } from "./store";
import { MWSettingsData } from "./types";

interface MWSettingsDataSetters {
  setLanguage(language: string): void;
  setCaptionDelay(delay: number): void;
  setCaptionColor(color: string): void;
  setCaptionFontSize(size: number): void;
  setCaptionFontFamily(fontFamily: string): void;
  setCaptionTextShadow(textShadow: string): void;
  setCaptionBackgroundColor(backgroundColor: string): void;
}
type MWSettingsDataWrapper = MWSettingsData & MWSettingsDataSetters;
const SettingsContext = createContext<MWSettingsDataWrapper>(null as any);
export function SettingsProvider(props: { children: ReactNode }) {
  function enforceRange(min: number, value: number, max: number) {
    return Math.max(min, Math.min(value, max));
  }
  const [settings, setSettings] = useStore(SettingsStore);

  const context: MWSettingsDataWrapper = useMemo(() => {
    const settingsContext: MWSettingsDataWrapper = {
      ...settings,
      setLanguage(language) {
        setSettings((oldSettings) => {
          return {
            ...oldSettings,
            language,
          };
        });
      },
      setCaptionDelay(delay: number) {
        setSettings((oldSettings) => {
          const captionSettings = oldSettings.captionSettings;
          captionSettings.delay = enforceRange(-10, delay, 10);
          const newSettings = oldSettings;
          return newSettings;
        });
      },
      setCaptionColor(color) {
        setSettings((oldSettings) => {
          const style = oldSettings.captionSettings.style;
          style.color = color;
          const newSettings = oldSettings;
          return newSettings;
        });
      },
      setCaptionFontSize(size) {
        setSettings((oldSettings) => {
          const style = oldSettings.captionSettings.style;
          style.fontSize = enforceRange(10, size, 30);
          const newSettings = oldSettings;
          return newSettings;
        });
      },
      setCaptionFontFamily(fontFamily) {
        setSettings((oldSettings) => {
          const captionStyle = oldSettings.captionSettings.style;
          captionStyle.fontFamily = fontFamily;
          const newSettings = oldSettings;
          return newSettings;
        });
      },
      setCaptionTextShadow(textShadow) {
        setSettings((oldSettings) => {
          const captionStyle = oldSettings.captionSettings.style;
          captionStyle.textShadow = textShadow;
          const newSettings = oldSettings;
          return newSettings;
        });
      },
      setCaptionBackgroundColor(backgroundColor) {
        setSettings((oldSettings) => {
          const style = oldSettings.captionSettings.style;
          style.backgroundColor = backgroundColor;
          const newSettings = oldSettings;
          return newSettings;
        });
      },
    };
    return settingsContext;
  }, [settings, setSettings]);
  return (
    <SettingsContext.Provider value={context}>
      {props.children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

export default SettingsContext;
