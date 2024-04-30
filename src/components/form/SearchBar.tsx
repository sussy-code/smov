import c from "classnames";
import { forwardRef, useState } from "react";

import { Flare } from "@/components/utils/Flare";

import { Icon, Icons } from "../Icon";
import { TextInputControl } from "../text-inputs/TextInputControl";

export interface SearchBarProps {
  placeholder?: string;
  onChange: (value: string, force: boolean) => void;
  onUnFocus: (newSearch?: string) => void;
  value: string;
}

export const SearchBarInput = forwardRef<HTMLInputElement, SearchBarProps>(
  (props, ref) => {
    const [focused, setFocused] = useState(false);

    function setSearch(value: string) {
      props.onChange(value, true);
    }

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

          {props.value.length > 0 && (
            <div
              onClick={() => {
                props.onUnFocus("");
                if (ref && typeof ref !== "function") {
                  ref.current?.focus();
                }
              }}
              className="cursor-pointer hover:text-white  absolute bottom-0 right-2 top-0 flex justify-center my-auto h-10 w-10 items-center hover:bg-search-hoverBackground active:scale-110 text-search-icon rounded-full transition-[transform,background-color] duration-200"
            >
              <Icon icon={Icons.X} className="transition-colors duration-200" />
            </div>
          )}
        </Flare.Child>
      </Flare.Base>
    );
  },
);
