import { Navigation } from "@/components/layout/Navigation";
import { ThinContainer } from "@/components/layout/ThinContainer";
import { ArrowLink } from "@/components/text/ArrowLink";
import { Title } from "@/components/text/Title";

export default function DeveloperPage() {
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
