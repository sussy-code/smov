import { useState } from "react";
import { MWMediaType, MWQuery } from "@/providers";
import { useTranslation } from "react-i18next";
import { DropdownButton } from "./buttons/DropdownButton";
import { Icons } from "./Icon";
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
    <div className="flex flex-col items-center gap-4 rounded-[28px] bg-denim-300 px-4 py-4 transition-colors focus-within:bg-denim-400 hover:bg-denim-400 sm:flex-row sm:py-2 sm:pl-8  sm:pr-2">
      <TextInputControl
        onUnFocus={props.onUnFocus}
        onChange={(val) => setSearch(val)}
        value={props.value.searchQuery}
        className="w-full flex-1 bg-transparent text-white placeholder-denim-700 focus:outline-none"
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
            name: t('searchBar.movie'),
            icon: Icons.FILM,
          },
          {
            id: MWMediaType.SERIES,
            name: t('searchBar.series'),
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
        {props.buttonText || t('searchBar.search')}
      </DropdownButton>
    </div>
  );
}
