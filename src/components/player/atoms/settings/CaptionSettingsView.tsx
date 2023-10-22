import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";

import { Toggle } from "@/components/buttons/Toggle";
import { Icon, Icons } from "@/components/Icon";
import { Menu } from "@/components/player/internals/ContextMenu";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useSubtitleStore } from "@/stores/subtitles";

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

function CaptionSetting(props: {
  textTransformer?: (s: string) => string;
  value: number;
  onChange?: (val: number) => void;
  max: number;
  label: string;
  min: number;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const currentPercentage = (props.value - props.min) / (props.max - props.min);
  const commit = useCallback(
    (percentage) => {
      const range = props.max - props.min;
      const newPercentage = Math.min(Math.max(percentage, 0), 1);
      props.onChange?.(props.min + range * newPercentage);
    },
    [props]
  );

  const { dragging, dragPercentage, dragMouseDown } = useProgressBar(
    ref,
    commit,
    true
  );

  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === "Enter" && isFocused) {
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [isFocused]);

  const inputClasses =
    "px-3 py-1 bg-video-context-inputBg rounded w-20 text-left text-white cursor-text";
  const textTransformer = props.textTransformer ?? ((s) => s);

  return (
    <div>
      <Menu.FieldTitle>{props.label}</Menu.FieldTitle>
      <div className="grid items-center grid-cols-[1fr,auto] gap-4">
        <div ref={ref}>
          <div
            className="group/progress w-full h-8 flex items-center cursor-pointer"
            onMouseDown={dragMouseDown}
            onTouchStart={dragMouseDown}
          >
            <div
              className={[
                "relative w-full h-1 bg-video-context-slider bg-opacity-25 rounded-full transition-[height] duration-100 group-hover/progress:h-1.5",
                dragging ? "!h-1.5" : "",
              ].join(" ")}
            >
              {/* Actual progress bar */}
              <div
                className="absolute top-0 left-0 h-full rounded-full bg-video-context-sliderFilled flex justify-end items-center"
                style={{
                  width: `${
                    Math.max(
                      0,
                      Math.min(
                        1,
                        dragging ? dragPercentage / 100 : currentPercentage
                      )
                    ) * 100
                  }%`,
                }}
              >
                <div
                  className={[
                    "w-[1rem] min-w-[1rem] h-[1rem] border-[4px] border-video-context-sliderFilled rounded-full transform translate-x-1/2 bg-white transition-[transform] duration-100",
                  ].join(" ")}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          {isFocused ? (
            <input
              className={inputClasses}
              value={inputValue}
              autoFocus
              onFocus={(e) => {
                (e.target as HTMLInputElement).select();
              }}
              onBlur={(e) => {
                setIsFocused(false);
                const num = Number((e.target as HTMLInputElement).value);
                if (!Number.isNaN(num)) props.onChange?.(Math.round(num));
              }}
              ref={inputRef}
              onChange={(e) =>
                setInputValue((e.target as HTMLInputElement).value)
              }
            />
          ) : (
            <button
              className={inputClasses}
              onClick={() => {
                setInputValue(Math.floor(props.value).toString());
                setIsFocused(true);
              }}
              type="button"
              tabIndex={0}
            >
              {textTransformer(Math.floor(props.value).toString())}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const colors = ["#ffffff", "#80b1fa", "#e2e535"];

export function CaptionSettingsView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const styling = useSubtitleStore((s) => s.styling);
  const overrideCasing = useSubtitleStore((s) => s.overrideCasing);
  const setOverrideCasing = useSubtitleStore((s) => s.setOverrideCasing);
  const updateStyling = useSubtitleStore((s) => s.updateStyling);

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/captions")}>
        Custom captions
      </Menu.BackLink>
      <Menu.Section className="space-y-6">
        <CaptionSetting
          label="Text size"
          max={200}
          min={1}
          textTransformer={(s) => `${s}%`}
          onChange={(v) => updateStyling({ size: v / 100 })}
          value={styling.size * 100}
        />
        <CaptionSetting
          label="Background opacity"
          max={100}
          min={0}
          onChange={(v) => updateStyling({ backgroundOpacity: v / 100 })}
          value={styling.backgroundOpacity * 100}
          textTransformer={(s) => `${s}%`}
        />
        <div className="flex justify-between items-center">
          <Menu.FieldTitle>Color</Menu.FieldTitle>
          <div className="flex justify-center items-center">
            {colors.map((v) => (
              <ColorOption
                onClick={() => updateStyling({ color: v })}
                color={v}
                active={styling.color === v}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Menu.FieldTitle>Fix capitalization</Menu.FieldTitle>
          <div className="flex justify-center items-center">
            <Toggle
              enabled={overrideCasing}
              onClick={() => setOverrideCasing(!overrideCasing)}
            />
          </div>
        </div>
      </Menu.Section>
    </>
  );
}
