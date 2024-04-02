import { ReactNode, useEffect, useState } from "react";

import { Divider } from "@/components/utils/Divider";
import { Heading2 } from "@/components/utils/Text";
import { conf } from "@/setup/config";
import { BACKEND_URL } from "@/setup/constants";

async function getAccountNumber() {
  const response = await fetch(`${BACKEND_URL}/metrics`);
  const text = await response.text();

  // Adjusted regex to match any hostname
  const regex =
    /mw_provider_hostname_count{hostname="https?:\/\/[^"}]+"} (\d+)/g;
  let total = 0;
  let match = regex.exec(text); // Initial assignment outside the loop

  while (match !== null) {
    total += parseInt(match[1], 10);
    match = regex.exec(text); // Update the assignment at the end of the loop body
  }

  if (total > 0) {
    return total.toString();
  }
  throw new Error("ACCOUNT_NUMBER not found");
}

async function getAllAccounts() {
  const response = await fetch(`${BACKEND_URL}/metrics`);
  const text = await response.text();

  const regex = /mw_user_count{namespace="movie-web"} (\d+)/;
  const match = text.match(regex);

  if (match) {
    return match[1];
  }
  throw new Error("USER_COUNT not found");
}

function ConfigValue(props: { name: string; children?: ReactNode }) {
  return (
    <>
      <div className="flex">
        <p className="flex-1 font-bold text-white pr-5">{props.name}</p>
        <p>{props.children}</p>
      </div>
      <Divider marginClass="my-3" />
    </>
  );
}

export function ConfigValuesPart() {
  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const [allAccounts, setAllAccounts] = useState<string | null>(null);
  const normalRouter = conf().NORMAL_ROUTER;
  const appVersion = conf().APP_VERSION;
  const backendUrl = conf().BACKEND_URL;

  useEffect(() => {
    getAccountNumber()
      .then((number) => {
        setAccountNumber(number);
      })
      .catch((error) => {
        console.error("Error fetching account number:", error);
      });

    getAllAccounts()
      .then((accounts) => {
        setAllAccounts(accounts);
      })
      .catch((error) => {
        console.error("Error fetching all accounts:", error);
      });
  }, []);

  return (
    <>
      <Heading2 className="mb-8 mt-12">Site Constants</Heading2>
      <ConfigValue name="Routing mode">
        {normalRouter ? "Normal routing" : "Hash based routing"}
      </ConfigValue>
      <ConfigValue name="Application version">v{appVersion}</ConfigValue>
      <ConfigValue name="Backend requests">{accountNumber}</ConfigValue>
      <ConfigValue name="Total User Accounts">{allAccounts}</ConfigValue>
      <ConfigValue name="Backend URL">{backendUrl}</ConfigValue>
    </>
  );
}
