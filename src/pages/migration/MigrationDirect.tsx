import { CenterContainer } from "@/components/layout/ThinContainer";
import { MinimalPageLayout } from "@/pages/layouts/MinimalPageLayout";
import { PageTitle } from "@/pages/parts/util/PageTitle";

export function MigrationDirectPage() {
  return (
    <MinimalPageLayout>
      <PageTitle subpage k="global.pages.migration" />
      <CenterContainer>Hi</CenterContainer>
    </MinimalPageLayout>
  );
}
