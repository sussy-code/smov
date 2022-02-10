import { IconButton } from "./Buttons/IconButton";
import { Icons } from "./Icon";
import {
  TextInputControl,
  TextInputControlPropsNoLabel,
} from "./TextInputs/TextInputControl";

export interface SearchBarProps extends TextInputControlPropsNoLabel {
  buttonText?: string;
  onClick?: () => void;
  placeholder?: string;
}

export function SearchBarInput(props: SearchBarProps) {
  return (
    <div className="flex items-center space-x-4 pl-8 pr-2 py-2 bg-dink-500 rounded-full">
      <TextInputControl
        onChange={props.onChange}
        value={props.value}
        className="placeholder-dink-150 bg-transparent flex-1 focus:outline-none text-white"
        placeholder={props.placeholder}
      />
      <IconButton icon={Icons.SEARCH} onClick={props.onClick}>
        {props.buttonText || "Search"}
      </IconButton>
    </div>
  );
}
