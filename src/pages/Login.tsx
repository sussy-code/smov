import { useHistory } from "react-router-dom";

import { SubPageLayout } from "@/pages/layouts/SubPageLayout";
import { LoginFormPart } from "@/pages/parts/auth/LoginFormPart";
import { PageTitle } from "@/pages/parts/util/PageTitle";

export function LoginPage() {
  const history = useHistory();

  return (
    <SubPageLayout>
      <PageTitle subpage k="global.pages.login" />
      <LoginFormPart
        onLogin={() => {
          history.push("/");
        }}
      />
    </SubPageLayout>
  );
}
