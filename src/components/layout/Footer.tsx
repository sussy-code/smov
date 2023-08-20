import { useTranslation } from "react-i18next";

import { Icon, Icons } from "@/components/Icon";
import { BrandPill } from "@/components/layout/BrandPill";
import { WideContainer } from "@/components/layout/WideContainer";

function FooterLink(props: {
  href: string;
  children: React.ReactNode;
  icon: Icons;
}) {
  return (
    <a
      href={props.href}
      target="_blank"
      className="inline-flex items-center space-x-3 transition-colors duration-200 hover:text-type-emphasis"
      rel="noreferrer"
    >
      <Icon icon={props.icon} className="text-2xl" />
      <span className="font-medium">{props.children}</span>
    </a>
  );
}

function Dmca() {
  const { t } = useTranslation();
  return (
    <FooterLink icon={Icons.DRAGON} href="https://youtu.be/-WOonkg_ZCo">
      {t("footer.links.dmca")}
    </FooterLink>
  );
}

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-16 border-t border-type-divider py-16 md:py-8">
      <WideContainer ultraWide classNames="grid md:grid-cols-2 gap-16 md:gap-8">
        <div>
          <div className="inline-block">
            <BrandPill />
          </div>
          <p className="mt-4 lg:max-w-[400px]">{t("footer.tagline")}</p>
        </div>
        <div className="md:text-right">
          <h3 className="font-semibold text-type-emphasis">
            {t("footer.legal.disclaimer")}
          </h3>
          <p className="mt-3">{t("footer.legal.disclaimerText")}</p>
        </div>
        <div className="space-x-[2rem]">
          <FooterLink icon={Icons.GITHUB} href="https://github.com/movie-web">
            {t("footer.links.github")}
          </FooterLink>
          <FooterLink icon={Icons.DISCORD} href="https://discord.movie-web.app">
            {t("footer.links.discord")}
          </FooterLink>
          <div className="inline md:hidden">
            <Dmca />
          </div>
        </div>
        <div className="hidden items-center justify-end md:flex">
          <Dmca />
        </div>
      </WideContainer>
    </footer>
  );
}

export function FooterView(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={["flex min-h-screen flex-col", props.className || ""].join(
        " "
      )}
    >
      <div style={{ flex: "1 0 auto" }}>{props.children}</div>
      <Footer />
    </div>
  );
}
