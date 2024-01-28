import c from "classnames";
import { forwardRef, useEffect, useRef, useState } from "react";

import { Flare } from "@/components/utils/Flare";

import { Icon, Icons } from "../Icon";
import { TextInputControl } from "../text-inputs/TextInputControl";

export interface SearchBarProps {
  placeholder?: string;
  onChange: (value: string, force: boolean) => void;
  onUnFocus: () => void;
  value: string;
}

export const SearchBarInput = forwardRef<HTMLInputElement, SearchBarProps>(
  (props, ref) => {
    const [canClear, setCanClear] = useState(false);
    const [focused, setFocused] = useState(false);
    const clearButtonRef = useRef<HTMLDivElement>(null);

    function setSearch(value: string) {
      props.onChange(value, false);
      setCanClear(value.length > 0);
      clearButtonRef.current!.style.opacity = canClear ? "1" : "0";
      clearButtonRef.current!.style.cursor = canClear ? "pointer" : "auto";
    }

    function refocusSearch() {
      if (ref && typeof ref !== "function") {
        ref.current?.blur();
        setTimeout(() => ref.current?.focus(), 10);
        setTimeout(() => ref.current?.blur(), 20);
        setTimeout(() => ref.current?.focus(), 30);
      }
    }

    useEffect(() => {
      if (ref && typeof ref !== "function") {
        setSearch(ref.current?.value || "");
      }
    });

    return (
      <Flare.Base
        className={c({
          "hover:flare-enabled group flex flex-col rounded-[28px] transition-colors sm:flex-row sm:items-center relative":
            true,
          "bg-search-background": !focused,
          "bg-search-focused": focused,
        })}
      >
        <Flare.Light
          flareSize={400}
          enabled={focused}
          className="rounded-[28px]"
          backgroundClass={c({
            "transition-colors": true,
            "bg-search-background": !focused,
            "bg-search-focused": focused,
          })}
        />
        <Flare.Child className="flex flex-1 flex-col">
          <div className="pointer-events-none absolute bottom-0 left-5 top-0 flex max-h-14 items-center text-search-icon">
            <Icon icon={Icons.SEARCH} />
          </div>

          <TextInputControl
            ref={ref}
            onUnFocus={() => {
              setFocused(false);
              props.onUnFocus();
            }}
            onFocus={() => setFocused(true)}
            onChange={(val) => setSearch(val)}
            value={props.value}
            className="w-full flex-1 bg-transparent px-4 py-4 pl-12 text-search-text placeholder-search-placeholder focus:outline-none sm:py-4 sm:pr-2"
            placeholder={props.placeholder}
          />

          <div
            ref={clearButtonRef}
            onClick={() => {
              if (canClear) {
                setSearch("");
                setTimeout(() => refocusSearch(), 10);
              }
            }}
            className="group/clear cursor-pointer absolute p-1 bottom-0 right-2 top-0 flex justify-center my-auto max-h-10 max-w-10 h-full w-full items-center hover:bg-search-hoverBackground active:scale-110 text-search-icon rounded-full opacity-0 transition duration-100"
          >
            <Icon
              icon={Icons.X}
              className="group-hover/clear:text-white transition duration-100"
            />
          </div>
        </Flare.Child>
      </Flare.Base>
    );
  },
);
