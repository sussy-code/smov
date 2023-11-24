import { useCallback, useEffect, useMemo, useState } from "react";

import { SubtitleStyling } from "@/stores/subtitles";

export function useDerived<T>(
  initial: T
): [T, (v: T) => void, () => void, boolean] {
  const [overwrite, setOverwrite] = useState<T | undefined>(undefined);
  useEffect(() => {
    setOverwrite(undefined);
  }, [initial]);

  const changed = overwrite !== initial && overwrite !== undefined;
  const data = overwrite === undefined ? initial : overwrite;

  const reset = useCallback(() => setOverwrite(undefined), [setOverwrite]);

  return [data, setOverwrite, reset, changed];
}

export function useSettingsState(
  theme: string | null,
  appLanguage: string,
  subtitleStyling: SubtitleStyling,
  deviceName?: string
) {
  const [themeState, setTheme, resetTheme, themeChanged] = useDerived(theme);
  const [
    appLanguageState,
    setAppLanguage,
    resetAppLanguage,
    appLanguageChanged,
  ] = useDerived(appLanguage);
  const [subStylingState, setSubStyling, resetSubStyling, subStylingChanged] =
    useDerived(subtitleStyling);
  const [
    deviceNameState,
    setDeviceNameState,
    resetDeviceName,
    deviceNameChanged,
  ] = useDerived(deviceName);

  function reset() {
    resetTheme();
    resetAppLanguage();
    resetSubStyling();
    resetDeviceName();
  }

  const changed = useMemo(
    () =>
      themeChanged ||
      appLanguageChanged ||
      subStylingChanged ||
      deviceNameChanged,
    [themeChanged, appLanguageChanged, subStylingChanged, deviceNameChanged]
  );

  return {
    reset,
    changed,
    theme: {
      state: themeState,
      set: setTheme,
    },
    appLanguage: {
      state: appLanguageState,
      set: setAppLanguage,
    },
    subtitleStyling: {
      state: subStylingState,
      set: setSubStyling,
    },
    deviceName: {
      state: deviceNameState,
      set: setDeviceNameState,
    },
  };
}
