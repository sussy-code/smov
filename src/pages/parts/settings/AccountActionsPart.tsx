import { useTranslation } from "react-i18next";
import { useAsyncFn } from "react-use";

import { deleteUser } from "@/backend/accounts/user";
import { Button } from "@/components/buttons/Button";
import { SolidSettingsCard } from "@/components/layout/SettingsCard";
import { Modal, ModalCard, useModal } from "@/components/overlays/Modal";
import { Heading2, Heading3, Paragraph } from "@/components/utils/Text";
import { useAuthData } from "@/hooks/auth/useAuthData";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { useAuthStore } from "@/stores/auth";

export function AccountActionsPart() {
  const { t } = useTranslation();
  const url = useBackendUrl();
  const account = useAuthStore((s) => s.account);
  const { logout } = useAuthData();
  const deleteModal = useModal("account-delete");

  const [deleteResult, deleteExec] = useAsyncFn(async () => {
    if (!account) return;
    await deleteUser(url, account);
    await logout();
    deleteModal.hide();
  }, [logout, account, url, deleteModal.hide]);

  if (!account) return null;

  return (
    <div>
      <Heading2 border>{t("settings.account.actions.title")}</Heading2>
      <SolidSettingsCard
        paddingClass="px-6 py-12"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12"
      >
        <div>
          <Heading3>{t("settings.account.actions.delete.title")}</Heading3>
          <p className="text-type-text">
            {t("settings.account.actions.delete.text")}
          </p>
        </div>
        <div className="flex justify-start lg:justify-end items-center">
          <Button
            theme="danger"
            loading={deleteResult.loading}
            onClick={deleteModal.show}
          >
            {t("settings.account.actions.delete.button")}
          </Button>
        </div>
      </SolidSettingsCard>
      <Modal id={deleteModal.id}>
        <ModalCard>
          <Heading2 className="!mt-0">
            {t("settings.account.actions.delete.confirmTitle")}
          </Heading2>
          <Paragraph>
            {t("settings.account.actions.delete.confirmDescription")}
          </Paragraph>
          <Button
            theme="danger"
            loading={deleteResult.loading}
            onClick={deleteExec}
          >
            {t("settings.account.actions.delete.confirmButton")}
          </Button>
        </ModalCard>
      </Modal>
    </div>
  );
}
