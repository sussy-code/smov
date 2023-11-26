import { useHistory } from "react-router-dom";

import { Button } from "@/components/buttons/Button";
import { SolidSettingsCard } from "@/components/layout/SettingsCard";
import { Heading3 } from "@/components/utils/Text";

export function RegisterCalloutPart() {
  const history = useHistory();

  return (
    <div>
      <SolidSettingsCard
        paddingClass="px-6 py-12"
        className="grid grid-cols-2 gap-12 mt-5"
      >
        <div>
          <Heading3>Sync to the cloud</Heading3>
          <p className="text-type-text">
            Instantly share your watch progress between devices and keep them
            synced.
          </p>
        </div>
        <div className="flex justify-end items-center">
          <Button theme="purple" onClick={() => history.push("/register")}>
            Get started
          </Button>
        </div>
      </SolidSettingsCard>
    </div>
  );
}
