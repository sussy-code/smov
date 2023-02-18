import { useEffect, useState } from "react";
import pako from "pako";

function fromBinary(str: string): Uint8Array {
    let result = new Uint8Array(str.length);
    [...str].forEach((char, i) => {
      result[i] = char.charCodeAt(0);
    });
    return result;
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

        const data = JSON.parse(pako.inflate(fromBinary(atob(params.get("m-data") as string)), { to: "string" }));
        const timeOfMigration = new Date(params.get("m-time") as string);

        const savedTime = localStorage.getItem("mw-migration-date");
        if (savedTime) {
            if (new Date(savedTime) >= timeOfMigration) {
                // has already migrated this or something newer, skip 
                setDone(true);
                return;
            }
        }

        // restore migration data
        if (data.bookmarks)
            localStorage.setItem("mw-bookmarks", JSON.stringify(data.bookmarks))
        if (data.videoProgress)
            localStorage.setItem("video-progress", JSON.stringify(data.videoProgress))
        localStorage.setItem("mw-migration-date", timeOfMigration.toISOString())

        // finished
        setDone(true);
    }, [])
  
    // redirect when done
    useEffect(() => {
        if (!done) return;
        const newUrl = new URL(window.location.href);

        const newParams = [] as string[];
        newUrl.searchParams.forEach((_, key)=>newParams.push(key));
        newParams.forEach(v => newUrl.searchParams.delete(v))

        newUrl.hash = "";

        window.location.href = newUrl.toString();
    }, [done])

    return null;
}
