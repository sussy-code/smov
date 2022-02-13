import { DropdownButton } from "./Buttons/DropdownButton";
import { Icons } from "./Icon";
import {
  TextInputControl,
  TextInputControlPropsNoLabel,
} from "./TextInputs/TextInputControl";

import { useState, useRef, useEffect } from "react";

export interface SearchBarProps extends TextInputControlPropsNoLabel {
  buttonText?: string;
  onClick?: () => void;
  placeholder?: string;
}

export function SearchBarInput(props: SearchBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSelected, setDropdownSelected] = useState("movie");

  const dropdownRef = useRef<any>();

  const handleClick = (e: MouseEvent) => {
    if (dropdownRef.current?.contains(e.target as Node)) {
      // inside click
      return;
    }
    // outside click
    closeDropdown();
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 px-4 py-4 sm:pl-8 sm:pr-2 sm:py-2 bg-denim-300 rounded-[28px] hover:bg-denim-400 focus-within:bg-denim-400  transition-colors">
      <TextInputControl
        onChange={props.onChange}
        value={props.value}
        className="placeholder-denim-700 w-full bg-transparent flex-1 focus:outline-none text-white"
        placeholder={props.placeholder}
      />

      <DropdownButton
        icon={Icons.SEARCH}
        open={dropdownOpen}
        setOpen={setDropdownOpen}
        selectedItem={dropdownSelected}
        setSelectedItem={setDropdownSelected}
        options={[
          {
            id: "movie",
            name: "Movie",
            icon: Icons.FILM,
          },
          {
            id: "series",
            name: "Series",
            icon: Icons.CLAPPER_BOARD,
          },
          {
            id: "anime",
            name: "Anime",
            icon: Icons.DRAGON,
          },
        ]}
        onClick={() => setDropdownOpen((old) => !old)}
        ref={dropdownRef}
      >
        {props.buttonText || "Search"}
      </DropdownButton>
    </div>
  );
}
