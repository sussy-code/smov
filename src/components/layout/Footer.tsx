import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Icon, Icons } from "@/components/Icon";
import { BrandPill } from "@/components/layout/BrandPill";
import { WideContainer } from "@/components/layout/WideContainer";
import { conf } from "@/setup/config";

function FooterLink(props: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  icon: Icons;
}) {
  return (
    <a
      href={props.href ?? "#"}
      target="_blank"
      className="tabbable rounded py-2 px-3 inline-flex items-center space-x-3 transition-colors duration-200 hover:text-type-emphasis"
      rel="noreferrer"
      onClick={props.onClick}
    >
      <Icon icon={props.icon} className="text-2xl" />
      <span className="font-medium">{props.children}</span>
    </a>
  );
}

function Dmca() {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <FooterLink icon={Icons.DRAGON} onClick={() => history.push("/dmca")}>
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
        <div className="space-x-[0.5rem] -ml-3">
          <FooterLink icon={Icons.GITHUB} href={conf().GITHUB_LINK}>
            {t("footer.links.github")}
          </FooterLink>
          <FooterLink icon={Icons.DISCORD} href={conf().DISCORD_LINK}>
            {t("footer.links.discord")}
          </FooterLink>
          <div className="inline md:hidden">
            <Dmca />
          </div>
        </div>
        <div className="hidden items-center justify-end md:flex -mr-3">
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
