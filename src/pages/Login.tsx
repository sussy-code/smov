import { useNavigate } from "react-router-dom";
import { useAsync } from "react-use";

import { getBackendMeta } from "@/backend/accounts/meta";
import { Loading } from "@/components/layout/Loading";
import { SubPageLayout } from "@/pages/layouts/SubPageLayout";
import { LoginFormPart } from "@/pages/parts/auth/LoginFormPart";
import { PageTitle } from "@/pages/parts/util/PageTitle";
import { conf } from "@/setup/config";

export function LoginPage() {
  const navigate = useNavigate();

  const backendUrl = conf().BACKEND_URL;

  const backendMeta = useAsync(async () => {
    if (!backendUrl) return;
    return getBackendMeta(backendUrl);
  }, [backendUrl]);

  return (
    <SubPageLayout>
      <PageTitle subpage k="global.pages.login" />
      {backendMeta.loading ? (
        <Loading />
      ) : (
        <LoginFormPart
          disableRegistration={backendMeta.value?.registrationDisabled}
          onLogin={() => {
            navigate("/");
          }}
        />
      )}
    </SubPageLayout>
  );
}
