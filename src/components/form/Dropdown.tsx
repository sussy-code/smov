import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

import { Icon, Icons } from "@/components/Icon";

export interface OptionItem {
  id: string;
  name: string;
  leftIcon?: React.ReactNode;
}

interface DropdownProps {
  selectedItem: OptionItem;
  setSelectedItem: (value: OptionItem) => void;
  options: Array<OptionItem>;
}

export function Dropdown(props: DropdownProps) {
  return (
    <div className="relative my-4 max-w-[25rem]">
      <Listbox value={props.selectedItem} onChange={props.setSelectedItem}>
        {() => (
          <>
            <Listbox.Button className="relative w-full rounded-lg bg-dropdown-background hover:bg-dropdown-hoverBackground py-3 pl-3 pr-10 text-left text-white shadow-md focus:outline-none tabbable cursor-pointer">
              <span className="flex gap-4 items-center truncate">
                {props.selectedItem.leftIcon
                  ? props.selectedItem.leftIcon
                  : null}
                {props.selectedItem.name}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <Icon
                  icon={Icons.UP_DOWN_ARROW}
                  className="transform transition-transform text-xl text-dropdown-secondary"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute left-0 right-0 top-10 z-[1] mt-4 max-h-60 overflow-auto rounded-md bg-dropdown-background py-1 text-white shadow-lg ring-1 ring-black ring-opacity-5 scrollbar-thin scrollbar-track-background-secondary scrollbar-thumb-type-secondary focus:outline-none sm:top-10">
                {props.options.map((opt) => (
                  <Listbox.Option
                    className={({ active }) =>
                      `cursor-pointer flex gap-4 items-center relative select-none py-3 pl-4 pr-4 ${
                        active
                          ? "bg-background-secondaryHover text-type-link"
                          : "text-white"
                      }`
                    }
                    key={opt.id}
                    value={opt}
                  >
                    {opt.leftIcon ? opt.leftIcon : null}
                    {opt.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  );
}
