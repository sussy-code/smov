import Sticky from "react-stickynode";

import { Icons } from "@/components/Icon";
import { SidebarLink, SidebarSection } from "@/components/layout/Sidebar";
import { Divider } from "@/components/utils/Divider";
import { conf } from "@/setup/config";

export function SidebarPart() {
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
