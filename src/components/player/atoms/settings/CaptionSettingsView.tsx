import classNames from "classnames";

import { Icon, Icons } from "@/components/Icon";
import { Context } from "@/components/player/internals/ContextUtils";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";

export function ColorOption(props: {
  color: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={classNames(
        "p-1.5 bg-video-context-buttonFocus rounded transition-colors duration-100",
        props.active ? "bg-opacity-100" : "bg-opacity-0 cursor-pointer"
      )}
      onClick={props.onClick}
    >
      <div
        className="w-6 h-6 rounded-full flex justify-center items-center"
        style={{ backgroundColor: props.color }}
      >
        {props.active ? (
          <Icon className="text-sm text-black" icon={Icons.CHECKMARK} />
        ) : null}
      </div>
    </div>
  );
}

export function CaptionSettingsView({ id }: { id: string }) {
  const router = useOverlayRouter(id);

  return (
    <>
      <Context.BackLink onClick={() => router.navigate("/captions")}>
        Custom captions
      </Context.BackLink>
      <Context.Section>
        <div className="flex justify-between items-center">
          <Context.FieldTitle>Color</Context.FieldTitle>
          <div className="flex justify-center items-center">
            <ColorOption onClick={() => {}} color="#FFFFFF" active />
            <ColorOption onClick={() => {}} color="#80B1FA" />
            <ColorOption onClick={() => {}} color="#E2E535" />
          </div>
        </div>
      </Context.Section>
    </>
  );
}
