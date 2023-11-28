import { FooterView } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";

export function PageLayout(props: { children: React.ReactNode }) {
  return (
    <FooterView>
      <Navigation />
      {props.children}
    </FooterView>
  );
}
