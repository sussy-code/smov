import { getCaptionUrl } from "@/backend/helpers/captions";
import { MWCaption } from "@/backend/helpers/streams";
import { Icon, Icons } from "@/components/Icon";
import { useLoading } from "@/hooks/useLoading";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useMeta } from "@/video/state/logic/meta";
import { useSource } from "@/video/state/logic/source";
import { useMemo, useRef } from "react";
import { PopoutListEntry, PopoutSection } from "./PopoutUtils";

function makeCaptionId(caption: MWCaption, isLinked: boolean): string {
  return isLinked ? `linked-${caption.langIso}` : `external-${caption.langIso}`;
}

export function CaptionSelectionPopout() {
  const descriptor = useVideoPlayerDescriptor();
  const meta = useMeta(descriptor);
  const source = useSource(descriptor);
  const controls = useControls(descriptor);
  const linkedCaptions = useMemo(
    () =>
      meta?.captions.map((v) => ({ ...v, id: makeCaptionId(v, true) })) ?? [],
    [meta]
  );
  const loadingId = useRef<string>("");
  const [setCaption, loading, error] = useLoading(
    async (caption: MWCaption, isLinked: boolean) => {
      const id = makeCaptionId(caption, isLinked);
      loadingId.current = id;
      controls.setCaption(id, await getCaptionUrl(caption));
      controls.closePopout();
    }
  );

  const currentCaption = source.source?.caption?.id;

  return (
    <>
      <PopoutSection className="bg-ash-100 font-bold text-white">
        <div>Captions</div>
      </PopoutSection>
      <div className="relative overflow-y-auto">
        <PopoutSection>
          <PopoutListEntry
            active={!currentCaption}
            onClick={() => {
              controls.clearCaption();
              controls.closePopout();
            }}
          >
            No captions
          </PopoutListEntry>
        </PopoutSection>

        <p className="sticky top-0 z-10 flex items-center space-x-1 bg-ash-200 px-5 py-3 text-sm font-bold uppercase">
          <Icon className="text-base" icon={Icons.LINK} />
          <span>Linked captions</span>
        </p>

        <PopoutSection className="pt-0">
          <div>
            {linkedCaptions.map((link) => (
              <PopoutListEntry
                key={link.langIso}
                active={link.id === currentCaption}
                loading={loading && link.id === loadingId.current}
                errored={error && link.id === loadingId.current}
                onClick={() => {
                  loadingId.current = link.id;
                  setCaption(link, true);
                }}
              >
                {link.langIso}
              </PopoutListEntry>
            ))}
          </div>
        </PopoutSection>
      </div>
    </>
  );
}
