import { useHistory } from "react-router-dom";

import { SubPageLayout } from "@/pages/layouts/SubPageLayout";
import { LoginFormPart } from "@/pages/parts/auth/LoginFormPart";

export function LoginPage() {
  const history = useHistory();

  return (
    <SubPageLayout>
      <LoginFormPart
        onLogin={() => {
          history.push("/");
        }}
      />
    </SubPageLayout>
  );
}
