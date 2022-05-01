import { useState } from "react";
import { MWMediaType, MWQuery } from "providers";
import { DropdownButton } from "./buttons/DropdownButton";
import { Icons } from "./Icon";
import { TextInputControl } from "./text-inputs/TextInputControl";

export interface SearchBarProps {
  buttonText?: string;
  placeholder?: string;
  onChange: (value: MWQuery) => void;
  value: MWQuery;
}

export function SearchBarInput(props: SearchBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  function setSearch(value: string) {
    props.onChange({
      ...props.value,
      searchQuery: value,
    });
  }
  function setType(type: string) {
    props.onChange({
      ...props.value,
      type: type as MWMediaType,
    });
  }

  return (
    <div className="bg-denim-300 hover:bg-denim-400 focus-within:bg-denim-400 flex flex-col items-center gap-4 rounded-[28px] px-4 py-4 transition-colors sm:flex-row sm:py-2 sm:pl-8  sm:pr-2">
      <TextInputControl
        onChange={(val) => setSearch(val)}
        value={props.value.searchQuery}
        className="placeholder-denim-700 w-full flex-1 bg-transparent text-white focus:outline-none"
        placeholder={props.placeholder}
      />

      <DropdownButton
        icon={Icons.SEARCH}
        open={dropdownOpen}
        setOpen={(val) => setDropdownOpen(val)}
        selectedItem={props.value.type}
        setSelectedItem={(val) => setType(val)}
        options={[
          {
            id: MWMediaType.MOVIE,
            name: "Movie",
            icon: Icons.FILM,
          },
          {
            id: MWMediaType.SERIES,
            name: "Series",
            icon: Icons.CLAPPER_BOARD,
          },
          // {
          //   id: MWMediaType.ANIME,
          //   name: "Anime",
          //   icon: Icons.DRAGON,
          // },
        ]}
        onClick={() => setDropdownOpen((old) => !old)}
      >
        {props.buttonText || "Search"}
      </DropdownButton>
    </div>
  );
}
