import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import Link from react-router-dom

import { ThiccContainer } from "@/components/layout/ThinContainer";
import { Divider } from "@/components/utils/Divider";
import { Heading1, Paragraph } from "@/components/utils/Text";

import { SubPageLayout } from "./layouts/SubPageLayout";
// import { MediaGrid } from "@/components/media/MediaGrid"
// import { TopFlixCard } from "@/components/media/FlixCard";

function ConfigValue(props: { name: string; children?: ReactNode }) {
  return (
    <>
      <div className="flex">
        <p className="flex-1 font-bold text-white pr-5 pl-3">
          <p>{props.name}</p>
        </p>
        <p className="pr-3 cursor-default">{props.children}</p>
      </div>
      <p className="pr-5 pl-3 cursor-default">
        {/* props.type.charAt(0).toUpperCase() + props.type.slice(1) */}
      </p>
      <Divider marginClass="my-3" />
    </>
  );
}

async function getRecentPlayedItems() {
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

  useEffect(() => {
    getRecentPlayedItems()
      .then((items) => {
        const limitedItems = items.filter(
          (item, index, self) =>
            index === self.findIndex((t2) => t2.providerId === item.providerId),
        );
        setRecentPlayedItems(limitedItems);
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
        <div className="mt-8 w-full px-8">
          <Heading1>Top sources</Heading1>
          <Paragraph className="mb-6">
            The most used providers on sudo-flix.lol, this data is fetched from
            the current backend deployment too.
          </Paragraph>
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
                <strong>{item.count}</strong>
              </ConfigValue>
            );
          })}
        </div>
      </ThiccContainer>
    </SubPageLayout>
  );
}
