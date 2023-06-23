import { useState } from "react";
import { useTranslation } from "react-i18next";

import { MWMediaType, MWQuery } from "@/backend/metadata/types/mw";

import { DropdownButton } from "./buttons/DropdownButton";
import { Icon, Icons } from "./Icon";
import { TextInputControl } from "./text-inputs/TextInputControl";

export interface SearchBarProps {
  buttonText?: string;
  placeholder?: string;
  onChange: (value: MWQuery, force: boolean) => void;
  onUnFocus: () => void;
  value: MWQuery;
}

export function SearchBarInput(props: SearchBarProps) {
  const { t } = useTranslation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  function setSearch(value: string) {
    props.onChange(
      {
        ...props.value,
        searchQuery: value,
      },
      false
    );
  }
  function setType(type: string) {
    props.onChange(
      {
        ...props.value,
        type: type as MWMediaType,
      },
      true
    );
  }

  return (
    <div className="relative flex flex-col rounded-[28px] bg-denim-400 transition-colors focus-within:bg-denim-400 hover:bg-denim-500 sm:flex-row sm:items-center">
      <div className="pointer-events-none absolute bottom-0 left-5 top-0 flex max-h-14 items-center">
        <Icon icon={Icons.SEARCH} />
      </div>

      <TextInputControl
        onUnFocus={props.onUnFocus}
        onChange={(val) => setSearch(val)}
        value={props.value.searchQuery}
        className="w-full flex-1 bg-transparent px-4 py-4 pl-12 text-white  placeholder-denim-700 focus:outline-none sm:py-4 sm:pr-2"
        placeholder={props.placeholder}
      />

      <div className="px-4 py-4 pt-0 sm:px-2 sm:py-2">
        <DropdownButton
          icon={Icons.SEARCH}
          open={dropdownOpen}
          setOpen={(val) => setDropdownOpen(val)}
          selectedItem={props.value.type}
          setSelectedItem={(val) => setType(val)}
          options={[
            {
              id: MWMediaType.MOVIE,
              name: t("searchBar.movie"),
              icon: Icons.FILM,
            },
            {
              id: MWMediaType.SERIES,
              name: t("searchBar.series"),
              icon: Icons.CLAPPER_BOARD,
            },
          ]}
          onClick={() => setDropdownOpen((old) => !old)}
        >
          {props.buttonText || t("searchBar.search")}
        </DropdownButton>
      </div>
    </div>
  );
}
