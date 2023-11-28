import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/Button";
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
  const { t } = useTranslation();
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
        title={t("auth.register.information.title") ?? undefined}
      >
        {t("auth.register.information.header")}
      </LargeCardText>
      <div className="space-y-6">
        <AuthInputBox
          label={t("auth.deviceNameLabel") ?? undefined}
          value={device}
          onChange={setDevice}
          placeholder={t("auth.deviceNamePlaceholder") ?? undefined}
        />
        <ColorPicker
          label={t("auth.register.information.color1")}
          value={colorA}
          onInput={setColorA}
        />
        <ColorPicker
          label={t("auth.register.information.color2")}
          value={colorB}
          onInput={setColorB}
        />
        <IconPicker
          label={t("auth.register.information.icon")}
          value={userIcon}
          onInput={setUserIcon}
        />
      </div>
      <LargeCardButtons>
        <Button theme="purple" onClick={() => nextStep()}>
          {t("actions.next")}
        </Button>
      </LargeCardButtons>
    </LargeCard>
  );
}
