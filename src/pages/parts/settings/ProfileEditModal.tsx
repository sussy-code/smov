import { useTranslation } from "react-i18next";

import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/buttons/Button";
import { ColorPicker } from "@/components/form/ColorPicker";
import { IconPicker } from "@/components/form/IconPicker";
import { Modal, ModalCard } from "@/components/overlays/Modal";
import { UserIcons } from "@/components/UserIcon";
import { Heading2 } from "@/components/utils/Text";

export interface ProfileEditModalProps {
  id: string;
  close?: () => void;
  colorA: string;
  setColorA: (s: string) => void;
  colorB: string;
  setColorB: (s: string) => void;
  userIcon: UserIcons;
  setUserIcon: (s: UserIcons) => void;
}

export function ProfileEditModal(props: ProfileEditModalProps) {
  const { t } = useTranslation();

  return (
    <Modal id={props.id}>
      <ModalCard>
        <div className="flex justify-between items-center mb-9">
          <Heading2 className="!mt-0 !mb-0">
            {t("settings.account.profile.title")}
          </Heading2>
          <Avatar
            profile={{
              colorA: props.colorA,
              colorB: props.colorB,
              icon: props.userIcon,
            }}
            iconClass="text-2xl"
            sizeClass="w-12 h-12"
          />
        </div>
        <div className="space-y-6">
          <ColorPicker
            label={t("settings.account.profile.firstColor")}
            value={props.colorA}
            onInput={props.setColorA}
          />
          <ColorPicker
            label={t("settings.account.profile.secondColor")}
            value={props.colorB}
            onInput={props.setColorB}
          />
          <IconPicker
            label={t("settings.account.profile.userIcon")}
            value={props.userIcon}
            onInput={props.setUserIcon}
          />
        </div>
        <div className="flex justify-center mt-8">
          <Button theme="purple" className="!px-20" onClick={props.close}>
            {t("settings.account.profile.finish")}
          </Button>
        </div>
      </ModalCard>
    </Modal>
  );
}
