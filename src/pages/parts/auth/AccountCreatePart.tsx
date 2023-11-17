import { useCallback, useState } from "react";

import { Button } from "@/components/Button";
import { Icon, Icons } from "@/components/Icon";
import {
  LargeCard,
  LargeCardButtons,
  LargeCardText,
} from "@/components/layout/LargeCard";
import { AuthInputBox } from "@/components/text-inputs/AuthInputBox";

export interface AccountProfile {
  device: string;
  profile: {
    colorA: string;
    colorB: string;
    icon: string;
  };
}

interface AccountCreatePartProps {
  onNext?: (data: AccountProfile) => void;
}

export function AccountCreatePart(props: AccountCreatePartProps) {
  const [device, setDevice] = useState("");
  // TODO validate device and account before next step

  const nextStep = useCallback(() => {
    props.onNext?.({
      device,
      profile: {
        colorA: "#fff",
        colorB: "#000",
        icon: "brush",
      },
    });
  }, [device, props]);

  return (
    <LargeCard>
      <LargeCardText
        icon={<Icon icon={Icons.USER} />}
        title="Account information"
      >
        Set up your account.... OR ELSE!
      </LargeCardText>
      <AuthInputBox
        label="Device name"
        value={device}
        onChange={setDevice}
        placeholder="Muad'Dib's Nintendo Switch"
      />
      <LargeCardButtons>
        <Button theme="purple" onClick={() => nextStep()}>
          Next
        </Button>
      </LargeCardButtons>
    </LargeCard>
  );
}
