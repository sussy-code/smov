import { Navigation } from "@/components/layout/Navigation";
import { ThinContainer } from "@/components/layout/ThinContainer";
import { ArrowLink } from "@/components/text/ArrowLink";
import { Title } from "@/components/text/Title";
import { useAuth } from "@/hooks/auth/useAuth";
import { conf } from "@/setup/config";

import { NoPermissions } from "./parts/errors/NoPermissions";

export default function DeveloperPage() {
  const { loggedIn } = useAuth();

  if (!loggedIn && conf().DISABLE_FETCH_WITHOUT_LOGIN) return <NoPermissions />;

  return (
    <div className="py-48">
      <Navigation />
      <ThinContainer classNames="flex flex-col space-y-4">
        <Title>Developer tools</Title>
        <ArrowLink to="/dev/video" direction="right" linkText="Video tester" />
        <ArrowLink to="/dev/test" direction="right" linkText="Test page" />
      </ThinContainer>
    </div>
  );
}
