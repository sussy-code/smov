import { ButtonControlProps, ButtonControl } from "./ButtonControl";
import { Icon, Icons } from "components/Icon";
import React, {
  useRef,
  Ref,
  Dispatch,
  SetStateAction,
  MouseEventHandler,
  KeyboardEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";

import { Backdrop, useBackdrop } from "components/layout/Backdrop";

export interface DropdownButtonProps extends ButtonControlProps {
  icon: Icons;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedItem: string;
  setSelectedItem: Dispatch<SetStateAction<string>>;
  options: Array<OptionItem>;
}

export interface OptionProps {
  option: OptionItem;
  onClick: MouseEventHandler<HTMLDivElement>;
  tabIndex?: number;
}

export interface OptionItem {
  id: string;
  name: string;
  icon: Icons;
}

function Option({ option, onClick, tabIndex }: OptionProps) {
  return (
    <div
      className="text-denim-700 h-10 px-4 py-2 text-left cursor-pointer flex items-center space-x-2 hover:text-white transition-colors"
      onClick={onClick}
      tabIndex={tabIndex}
    >
      <Icon icon={option.icon} />
      <input type="radio" className="hidden" id={option.id} />
      <label htmlFor={option.id} className="cursor-pointer ">
        <div className="item">{option.name}</div>
      </label>
    </div>
  );
}

export const DropdownButton = React.forwardRef<
  HTMLDivElement,
  DropdownButtonProps
>((props, ref) => {
  const [setBackdrop, backdropProps, highlightedProps] = useBackdrop();
  const [delayedSelectedId, setDelayedSelectedId] = useState(
    props.selectedItem
  );

  useEffect(() => {
    let id: NodeJS.Timeout;

    if (props.open) {
      setDelayedSelectedId(props.selectedItem);
    } else {
      id = setTimeout(() => {
        setDelayedSelectedId(props.selectedItem);
      }, 200);
    }
    return () => {
      if (id) clearTimeout(id);
    };
  }, [props.open]);

  const selectedItem: OptionItem = props.options.find(
    (opt) => opt.id === props.selectedItem
  ) || { id: "movie", name: "movie", icon: Icons.ARROW_LEFT };

  useEffect(() => {
    setBackdrop(props.open);
  }, [props.open]);

  const onOptionClick = (e: SyntheticEvent, option: OptionItem) => {
    e.stopPropagation();
    props.setSelectedItem(option.id);
    props.setOpen(false);
  };

  return (
    <div className="w-full sm:w-auto min-w-[140px]">
      <div
        ref={ref}
        className="relative w-full sm:w-auto"
        {...highlightedProps}
      >
        <ButtonControl
          {...props}
          className="flex items-center justify-center sm:justify-left px-4 py-2 space-x-2 bg-bink-200 relative z-20 hover:bg-bink-300 text-white h-10 rounded-[20px] w-full"
        >
          <Icon icon={selectedItem.icon} />
          <span className="flex-1">{selectedItem.name}</span>
          <Icon
            icon={Icons.CHEVRON_DOWN}
            className={`transition-transform ${props.open ? "rotate-180" : ""}`}
          />
        </ButtonControl>
        <div
          className={`absolute pt-[40px] top-0 duration-200 transition-all w-full rounded-[20px] z-10 bg-denim-300 ${
            props.open
              ? "opacity-100 max-h-60 block"
              : "opacity-0 max-h-0 invisible"
          }`}
        >
          {props.options
            .filter((opt) => opt.id != delayedSelectedId)
            .map((opt) => (
              <Option
                option={opt}
                key={opt.id}
                onClick={(e) => onOptionClick(e, opt)}
                tabIndex={
                  props.open ? 0 : undefined
                } /*onKeyPress={active ? handleOptionKeyPress(opt, i) : undefined}*/
              />
            ))}
        </div>
      </div>
      <Backdrop onClick={() => props.setOpen(false)} {...backdropProps} />
    </div>
  );
});
