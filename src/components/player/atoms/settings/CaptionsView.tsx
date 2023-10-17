import classNames from "classnames";

import { FlagIcon } from "@/components/FlagIcon";
import { Icon, Icons } from "@/components/Icon";
import { Context } from "@/components/player/internals/ContextUtils";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";

export function CaptionOption(props: {
  countryCode?: string;
  children: React.ReactNode;
  selected?: boolean;
}) {
  return (
    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-3 rounded -ml-3 -mr-3 px-3 py-2 cursor-pointer hover:bg-video-context-border hover:bg-opacity-10">
      <div>
        <FlagIcon countryCode={props.countryCode} />
      </div>
      <span
        className={classNames(props.selected && "text-white", "font-medium")}
      >
        {props.children}
      </span>
      {props.selected ? (
        <Icon
          icon={Icons.CIRCLE_CHECK}
          className="text-xl text-video-context-type-accent"
        />
      ) : null}
    </div>
  );
}

export function CaptionsView({ id }: { id: string }) {
  const router = useOverlayRouter(id);

  return (
    <>
      <Context.BackLink
        onClick={() => router.navigate("/")}
        rightSide={
          <button
            type="button"
            onClick={() => router.navigate("/captions/settings")}
          >
            Customize
          </button>
        }
      >
        Captions
      </Context.BackLink>
      <Context.Section>
        <CaptionOption>Off</CaptionOption>
        <CaptionOption countryCode="nl" selected>
          Nederlands
        </CaptionOption>
        <CaptionOption countryCode="gr">Idk Gibraltar of zo?</CaptionOption>
      </Context.Section>
    </>
  );
}
