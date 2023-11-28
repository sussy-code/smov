import { useTranslation } from "react-i18next";

import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/buttons/Button";
import { Icon, Icons } from "@/components/Icon";
import { SettingsCard } from "@/components/layout/SettingsCard";
import { useModal } from "@/components/overlays/Modal";
import { AuthInputBox } from "@/components/text-inputs/AuthInputBox";
import { UserIcons } from "@/components/UserIcon";
import { useAuth } from "@/hooks/auth/useAuth";
import { ProfileEditModal } from "@/pages/parts/settings/ProfileEditModal";

export function AccountEditPart(props: {
  deviceName: string;
  setDeviceName: (s: string) => void;
  colorA: string;
  setColorA: (s: string) => void;
  colorB: string;
  setColorB: (s: string) => void;
  userIcon: UserIcons;
  setUserIcon: (s: UserIcons) => void;
}) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const profileEditModal = useModal("profile-edit");

  return (
    <SettingsCard paddingClass="px-8 py-10" className="!mt-8">
      <ProfileEditModal
        id={profileEditModal.id}
        close={profileEditModal.hide}
        colorA={props.colorA}
        setColorA={props.setColorA}
        colorB={props.colorB}
        setColorB={props.setColorB}
        userIcon={props.userIcon}
        setUserIcon={props.setUserIcon}
      />
      <div className="grid lg:grid-cols-[auto,1fr] gap-8">
        <div>
          <Avatar
            profile={{
              colorA: props.colorA,
              colorB: props.colorB,
              icon: props.userIcon,
            }}
            iconClass="text-5xl"
            sizeClass="w-32 h-32"
            bottom={
              <button
                type="button"
                className="tabbable text-xs flex gap-2 items-center bg-editBadge-bg text-editBadge-text hover:bg-editBadge-bgHover py-1 px-3 rounded-full cursor-pointer"
                onClick={profileEditModal.show}
              >
                <Icon icon={Icons.EDIT} />
                {t("settings.account.accountDetails.editProfile")}
              </button>
            }
          />
        </div>
        <div>
          <div className="space-y-8 max-w-xs">
            <AuthInputBox
              label={
                t("settings.account.accountDetails.deviceNameLabel") ??
                undefined
              }
              placeholder={
                t("settings.account.accountDetails.deviceNamePlaceholder") ??
                undefined
              }
              value={props.deviceName}
              onChange={(value) => props.setDeviceName(value)}
            />
            <div className="flex space-x-3">
              <Button theme="danger" onClick={logout}>
                {t("settings.account.accountDetails.logoutButton")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
