import classNames from "classnames";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAsync } from "react-use";

import { isExtensionActive } from "@/backend/extension/messaging";
import { singularProxiedFetch } from "@/backend/helpers/fetch";
import { Button } from "@/components/buttons/Button";
import { Icon, Icons } from "@/components/Icon";
import { Loading } from "@/components/layout/Loading";
import { SettingsCard } from "@/components/layout/SettingsCard";
import {
  StatusCircle,
  StatusCircleProps,
} from "@/components/player/internals/StatusCircle";
import { Heading3 } from "@/components/utils/Text";
import { useAuthStore } from "@/stores/auth";

const testUrl = "https://postman-echo.com/get";

type Status = "success" | "unset" | "error";

type SetupData = {
  extension: Status;
  proxy: Status;
  defaultProxy: Status;
};

function testProxy(url: string) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => reject(new Error("Timed out!")), 3000);
    singularProxiedFetch(url, testUrl, {})
      .then((res) => {
        if (res.url !== testUrl) return reject(new Error("Not a proxy"));
        resolve();
      })
      .catch(reject);
  });
}

function useIsSetup() {
  const proxyUrls = useAuthStore((s) => s.proxySet);
  const { loading, value } = useAsync(async (): Promise<SetupData> => {
    const extensionStatus: Status = (await isExtensionActive())
      ? "success"
      : "unset";
    let proxyStatus: Status = "unset";
    if (proxyUrls && proxyUrls.length > 0) {
      try {
        await testProxy(proxyUrls[0]);
        proxyStatus = "success";
      } catch {
        proxyStatus = "error";
      }
    }
    return {
      extension: extensionStatus,
      proxy: proxyStatus,
      defaultProxy: "success",
    };
  }, [proxyUrls]);

  let globalState: Status = "unset";
  if (value?.extension === "success" || value?.proxy === "success")
    globalState = "success";
  if (value?.proxy === "error" || value?.extension === "error")
    globalState = "error";

  return {
    setupStates: value,
    globalState,
    loading,
  };
}

function SetupCheckList(props: {
  status: Status;
  grey?: boolean;
  highlight?: boolean;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  const statusMap: Record<Status, StatusCircleProps["type"]> = {
    error: "error",
    success: "success",
    unset: "noresult",
  };

  return (
    <div className="flex items-start text-type-dimmed my-4">
      <StatusCircle
        type={statusMap[props.status]}
        className={classNames({
          "!text-video-scraping-noresult !bg-video-scraping-noresult opacity-50":
            props.grey,
          "scale-90 mr-3": true,
        })}
      />
      <div>
        <p
          className={classNames({
            "!text-white": props.grey && props.highlight,
            "!text-type-dimmed opacity-75": props.grey && !props.highlight,
            "text-type-danger": props.status === "error",
            "text-white": props.status === "success",
          })}
        >
          {props.children}
        </p>
        {props.status === "error" ? (
          <p className="max-w-96">
            {t("settings.connections.setup.itemError")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function SetupPart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loading, setupStates, globalState } = useIsSetup();
  if (loading || !setupStates) {
    return (
      <SettingsCard>
        <div className="flex py-6 items-center justify-center">
          <Loading />
        </div>
      </SettingsCard>
    );
  }

  const textLookupMap: Record<
    Status,
    { title: string; desc: string; button: string }
  > = {
    error: {
      title: "settings.connections.setup.errorStatus.title",
      desc: "settings.connections.setup.errorStatus.description",
      button: "settings.connections.setup.redoSetup",
    },
    success: {
      title: "settings.connections.setup.successStatus.title",
      desc: "settings.connections.setup.successStatus.description",
      button: "settings.connections.setup.redoSetup",
    },
    unset: {
      title: "settings.connections.setup.unsetStatus.title",
      desc: "settings.connections.setup.unsetStatus.description",
      button: "settings.connections.setup.doSetup",
    },
  };

  return (
    <SettingsCard>
      <div className="flex items-start gap-4">
        <div>
          <div
            className={classNames({
              "rounded-full h-12 w-12 flex bg-opacity-15 justify-center items-center":
                true,
              "text-type-success bg-type-success": globalState === "success",
              "text-type-danger bg-type-danger":
                globalState === "error" || globalState === "unset",
            })}
          >
            <Icon
              icon={globalState === "success" ? Icons.CHECKMARK : Icons.X}
              className="text-xl"
            />
          </div>
        </div>
        <div className="flex-1">
          <Heading3 className="!mb-3">
            {t(textLookupMap[globalState].title)}
          </Heading3>
          <p className="max-w-[20rem] font-medium mb-6">
            {t(textLookupMap[globalState].desc)}
          </p>
          <SetupCheckList status={setupStates.extension}>
            {t("settings.connections.setup.items.extension")}
          </SetupCheckList>
          <SetupCheckList status={setupStates.proxy}>
            {t("settings.connections.setup.items.proxy")}
          </SetupCheckList>
          <SetupCheckList
            grey
            highlight={globalState === "unset"}
            status={setupStates.defaultProxy}
          >
            {t("settings.connections.setup.items.default")}
          </SetupCheckList>
        </div>
        <div className="mt-5">
          <Button theme="purple" onClick={() => navigate("/onboarding")}>
            {t(textLookupMap[globalState].button)}
          </Button>
        </div>
      </div>
    </SettingsCard>
  );
}
