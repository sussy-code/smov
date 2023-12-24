import classNames from "classnames";

import { Icon, Icons } from "../Icon";

const colors = ["#0A54FF", "#CF2E68", "#F9DD7F", "#7652DD", "#2ECFA8"];
export const initialColor = colors[0];

export function ColorPicker(props: {
  label: string;
  value: string;
  onInput: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      {props.label ? (
        <p className="font-bold text-white">{props.label}</p>
      ) : null}

      <div className="flex gap-3">
        {colors.map((color) => {
          return (
            <button
              type="button"
              tabIndex={0}
              className={classNames(
                "w-full h-10 rounded flex justify-center items-center text-white pointer border-2 border-opacity-10 cursor-pointer",
                props.value === color ? "border-white" : "border-transparent",
              )}
              onClick={() => props.onInput(color)}
              style={{ backgroundColor: color }}
              key={color}
            >
              {props.value === color ? <Icon icon={Icons.CHECKMARK} /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
