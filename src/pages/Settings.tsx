import classNames from "classnames";
import { useEffect } from "react";
import { useAsyncFn } from "react-use";

import { getSessions } from "@/backend/accounts/sessions";
import { WideContainer } from "@/components/layout/WideContainer";
import { Heading1 } from "@/components/utils/Text";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AccountActionsPart } from "@/pages/settings/AccountActionsPart";
import { AccountEditPart } from "@/pages/settings/AccountEditPart";
import { CaptionsPart } from "@/pages/settings/CaptionsPart";
import { DeviceListPart } from "@/pages/settings/DeviceListPart";
import { RegisterCalloutPart } from "@/pages/settings/RegisterCalloutPart";
import { SidebarPart } from "@/pages/settings/SidebarPart";
import { ThemePart } from "@/pages/settings/ThemePart";
import { AccountWithToken, useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

import { SubPageLayout } from "./layouts/SubPageLayout";
import { LocalePart } from "./settings/LocalePart";

function SettingsLayout(props: { children: React.ReactNode }) {
  const { isMobile } = useIsMobile();

  return (
    <WideContainer ultraWide>
      <div
        className={classNames(
          "grid gap-12",
          isMobile ? "grid-cols-1" : "lg:grid-cols-[260px,1fr]"
        )}
      >
        <SidebarPart />
        <div className="space-y-16">{props.children}</div>
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
  const user = useAuthStore();

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
        <div id="settings-locale">
          <LocalePart />
        </div>
        <div id="settings-appearance">
          <ThemePart active={activeTheme} setTheme={setTheme} />
        </div>
        <div id="settings-captions">
          <CaptionsPart />
        </div>
      </SettingsLayout>
    </SubPageLayout>
  );
}
