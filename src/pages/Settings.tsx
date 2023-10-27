import classNames from "classnames";
import { useHistory } from "react-router-dom";
import Sticky from "react-stickynode";

import { Button } from "@/components/Button";
import { Icon, Icons } from "@/components/Icon";
import { WideContainer } from "@/components/layout/WideContainer";
import { Divider } from "@/components/utils/Divider";
import { Heading1, Heading2, Heading3 } from "@/components/utils/Text";
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

function SidebarLink(props: {
  children: React.ReactNode;
  icon: Icons;
  active?: boolean;
}) {
  const history = useHistory();

  const goToPage = (link: string) => {
    history.push(link);
  };

  return (
    <a
      onClick={() => goToPage("/settings")}
      className={classNames(
        "w-full px-3 py-2 flex items-center space-x-3 cursor-pointer rounded my-2",
        props.active
          ? "bg-settings-sidebar-activeLink text-settings-sidebar-type-activated"
          : null
      )}
    >
      <Icon
        className={classNames(
          "text-2xl text-settings-sidebar-type-icon",
          props.active ? "text-settings-sidebar-type-iconActivated" : null
        )}
        icon={props.icon}
      />
      <span>{props.children}</span>
    </a>
  );
}

function SettingsSidebar() {
  // eslint-disable-next-line no-restricted-globals
  const hostname = location.hostname;
  const rem = 16;

  return (
    <div>
      <Sticky
        enabled
        top={10 * rem} // 10rem
        className="text-settings-sidebar-type-inactive"
      >
        <SidebarSection title="Settings">
          {/* I looked over at my bookshelf to come up with these links */}
          <SidebarLink icon={Icons.WAND}>A war in my name!</SidebarLink>
          <SidebarLink active icon={Icons.COMPRESS}>
            TANSTAAFL
          </SidebarLink>
          <SidebarLink icon={Icons.AIRPLAY}>We all float down here</SidebarLink>
          <SidebarLink icon={Icons.BOOKMARK}>My skin is not my own</SidebarLink>
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
      </Sticky>
    </div>
  );
}

function SettingsLayout(props: { children: React.ReactNode }) {
  return (
    <WideContainer ultraWide>
      <div className="grid grid-cols-[260px,1fr] gap-12">
        <SettingsSidebar />
        <div className="space-y-16">{props.children}</div>
      </div>
    </WideContainer>
  );
}

function SecondaryLabel(props: { children: React.ReactNode }) {
  return <p className="text-type-text">{props.children}</p>;
}

function Card(props: {
  children: React.ReactNode;
  className?: string;
  paddingClass?: string;
}) {
  return (
    <div
      className={classNames(
        "w-full rounded-lg bg-settings-card-background bg-opacity-[0.15] border border-settings-card-border",
        props.paddingClass ?? "px-8 py-6",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

function AltCard(props: {
  children: React.ReactNode;
  className?: string;
  paddingClass?: string;
}) {
  return (
    <div
      className={classNames(
        "w-full rounded-lg bg-settings-card-altBackground bg-opacity-50",
        props.paddingClass ?? "px-8 py-6",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

function AccountSection() {
  return (
    <div>
      <Heading1 border>Account</Heading1>
      <Card>Beep beep</Card>
    </div>
  );
}

function DevicesSection() {
  const devices = [
    "Jip's iPhone",
    "Muad'Dib's Nintendo Switch",
    "Oppenheimer's old-ass phone",
  ];
  return (
    <div>
      <Heading2 border className="mt-0 mb-9">
        Devices
      </Heading2>
      <div className="space-y-5">
        {devices.map((deviceName) => (
          <Card
            className="flex justify-between items-center"
            paddingClass="px-6 py-4"
            key={deviceName}
          >
            <div className="font-medium">
              <SecondaryLabel>Device name</SecondaryLabel>
              <p className="text-white">{deviceName}</p>
            </div>
            <Button theme="danger">Remove</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ActionsSection() {
  return (
    <div>
      <Heading2 border>Actions</Heading2>
      <AltCard paddingClass="px-6 py-12" className="grid grid-cols-2 gap-12">
        <div>
          <Heading3>Delete account</Heading3>
          <p className="text-type-text">
            This action is irreversible. All data will be deleted and nothing
            can be recovered.
          </p>
        </div>
        <div className="flex justify-end items-center">
          <Button theme="danger">Delete account</Button>
        </div>
      </AltCard>
    </div>
  );
}

export function SettingsPage() {
  return (
    <SubPageLayout>
      <SettingsLayout>
        <AccountSection />
        <DevicesSection />
        <ActionsSection />
      </SettingsLayout>
    </SubPageLayout>
  );
}
