import { ThinContainer } from "@/components/layout/ThinContainer";
import { Heading1, Paragraph } from "@/components/utils/Text";
import { SubPageLayout } from "@/pages/layouts/SubPageLayout";
import { WorkerTestPart } from "@/pages/parts/admin/WorkerTestPart";

export function AdminPage() {
  return (
    <SubPageLayout>
      <ThinContainer>
        <Heading1>Admin tools</Heading1>
        <Paragraph>Useful tools to test out your current deployment</Paragraph>

        <WorkerTestPart />
      </ThinContainer>
    </SubPageLayout>
  );
}
