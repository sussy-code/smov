import { useNavigate } from "react-router-dom";

import { SubPageLayout } from "@/pages/layouts/SubPageLayout";
import { LoginFormPart } from "@/pages/parts/auth/LoginFormPart";
import { PageTitle } from "@/pages/parts/util/PageTitle";

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <SubPageLayout>
      <PageTitle subpage k="global.pages.login" />
      <LoginFormPart
        onLogin={() => {
          navigate("/");
        }}
      />
    </SubPageLayout>
  );
}
