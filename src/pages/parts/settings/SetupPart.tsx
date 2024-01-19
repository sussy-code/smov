import { useNavigate } from "react-router-dom";
import { useAsync } from "react-use";

import { isExtensionActive } from "@/backend/extension/messaging";
import { singularProxiedFetch } from "@/backend/helpers/fetch";
import { Button } from "@/components/buttons/Button";
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
    setTimeout(() => reject(new Error("Timed out!")), 1000);
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

export function SetupPart() {
  const navigate = useNavigate();
  const { loading, setupStates, globalState } = useIsSetup();
  if (loading || !setupStates) return <p>Loading states...</p>;
  return (
    <div>
      <p className="font-bold text-white">state: {globalState}</p>
      <p>extension: {setupStates.extension}</p>
      <p>proxy: {setupStates.proxy}</p>
      <p>defaults: {setupStates.defaultProxy}</p>
      <Button onClick={() => navigate("/onboarding")}>Do setup</Button>
    </div>
  );
}
