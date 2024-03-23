import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ThiccContainer } from "@/components/layout/ThinContainer";
import { Divider } from "@/components/utils/Divider";
import { Heading1, Paragraph } from "@/components/utils/Text";

import { SubPageLayout } from "./layouts/SubPageLayout";
import { PageTitle } from "./parts/util/PageTitle";
import { Button } from "./TopFlix";

function ConfigValue(props: { name: string; children?: ReactNode }) {
  return (
    <>
      <div className="flex">
        <p className="flex-1 font-bold text-white pr-5 pl-3">
          <p className="cursor-default">{props.name}</p>
        </p>
        <p className="pr-3 cursor-default">{props.children}</p>
      </div>
      <Divider marginClass="my-3" />
    </>
  );
}

async function getTopSources() {
  const response = await fetch("https://backend.sudo-flix.lol/metrics");
  const text = await response.text();

  const regex =
    /mw_provider_status_count{provider_id="([^"]+)",status="([^"]+)"} (\d+)/g;
  let match = regex.exec(text);
  const items: { [key: string]: any } = {};

  while (match !== null) {
    const [_, providerId, status, count] = match;
    if (items[providerId]) {
      items[providerId].count += parseInt(count, 10);
    } else {
      items[providerId] = {
        providerId,
        status,
        count: parseInt(count, 10),
      };
    }
    match = regex.exec(text);
  }

  if (Object.keys(items).length > 0) {
    return Object.values(items);
  }
  throw new Error("RECENT_PLAYED_ITEMS not found");
}

export function TopSources() {
  const [recentPlayedItems, setRecentPlayedItems] = useState<any[]>([]);
  const [failStatusCount, setFailStatusCount] = useState<number>(0);
  const [successStatusCount, setSuccessStatusCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    getTopSources()
      .then((items) => {
        const limitedItems = items.filter(
          (item, index, self) =>
            index === self.findIndex((t2) => t2.providerId === item.providerId),
        );
        setRecentPlayedItems(limitedItems);

        // Calculate fail and success status counts
        const failCount = limitedItems.reduce(
          (acc, item) =>
            item.status === "failed" || item.status === "notfound"
              ? acc + parseInt(item.count, 10)
              : acc,
          0,
        );
        const successCount = limitedItems.reduce(
          (acc, item) =>
            item.status === "success" ? acc + parseInt(item.count, 10) : acc,
          0,
        );
        setFailStatusCount(failCount.toLocaleString());
        setSuccessStatusCount(successCount.toLocaleString());
      })
      .catch((error) => {
        console.error("Error fetching recent played items:", error);
      });
  }, []);

  function getItemsForCurrentPage() {
    const sortedItems = recentPlayedItems.sort((a, b) => b.count - a.count);

    return sortedItems.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }

  return (
    <SubPageLayout>
      <ThiccContainer>
        <PageTitle subpage k="global.pages.topSources" />
        <div className="mt-8 w-full px-8 cursor-default">
          <Heading1>Top sources</Heading1>
          <Paragraph className="mb-6">
            The most used providers on sudo-flix.lol, this data is fetched from
            the current backend deployment too.
          </Paragraph>
          <div className="mt-2 w-full">
            <div className="flex justify-center">
              <div className="bg-buttons-secondary rounded-xl scale-95 py-3 px-5 mb-2">
                <p className="font-bold text-buttons-secondaryText">
                  Fail Count: {failStatusCount}
                </p>
              </div>
              <div className="bg-buttons-secondary rounded-xl scale-95 py-3 px-5 mb-2">
                <p className="font-bold text-buttons-secondaryText">
                  Success Count: {successStatusCount}
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                className="py-px w-40 box-content bg-buttons-secondary hover:bg-buttons-secondaryHover bg-opacity-90 text-buttons-secondaryText justify-center items-center inline-block"
                onClick={() => navigate("/flix")}
              >
                Go back
              </Button>
            </div>
          </div>
        </div>

        <div className="pl-6 pr-6">
          <Divider marginClass="my-3" />
          {getItemsForCurrentPage().map((item) => {
            return (
              <ConfigValue
                key={item.tmdbFullId}
                name={`${
                  item.providerId.charAt(0).toUpperCase() +
                  item.providerId.slice(1)
                }`}
              >
                {`Requests: `}
                <strong>{parseInt(item.count, 10).toLocaleString()}</strong>
              </ConfigValue>
            );
          })}
        </div>
      </ThiccContainer>
    </SubPageLayout>
  );
}
