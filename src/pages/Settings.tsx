import { Icon, Icons } from "@/components/Icon";
import { WideContainer } from "@/components/layout/WideContainer";
import { Divider } from "@/components/utils/Divider";
import { Heading1 } from "@/components/utils/Text";
import { conf } from "@/setup/config";

import { SubPageLayout } from "./layouts/SubPageLayout";

// TODO Put all of this not here (when I'm done writing them)

function SidebarSection(props: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-sm font-bold uppercase text-settings-sidebar-type-secondary mb-2">
        {props.title}
      </p>
      {props.children}
    </section>
  );
}

function SidebarLink(props: { children: React.ReactNode; icon: Icons }) {
  return (
    <div className="w-full px-2 py-1 flex items-center space-x-3">
      <Icon
        className="text-2xl text-settings-sidebar-type-icon"
        icon={props.icon}
      />
      <span>{props.children}</span>
    </div>
  );
}

function SettingsSidebar() {
  // eslint-disable-next-line no-restricted-globals
  const hostname = location.hostname;

  return (
    <div>
      <div className="sticky top-24 text-settings-sidebar-type-inactive">
        <SidebarSection title="Settings">
          <SidebarLink icon={Icons.WAND}>Account</SidebarLink>
        </SidebarSection>
        <Divider />
        <SidebarSection title="App information">
          <div className="flex justify-between items-center space-x-3">
            <span>Version</span>
            <span>{conf().APP_VERSION}</span>
          </div>
          <div className="flex justify-between items-center space-x-3">
            <span>Domain</span>
            <span className="text-right">{hostname}</span>
          </div>
        </SidebarSection>
      </div>
    </div>
  );
}

function SettingsLayout(props: { children: React.ReactNode }) {
  return (
    <WideContainer ultraWide>
      <div className="grid grid-cols-[260px,1fr] gap-12">
        <SettingsSidebar />
        {props.children}
      </div>
    </WideContainer>
  );
}

export function SettingsPage() {
  return (
    <SubPageLayout>
      <SettingsLayout>
        <Heading1>Setting</Heading1>
      </SettingsLayout>
    </SubPageLayout>
  );
}
