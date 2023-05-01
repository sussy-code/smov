import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

import { Icon, Icons } from "@/components/Icon";

export interface OptionItem {
  id: string;
  name: string;
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
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-denim-500 py-2 pl-3 pr-10 text-left text-white shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-bink-500  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-bink-300 sm:text-sm">
              <span className="block truncate">{props.selectedItem.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <Icon
                  icon={Icons.CHEVRON_DOWN}
                  className={`transform transition-transform ${
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
              <Listbox.Options className="absolute left-0 right-0 top-10 z-10 mt-1 max-h-60 overflow-auto rounded-md bg-denim-500 py-1 text-white shadow-lg ring-1 ring-black ring-opacity-5 scrollbar-thin scrollbar-track-denim-400 scrollbar-thumb-denim-200 focus:outline-none sm:top-10 sm:text-sm">
                {props.options.map((opt) => (
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-denim-400 text-bink-700" : "text-white"
                      }`
                    }
                    key={opt.id}
                    value={opt}
                  >
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
