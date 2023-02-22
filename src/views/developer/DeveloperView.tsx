import { Navigation } from "@/components/layout/Navigation";
import { ThinContainer } from "@/components/layout/ThinContainer";
import { ArrowLink } from "@/components/text/ArrowLink";
import { Title } from "@/components/text/Title";

export function DeveloperView() {
  return (
    <div className="py-48">
      <Navigation />
      <ThinContainer classNames="flex flex-col space-y-4">
        <Title className="mb-8">Developer tools</Title>
        <ArrowLink
          to="/dev/providers"
          direction="right"
          linkText="Provider tester"
        />
        <ArrowLink to="/dev/video" direction="right" linkText="Video tester" />
      </ThinContainer>
    </div>
  );
}
