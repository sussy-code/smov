import { ThinContainer } from "@/components/layout/ThinContainer";
import { Heading1, Paragraph } from "@/components/utils/Text";
import { SubPageLayout } from "@/pages/layouts/SubPageLayout";
import { ConfigValuesPart } from "@/pages/parts/admin/ConfigValuesPart";
import { TMDBTestPart } from "@/pages/parts/admin/TMDBTestPart";
import { WorkerTestPart } from "@/pages/parts/admin/WorkerTestPart";

import { BackendTestPart } from "../parts/admin/BackendTestPart";

export function AdminPage() {
  return (
    <SubPageLayout>
      <ThinContainer>
        <Heading1>Admin tools</Heading1>
        <Paragraph>Useful tools to test out your current deployment</Paragraph>

        <ConfigValuesPart />
        <BackendTestPart />
        <WorkerTestPart />
        <TMDBTestPart />
      </ThinContainer>
    </SubPageLayout>
  );
}
