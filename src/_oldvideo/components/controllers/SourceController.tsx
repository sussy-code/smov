import { useEffect, useRef } from "react";

import { getCaptionUrl, makeCaptionId } from "@/backend/helpers/captions";
import {
  MWCaption,
  MWStreamQuality,
  MWStreamType,
} from "@/backend/helpers/streams";
import { captionLanguages } from "@/setup/iso6391";
import { useSettings } from "@/state/settings";
import { useInitialized } from "@/video/components/hooks/useInitialized";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";

interface SourceControllerProps {
  source: string;
  type: MWStreamType;
  quality: MWStreamQuality;
  providerId?: string;
  embedId?: string;
  captions: MWCaption[];
}
async function tryFetch(captions: MWCaption[]) {
  for (let i = 0; i < captions.length; i += 1) {
    const caption = captions[i];
    try {
      const blobUrl = await getCaptionUrl(caption);
      return { caption, blobUrl };
    } catch (error) {
      continue;
    }
  }
  return null;
}

export function SourceController(props: SourceControllerProps) {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const { initialized } = useInitialized(descriptor);
  const didInitialize = useRef<boolean>(false);
  const { captionSettings } = useSettings();
  useEffect(() => {
    if (didInitialize.current) return;
    if (!initialized) return;
    controls.setSource(props);
    // get preferred language
    const preferredLanguage = captionLanguages.find(
      (v) => v.id === captionSettings.language
    );
    if (!preferredLanguage) return;
    const captions = props.captions.filter(
      (v) =>
        // langIso may contain the English name or the native name of the language
        v.langIso.indexOf(preferredLanguage.englishName) !== -1 ||
        v.langIso.indexOf(preferredLanguage.nativeName) !== -1
    );
    if (!captions) return;
    // caption url can return a response other than 200
    // that's why we fetch until we get a 200 response
    tryFetch(captions).then((response) => {
      // none of them were successful
      if (!response) return;
      // set the preferred language
      const id = makeCaptionId(response.caption, true);
      controls.setCaption(id, response.blobUrl);
    });

    didInitialize.current = true;
  }, [props, controls, initialized, captionSettings.language]);

  return null;
}
