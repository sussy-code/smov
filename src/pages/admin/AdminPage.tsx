import { ReactNode, useEffect, useState } from "react";

import { ThinContainer } from "@/components/layout/ThinContainer";
import { Divider } from "@/components/utils/Divider";
import { Heading1, Heading2, Paragraph } from "@/components/utils/Text";
import { SubPageLayout } from "@/pages/layouts/SubPageLayout";
import { ConfigValuesPart } from "@/pages/parts/admin/ConfigValuesPart";
import { TMDBTestPart } from "@/pages/parts/admin/TMDBTestPart";
import { WorkerTestPart } from "@/pages/parts/admin/WorkerTestPart";

import { BackendTestPart } from "../parts/admin/BackendTestPart";

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

async function getRecentPlayedItems() {
  const response = await fetch("https://backend.sudo-flix.lol/metrics");
  const text = await response.text();

  const regex =
    /mw_media_watch_count{tmdb_full_id="([^"]+)",provider_id="([^"]+)",title="([^"]+)",success="([^"]+)"} (\d+)/g;
  let match;
  const loop = true;
  const items = [];

  while (loop) {
    match = regex.exec(text);
    if (match === null) break;

    const [_, tmdbFullId, providerId, title, success, count] = match;
    items.push({
      tmdbFullId,
      providerId,
      title,
      success: success === "true",
      count: parseInt(count, 10),
    });
  }

  if (items.length > 0) {
    return items;
  }
  throw new Error("RECENT_PLAYED_ITEMS not found");
}

export function AdminPage() {
  const [recentPlayedItems, setRecentPlayedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentPlayedItems()
      .then((items) => {
        setRecentPlayedItems(items);
      })
      .catch((error) => {
        console.error("Error fetching recent played items:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <SubPageLayout>
      <ThinContainer>
        <Heading1>Admin tools</Heading1>
        <Paragraph>Silly tools used test sudo-flix! ૮₍´˶• . • ⑅ ₎ა</Paragraph>

        <ConfigValuesPart />
        <BackendTestPart />
        <WorkerTestPart />
        <TMDBTestPart />
        <div className="mt-8 w-full max-w-none">
          <Heading2 className="mb-8">Recently Played List</Heading2>
          <p className="mb-8">
            This data is fetched from the current backend deployment.
          </p>
          {recentPlayedItems.map((item) => {
            const successText = item.success ? "Yes" : "No"; // Convert bool to "Yes" or "No"
            return (
              <ConfigValue key={item.tmdbFullId} name={item.title}>
                {`${item.providerId} - Provided: ${successText}, Views: ${item.count}`}
              </ConfigValue>
            );
          })}
        </div>
      </ThinContainer>
    </SubPageLayout>
  );
}
