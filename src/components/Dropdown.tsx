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
    <div className="relative my-4 max-w-[18rem]">
      <Listbox value={props.selectedItem} onChange={props.setSelectedItem}>
        {({ open }) => (
          <>
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-dropdown-background py-3 pl-3 pr-10 text-left text-white shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-bink-500  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-bink-300">
              <span className="flex gap-4 items-center truncate">
                {props.selectedItem.leftIcon
                  ? props.selectedItem.leftIcon
                  : null}
                {props.selectedItem.name}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <Icon
                  icon={Icons.CHEVRON_DOWN}
                  className={`transform transition-transform text-xl ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute left-0 right-0 top-10 z-[1] mt-4 max-h-60 overflow-auto rounded-md bg-dropdown-background py-1 text-white shadow-lg ring-1 ring-black ring-opacity-5 scrollbar-thin scrollbar-track-denim-400 scrollbar-thumb-denim-200 focus:outline-none sm:top-10">
                {props.options.map((opt) => (
                  <Listbox.Option
                    className={({ active }) =>
                      `flex gap-4 items-center relative cursor-default select-none py-3 pl-4 pr-4 ${
                        active ? "bg-denim-400 text-bink-700" : "text-white"
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
