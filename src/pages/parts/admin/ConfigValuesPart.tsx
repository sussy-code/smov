import { ReactNode, useEffect, useState } from "react";

import { Divider } from "@/components/utils/Divider";
import { Heading2 } from "@/components/utils/Text";
import { conf } from "@/setup/config";

async function getAccountNumber() {
  const response = await fetch("https://backend.sudo-flix.lol/metrics");
  const text = await response.text();

  const regex1 =
    /mw_provider_hostname_count{hostname="https:\/\/sudo-flix.lol"} (\d+)/;
  const match1 = text.match(regex1);
  const regex2 = /mw_user_count{namespace="movie-web"} (\d+)/;
  const match2 = text.match(regex2);

  if (match1 && match2) {
    return match1[1] + match2[1];
  }
  throw new Error("ACCOUNT_NUMBER not found");
}

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
  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const normalRouter = conf().NORMAL_ROUTER;
  const appVersion = conf().APP_VERSION;
  const backendUrl = conf().BACKEND_URL;

  useEffect(() => {
    getAccountNumber()
      .then((number) => {
        setAccountNumber(number);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching account number:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Heading2 className="mb-8 mt-12">Site Constants</Heading2>
      <ConfigValue name="Routing mode">
        {normalRouter ? "Normal routing" : "Hash based routing"}
      </ConfigValue>
      <ConfigValue name="Application version">v{appVersion}</ConfigValue>
      <ConfigValue name="Backend Accounts">{accountNumber}</ConfigValue>
      <ConfigValue name="Backend URL">{backendUrl}</ConfigValue>
    </>
  );
}
