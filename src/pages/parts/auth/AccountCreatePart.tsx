import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/buttons/Button";
import { ColorPicker, initialColor } from "@/components/form/ColorPicker";
import { IconPicker, initialIcon } from "@/components/form/IconPicker";
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
  const [colorA, setColorA] = useState(initialColor);
  const [colorB, setColorB] = useState(initialColor);
  const [userIcon, setUserIcon] = useState<UserIcons>(initialIcon);
  const { t } = useTranslation();
  const [hasDeviceError, setHasDeviceError] = useState(false);

  const nextStep = useCallback(() => {
    setHasDeviceError(false);
    const validatedDevice = device.trim();
    if (validatedDevice.length === 0) {
      setHasDeviceError(true);
      return;
    }

    props.onNext?.({
      device: validatedDevice,
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
        icon={
          <Avatar
            profile={{ colorA, colorB, icon: userIcon }}
            iconClass="text-3xl"
            sizeClass="w-16 h-16"
          />
        }
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
        {hasDeviceError ? (
          <p className="text-authentication-errorText">
            {t("auth.login.deviceLengthError")}
          </p>
        ) : null}
      </div>
      <LargeCardButtons>
        <Button theme="purple" onClick={() => nextStep()}>
          {t("auth.register.information.next")}
        </Button>
      </LargeCardButtons>
    </LargeCard>
  );
}
