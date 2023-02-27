import { DownloadAction } from "@/video/components/actions/list-entries/DownloadAction";
import { useState } from "react";
import { CaptionsSelectionAction } from "../actions/CaptionsSelectionAction";
import { SourceSelectionAction } from "../actions/SourceSelectionAction";
import { CaptionSelectionPopout } from "./CaptionSelectionPopout";
import { PopoutSection } from "./PopoutUtils";
import { SourceSelectionPopout } from "./SourceSelectionPopout";

export function SettingsPopout() {
  const [popoutId, setPopoutId] = useState("");

  if (popoutId === "source") return <SourceSelectionPopout />;
  if (popoutId === "captions") return <CaptionSelectionPopout />;

  return (
    <PopoutSection>
      <DownloadAction />
      <SourceSelectionAction onClick={() => setPopoutId("source")} />
      <CaptionsSelectionAction onClick={() => setPopoutId("captions")} />
    </PopoutSection>
  );
}
