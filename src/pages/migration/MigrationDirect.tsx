import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/buttons/Button";
import { SettingsCard } from "@/components/layout/SettingsCard";
import { CenterContainer } from "@/components/layout/ThinContainer";
import { AuthInputBox } from "@/components/text-inputs/AuthInputBox";
import { Divider } from "@/components/utils/Divider";
import { Heading2, Paragraph } from "@/components/utils/Text";
import { useAuth } from "@/hooks/auth/useAuth";
import { useMigration } from "@/hooks/auth/useMigration";
import { MinimalPageLayout } from "@/pages/layouts/MinimalPageLayout";
import { PageTitle } from "@/pages/parts/util/PageTitle";
import { useAuthStore } from "@/stores/auth";

export function MigrationDirectPage() {
  const { t } = useTranslation();
  const user = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { migrate } = useMigration();
  const [backendUrl, setBackendUrl] = useState("");
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "processing"
  >("idle");
  const updateBackendUrl = useAuthStore((state) => state.setBackendUrl);

  const handleMigration = useCallback(async () => {
    if (!backendUrl) {
      // eslint-disable-next-line no-alert
      alert("Please provide a Backend URL.");
      return;
    }

    try {
      setStatus("processing");
      const account = await migrate(backendUrl);
      if (account) {
        setStatus("success");
        await logout();
        updateBackendUrl(backendUrl);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error during migration:", error);
      setStatus("error");
    }
  }, [backendUrl, migrate, updateBackendUrl, logout]);

  const continueButton = () => {
    if (status === "success") {
      navigate("/login");
    }
  };

  return (
    <MinimalPageLayout>
      <PageTitle subpage k="global.pages.migration" />
      <CenterContainer>
        {user.account ? (
          <div>
            <Heading2 className="!text-4xl">
              {" "}
              {t("migration.direct.title")}
            </Heading2>
            <div className="space-y-6 max-w-3xl mx-auto">
              <Paragraph className="text-lg max-w-md">
                {t("migration.direct.description")}
              </Paragraph>
              <SettingsCard>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-white">
                    {t("migration.direct.backendLabel")}
                  </p>
                </div>
                {backendUrl !== null && (
                  <>
                    <Divider marginClass="my-6 px-8 box-content -mx-8" />
                    <AuthInputBox
                      placeholder="https://"
                      value={backendUrl ?? ""}
                      onChange={setBackendUrl}
                    />
                  </>
                )}
              </SettingsCard>

              <div className="text-center">
                {status !== "success" && (
                  <Button theme="purple" onClick={handleMigration}>
                    {status === "processing"
                      ? t("migration.direct.button.processing")
                      : t("migration.direct.button.migrate")}
                  </Button>
                )}

                {status === "success" && (
                  <div>
                    <Button
                      theme="purple"
                      className="mt-4"
                      onClick={continueButton}
                    >
                      {t("migration.direct.button.login")}
                    </Button>
                    <p className="text-green-600 mt-4">
                      {t("migration.direct.status.success")}
                    </p>
                  </div>
                )}

                {status === "error" && (
                  <p className="text-red-600 mt-4">
                    {t("migration.direct.status.error")}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center mb-8">
            <Paragraph className="max-w-[320px] text-md">
              {t("migration.direct.loginRequired")}
            </Paragraph>
            <Button
              theme="purple"
              className="mt-4"
              onClick={() => navigate("/")}
            >
              {t("migration.direct.button.home")}
            </Button>
          </div>
        )}
      </CenterContainer>
    </MinimalPageLayout>
  );
}
