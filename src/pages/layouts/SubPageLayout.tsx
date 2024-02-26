import classNames from "classnames";

import { FooterView } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";

export function BlurEllipsis(props: { positionClass?: string }) {
  return (
    <>
      {/* Blur elipsis */}
      <div
        className={classNames(
          props.positionClass ?? "fixed",
          "top-0 -right-48 rotate-[32deg] w-[50rem] h-[15rem] rounded-[70rem] bg-background-accentA blur-[100px] pointer-events-none opacity-25",
        )}
      />
      <div
        className={classNames(
          props.positionClass ?? "fixed",
          "top-0 right-48 rotate-[32deg] w-[50rem] h-[15rem] rounded-[70rem] bg-background-accentB blur-[100px] pointer-events-none opacity-25",
        )}
      />
    </>
  );
}

export function SubPageLayout(props: { children: React.ReactNode }) {
  return (
    <div
      className="bg-background-main"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, var(--tw-gradient-from), var(--tw-gradient-to) 800px)",
      }}
    >
      <BlurEllipsis />
      {/* Main page */}
      <FooterView>
        <Navigation doBackground noLightbar />
        <div className="mt-40 relative">{props.children}</div>
      </FooterView>
    </div>
  );
}
