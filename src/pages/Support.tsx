import classNames from "classnames";
import React from "react";
import { Trans, useTranslation } from "react-i18next";

import { ThinContainer } from "@/components/layout/ThinContainer";
import { MwLink } from "@/components/text/Link";
import { Heading1, Paragraph } from "@/components/utils/Text";
import { PageTitle } from "@/pages/parts/util/PageTitle";
import { conf } from "@/setup/config";

import { SubPageLayout } from "./layouts/SubPageLayout";

// From about just removed the numbers
export function Ol(props: { items: React.ReactNode[] }) {
  return (
    <ol>
      {props.items.map((child, i) => {
        return (
          <li
            className={classNames(
              "grid grid-cols-[auto,1fr] gap-6",
              i !== props.items.length - 1 ? "pb-12" : undefined,
            )}
          >
            <div className="relative z-0">
              <div className="w-6 h-6 rounded-full bg-about-circle text-about-circleText font-medium flex justify-center items-center relative z-10" />
              {i !== props.items.length - 1 ? (
                <div
                  className="h-[calc(100%+1.5rem)] w-px absolute top-6 left-1/2 transform -translate-x-1/2"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, transparent 5px, #1F1F29 5px, #1F1F29 10px)",
                    backgroundSize: "10px 10px",
                    backgroundRepeat: "Repeat",
                  }}
                />
              ) : null}
            </div>
            <div>{child}</div>
          </li>
        );
      })}
    </ol>
  );
}

function Item(props: { title: string; children: React.ReactNode }) {
  return (
    <>
      <p className="text-white mb-2 font-medium">{props.title}</p>
      <div className="text-type-text">{props.children}</div>
    </>
  );
}

export function SupportPage() {
  const { t } = useTranslation();

  return (
    <SubPageLayout>
      <PageTitle subpage k="global.pages.support" />
      <ThinContainer>
        <Heading1>{t("support.title")}</Heading1>
        <Paragraph>
          <Trans
            i18nKey="support.text"
            components={{
              bold: <span className="font-bold" style={{ color: "#cfcfcf" }} />,
            }}
          />
        </Paragraph>
        <Ol
          items={[
            <Item title={t("support.q1.title")}>
              <Trans i18nKey="support.q1.body">
                <MwLink to={conf().DISCORD_LINK} />
              </Trans>
            </Item>,
          ]}
        />
      </ThinContainer>
    </SubPageLayout>
  );
}
