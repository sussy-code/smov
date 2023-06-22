import pako from "pako";
import { useEffect, useState } from "react";

import { MWMediaType } from "@/backend/metadata/types/mw";
import { conf } from "@/setup/config";

function fromBinary(str: string): Uint8Array {
  const result = new Uint8Array(str.length);
  [...str].forEach((char, i) => {
    result[i] = char.charCodeAt(0);
  });
  return result;
}

export function importV2Data({ data, time }: { data: any; time: Date }) {
  const savedTime = localStorage.getItem("mw-migration-date");
  if (savedTime) {
    if (new Date(savedTime) >= time) {
      // has already migrated this or something newer, skip
      return false;
    }
  }

  // restore migration data
  if (data.bookmarks)
    localStorage.setItem("mw-bookmarks", JSON.stringify(data.bookmarks));
  if (data.videoProgress)
    localStorage.setItem("video-progress", JSON.stringify(data.videoProgress));

  localStorage.setItem("mw-migration-date", time.toISOString());

  return true;
}

export function EmbedMigration() {
  let hasReceivedMigrationData = false;

  const onMessage = (e: any) => {
    const data = e.data;
    if (data && data.isMigrationData && !hasReceivedMigrationData) {
      hasReceivedMigrationData = true;
      const didImport = importV2Data({
        data: data.data,
        time: data.date,
      });
      if (didImport) window.location.reload();
    }
  };

  useEffect(() => {
    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  });

  return <iframe src="https://movie.squeezebox.dev" hidden />;
}

export function V2MigrationView() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search ?? "");
    if (!params.has("m-time") || !params.has("m-data")) {
      // migration params missing, just redirect
      setDone(true);
      return;
    }

    const data = JSON.parse(
      pako.inflate(fromBinary(atob(params.get("m-data") as string)), {
        to: "string",
      })
    );
    const timeOfMigration = new Date(params.get("m-time") as string);

    importV2Data({
      data,
      time: timeOfMigration,
    });

    // finished
    setDone(true);
  }, []);

  // redirect when done
  useEffect(() => {
    if (!done) return;
    const newUrl = new URL(window.location.href);

    const newParams = [] as string[];
    newUrl.searchParams.forEach((_, key) => newParams.push(key));
    newParams.forEach((v) => newUrl.searchParams.delete(v));
    newUrl.searchParams.append("migrated", "1");

    // hash router compatibility
    newUrl.hash = conf().NORMAL_ROUTER ? "" : `/search/${MWMediaType.MOVIE}`;
    newUrl.pathname = conf().NORMAL_ROUTER
      ? `/search/${MWMediaType.MOVIE}`
      : "";

    window.location.href = newUrl.toString();
  }, [done]);

  return null;
}
