import { useAsyncFn } from "react-use";

import { deleteUser } from "@/backend/accounts/user";
import { Button } from "@/components/Button";
import { SolidSettingsCard } from "@/components/layout/SettingsCard";
import { Heading2, Heading3 } from "@/components/utils/Text";
import { useAuthData } from "@/hooks/auth/useAuthData";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { useAuthStore } from "@/stores/auth";

export function AccountActionsPart() {
  const url = useBackendUrl();
  const account = useAuthStore((s) => s.account);
  const { logout } = useAuthData();
  const [deleteResult, deleteExec] = useAsyncFn(async () => {
    if (!account) return;
    await deleteUser(url, account);
    logout();
  }, [logout, account, url]);

  if (!account) return null;

  return (
    <div>
      <Heading2 border>Actions</Heading2>
      <SolidSettingsCard
        paddingClass="px-6 py-12"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12"
      >
        <div>
          <Heading3>Delete account</Heading3>
          <p className="text-type-text">
            This action is irreversible. All data will be deleted and nothing
            can be recovered.
          </p>
        </div>
        <div className="flex justify-start lg:justify-end items-center">
          <Button
            theme="danger"
            onClick={deleteExec}
            loading={deleteResult.loading}
          >
            Delete account
          </Button>
        </div>
      </SolidSettingsCard>
    </div>
  );
}
