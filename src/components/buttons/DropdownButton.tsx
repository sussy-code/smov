import React, {
  MouseEventHandler,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";

import { Icon, Icons } from "@/components/Icon";
import { BackdropContainer, useBackdrop } from "@/components/layout/Backdrop";

import { ButtonControl, ButtonControlProps } from "./ButtonControl";

export interface OptionItem {
  id: string;
  name: string;
  icon: Icons;
}

interface DropdownButtonProps extends ButtonControlProps {
  icon: Icons;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedItem: string;
  setSelectedItem: (value: string) => void;
  options: Array<OptionItem>;
}

export interface OptionProps {
  option: OptionItem;
  onClick: MouseEventHandler<HTMLDivElement>;
  tabIndex?: number;
}

function Option({ option, onClick, tabIndex }: OptionProps) {
  return (
    <div
      className="flex h-10 cursor-pointer items-center space-x-2 px-4 py-2 text-left text-denim-700 transition-colors hover:text-white"
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
>((props: DropdownButtonProps, ref) => {
  const [setBackdrop, backdropProps, highlightedProps] = useBackdrop();
  const [delayedSelectedId, setDelayedSelectedId] = useState(
    props.selectedItem
  );

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;

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
    /* eslint-disable-next-line */
  }, [props.open]);

  const selectedItem: OptionItem = props.options.find(
    (opt) => opt.id === props.selectedItem
  ) || { id: "movie", name: "movie", icon: Icons.ARROW_LEFT };

  useEffect(() => {
    setBackdrop(props.open);
    /* eslint-disable-next-line */
  }, [props.open]);

  const onOptionClick = (e: SyntheticEvent, option: OptionItem) => {
    e.stopPropagation();
    props.setSelectedItem(option.id);
    props.setOpen(false);
  };

  return (
    <div className="w-full min-w-[140px] sm:w-auto">
      <div
        ref={ref}
        className="relative w-full sm:w-auto"
        {...highlightedProps}
      >
        <BackdropContainer
          onClick={() => props.setOpen(false)}
          {...backdropProps}
        >
          <ButtonControl
            {...props}
            className="sm:justify-left relative z-20 flex h-10 w-full items-center justify-center space-x-2 rounded-[20px] bg-bink-400 px-4 py-2 text-white hover:bg-bink-300"
          >
            <Icon icon={selectedItem.icon} />
            <span className="flex-1">{selectedItem.name}</span>
            <Icon
              icon={Icons.CHEVRON_DOWN}
              className={`transition-transform ${
                props.open ? "rotate-180" : ""
              }`}
            />
          </ButtonControl>
          <div
            className={`absolute top-0 z-10 w-full rounded-[20px] bg-denim-300 pt-[40px] transition-all duration-200 ${
              props.open
                ? "block max-h-60 opacity-100"
                : "invisible max-h-0 opacity-0"
            }`}
          >
            {props.options
              .filter((opt) => opt.id !== delayedSelectedId)
              .map((opt) => (
                <Option
                  option={opt}
                  key={opt.id}
                  onClick={(e) => onOptionClick(e, opt)}
                  tabIndex={props.open ? 0 : undefined}
                />
              ))}
          </div>
        </BackdropContainer>
      </div>
    </div>
  );
});
