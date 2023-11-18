import { useCallback, useState } from "react";

import { Button } from "@/components/Button";
import { ColorPicker } from "@/components/form/ColorPicker";
import { IconPicker } from "@/components/form/IconPicker";
import { Icon, Icons } from "@/components/Icon";
import {
  LargeCard,
  LargeCardButtons,
  LargeCardText,
} from "@/components/layout/LargeCard";
import { AuthInputBox } from "@/components/text-inputs/AuthInputBox";
import { UserIcons } from "@/components/UserIcon";

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
  const [colorA, setColorA] = useState("#2E65CF");
  const [colorB, setColorB] = useState("#2E65CF");
  const [userIcon, setUserIcon] = useState<UserIcons>(UserIcons.USER);
  // TODO validate device and account before next step

  const nextStep = useCallback(() => {
    props.onNext?.({
      device,
      profile: {
        colorA,
        colorB,
        icon: userIcon,
      },
    });
  }, [device, props, colorA, colorB, userIcon]);

  return (
    <LargeCard>
      <LargeCardText
        icon={<Icon icon={Icons.USER} />}
        title="Account information"
      >
        Set up your account.... OR ELSE!
      </LargeCardText>
      <div className="space-y-6">
        <AuthInputBox
          label="Device name"
          value={device}
          onChange={setDevice}
          placeholder="Muad'Dib's Nintendo Switch"
        />
        <ColorPicker label="First color" value={colorA} onInput={setColorA} />
        <ColorPicker label="Second color" value={colorB} onInput={setColorB} />
        <IconPicker label="User icon" value={userIcon} onInput={setUserIcon} />
      </div>
      <LargeCardButtons>
        <Button theme="purple" onClick={() => nextStep()}>
          Next
        </Button>
      </LargeCardButtons>
    </LargeCard>
  );
}
