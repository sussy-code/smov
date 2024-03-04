import isEqual from "lodash.isequal";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { SubtitleStyling } from "@/stores/subtitles";
import { usePreviewThemeStore } from "@/stores/theme";

export function useDerived<T>(
  initial: T,
): [T, Dispatch<SetStateAction<T>>, () => void, boolean] {
  const [overwrite, setOverwrite] = useState<T | undefined>(undefined);
  useEffect(() => {
    setOverwrite(undefined);
  }, [initial]);
  const changed = useMemo(
    () => !isEqual(overwrite, initial) && overwrite !== undefined,
    [overwrite, initial],
  );
  const setter = useCallback<Dispatch<SetStateAction<T>>>(
    (inp) => {
      if (!(inp instanceof Function)) setOverwrite(inp);
      else setOverwrite((s) => inp(s !== undefined ? s : initial));
    },
    [initial, setOverwrite],
  );
  const data = overwrite === undefined ? initial : overwrite;

  const reset = useCallback(() => setOverwrite(undefined), [setOverwrite]);

  return [data, setter, reset, changed];
}

export function useSettingsState(
  theme: string | null,
  appLanguage: string,
  subtitleStyling: SubtitleStyling,
  deviceName: string,
  proxyUrls: string[] | null,
  backendUrl: string | null,
  profile:
    | {
        colorA: string;
        colorB: string;
        icon: string;
      }
    | undefined,
  enableThumbnails: boolean,
) {
  const [proxyUrlsState, setProxyUrls, resetProxyUrls, proxyUrlsChanged] =
    useDerived(proxyUrls);
  const [backendUrlState, setBackendUrl, resetBackendUrl, backendUrlChanged] =
    useDerived(backendUrl);
  const [themeState, setTheme, resetTheme, themeChanged] = useDerived(theme);
  const setPreviewTheme = usePreviewThemeStore((s) => s.setPreviewTheme);
  const resetPreviewTheme = useCallback(
    () => setPreviewTheme(theme),
    [setPreviewTheme, theme],
  );
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
  const [profileState, setProfileState, resetProfile, profileChanged] =
    useDerived(profile);
  const [
    enableThumbnailsState,
    setEnableThumbnailsState,
    resetEnableThumbnails,
    enableThumbnailsChanged,
  ] = useDerived(enableThumbnails);

  function reset() {
    resetTheme();
    resetPreviewTheme();
    resetAppLanguage();
    resetSubStyling();
    resetProxyUrls();
    resetBackendUrl();
    resetDeviceName();
    resetProfile();
    resetEnableThumbnails();
  }

  const changed =
    themeChanged ||
    appLanguageChanged ||
    subStylingChanged ||
    deviceNameChanged ||
    backendUrlChanged ||
    proxyUrlsChanged ||
    profileChanged ||
    enableThumbnailsChanged;

  return {
    reset,
    changed,
    theme: {
      state: themeState,
      set: setTheme,
      changed: themeChanged,
    },
    appLanguage: {
      state: appLanguageState,
      set: setAppLanguage,
      changed: appLanguageChanged,
    },
    subtitleStyling: {
      state: subStylingState,
      set: setSubStyling,
      changed: subStylingChanged,
    },
    deviceName: {
      state: deviceNameState,
      set: setDeviceNameState,
      changed: deviceNameChanged,
    },
    proxyUrls: {
      state: proxyUrlsState,
      set: setProxyUrls,
      changed: proxyUrlsChanged,
    },
    backendUrl: {
      state: backendUrlState,
      set: setBackendUrl,
      changed: backendUrlChanged,
    },
    profile: {
      state: profileState,
      set: setProfileState,
      changed: profileChanged,
    },
    enableThumbnails: {
      state: enableThumbnailsState,
      set: setEnableThumbnailsState,
      changed: enableThumbnailsChanged,
    },
  };
}
