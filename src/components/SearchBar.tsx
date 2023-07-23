import { MWQuery } from "@/backend/metadata/types/mw";

import { Icon, Icons } from "./Icon";
import { TextInputControl } from "./text-inputs/TextInputControl";

export interface SearchBarProps {
  placeholder?: string;
  onChange: (value: MWQuery, force: boolean) => void;
  onUnFocus: () => void;
  value: MWQuery;
}

export function SearchBarInput(props: SearchBarProps) {
  function setSearch(value: string) {
    props.onChange(
      {
        ...props.value,
        searchQuery: value,
      },
      false
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
    </div>
  );
}
