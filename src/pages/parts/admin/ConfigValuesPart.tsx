import { ReactNode } from "react";

import { Divider } from "@/components/utils/Divider";
import { Heading2 } from "@/components/utils/Text";
import { conf } from "@/setup/config";

function ConfigValue(props: { name: string; children?: ReactNode }) {
  return (
    <>
      <div className="flex">
        <p className="flex-1 font-bold text-white">{props.name}</p>
        <p>{props.children}</p>
      </div>
      <Divider marginClass="my-3" />
    </>
  );
}

export function ConfigValuesPart() {
  const normalRouter = conf().NORMAL_ROUTER;
  const appVersion = conf().APP_VERSION;
  const backendUrl = conf().BACKEND_URL;

  return (
    <>
      <Heading2 className="mb-8 mt-12">Configured values</Heading2>
      <ConfigValue name="Routing mode">
        {normalRouter ? "Normal routing" : "Hash based routing"}
      </ConfigValue>
      <ConfigValue name="Application version">v{appVersion}</ConfigValue>
      <ConfigValue name="Backend URL">{backendUrl}</ConfigValue>
    </>
  );
}
