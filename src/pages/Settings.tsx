import classNames from "classnames";
import { useCallback, useEffect, useMemo } from "react";
import { useAsyncFn } from "react-use";

import { base64ToBuffer, decryptData } from "@/backend/accounts/crypto";
import { getSessions } from "@/backend/accounts/sessions";
import { updateSettings } from "@/backend/accounts/settings";
import { Button } from "@/components/Button";
import { WideContainer } from "@/components/layout/WideContainer";
import { Heading1 } from "@/components/utils/Text";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSettingsState } from "@/hooks/useSettingsState";
import { AccountActionsPart } from "@/pages/parts/settings/AccountActionsPart";
import { AccountEditPart } from "@/pages/parts/settings/AccountEditPart";
import { CaptionsPart } from "@/pages/parts/settings/CaptionsPart";
import { ConnectionsPart } from "@/pages/parts/settings/ConnectionsPart";
import { DeviceListPart } from "@/pages/parts/settings/DeviceListPart";
import { RegisterCalloutPart } from "@/pages/parts/settings/RegisterCalloutPart";
import { SidebarPart } from "@/pages/parts/settings/SidebarPart";
import { ThemePart } from "@/pages/parts/settings/ThemePart";
import { AccountWithToken, useAuthStore } from "@/stores/auth";
import { useLanguageStore } from "@/stores/language";
import { useSubtitleStore } from "@/stores/subtitles";
import { useThemeStore } from "@/stores/theme";

import { SubPageLayout } from "./layouts/SubPageLayout";
import { LocalePart } from "./parts/settings/LocalePart";

function SettingsLayout(props: { children: React.ReactNode }) {
  const { isMobile } = useIsMobile();

  return (
    <WideContainer ultraWide classNames="overflow-visible">
      <div
        className={classNames(
          "grid gap-12",
          isMobile ? "grid-cols-1" : "lg:grid-cols-[260px,1fr]"
        )}
      >
        <SidebarPart />
        <div>{props.children}</div>
      </div>
    </WideContainer>
  );
}

export function AccountSettings(props: { account: AccountWithToken }) {
  const url = useBackendUrl();
  const { account } = props;
  const [sessionsResult, execSessions] = useAsyncFn(() => {
    return getSessions(url, account);
  }, [account, url]);
  useEffect(() => {
    execSessions();
  }, [execSessions]);

  return (
    <>
      <AccountEditPart />
      <DeviceListPart
        error={!!sessionsResult.error}
        loading={sessionsResult.loading}
        sessions={sessionsResult.value ?? []}
        onChange={execSessions}
      />
      <AccountActionsPart />
    </>
  );
}

export function SettingsPage() {
  const activeTheme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const appLanguage = useLanguageStore((s) => s.language);
  const setAppLanguage = useLanguageStore((s) => s.setLanguage);

  const subStyling = useSubtitleStore((s) => s.styling);
  const setSubStyling = useSubtitleStore((s) => s.updateStyling);

  const account = useAuthStore((s) => s.account);
  const decryptedName = useMemo(() => {
    if (!account) return "";
    return decryptData(account.deviceName, base64ToBuffer(account.seed));
  }, [account]);

  const backendUrl = useBackendUrl();

  const user = useAuthStore();

  const state = useSettingsState(
    activeTheme,
    appLanguage,
    subStyling,
    decryptedName
  );

  const saveChanges = useCallback(async () => {
    console.log(state);

    if (account) {
      await updateSettings(backendUrl, account, {
        applicationLanguage: state.appLanguage.state,
        applicationTheme: state.theme.state ?? undefined,
      });
    }

    setAppLanguage(state.appLanguage.state);
    setTheme(state.theme.state);
    setSubStyling(state.subtitleStyling.state);
  }, [state, account, backendUrl, setAppLanguage, setTheme, setSubStyling]);
  return (
    <SubPageLayout>
      <SettingsLayout>
        <div id="settings-account">
          <Heading1 border className="!mb-0">
            Account
          </Heading1>
          {user.account ? (
            <AccountSettings account={user.account} />
          ) : (
            <RegisterCalloutPart />
          )}
        </div>
        <div id="settings-locale" className="mt-48">
          <LocalePart
            language={state.appLanguage.state}
            setLanguage={state.appLanguage.set}
          />
        </div>
        <div id="settings-appearance" className="mt-48">
          <ThemePart active={state.theme.state} setTheme={state.theme.set} />
        </div>
        <div id="settings-captions" className="mt-48">
          <CaptionsPart
            styling={state.subtitleStyling.state}
            setStyling={state.subtitleStyling.set}
          />
        </div>
        <div id="settings-connection" className="mt-48">
          <ConnectionsPart />
        </div>
      </SettingsLayout>
      <div
        className={`bg-settings-saveBar-background border-t border-settings-card-border/50 py-4 transition-opacity w-full fixed bottom-0 flex justify-between px-8 items-center ${
          state.changed ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-type-danger">You have unsaved changes</p>
        <div className="space-x-6">
          <Button theme="secondary" onClick={state.reset}>
            Reset
          </Button>
          <Button theme="purple" onClick={saveChanges}>
            Save
          </Button>
        </div>
      </div>
    </SubPageLayout>
  );
}
