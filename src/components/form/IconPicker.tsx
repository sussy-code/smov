import classNames from "classnames";

import { UserIcon, UserIcons } from "../UserIcon";

export function IconPicker(props: {
  label: string;
  value: UserIcons;
  onInput: (v: UserIcons) => void;
}) {
  // Migrate this to another file later
  const icons = [
    UserIcons.USER,
    UserIcons.BOOKMARK,
    UserIcons.CLOCK,
    UserIcons.EYE_SLASH,
    UserIcons.SEARCH,
  ];

  return (
    <div className="space-y-3">
      {props.label ? (
        <p className="font-bold text-white">{props.label}</p>
      ) : null}

      <div className="flex gap-3">
        {icons.map((icon) => {
          return (
            <button
              type="button"
              tabIndex={0}
              className={classNames(
                "w-full h-10 rounded flex justify-center items-center text-white pointer border-2 border-opacity-10 cursor-pointer",
                props.value === icon
                  ? "bg-buttons-purple border-white"
                  : "bg-authentication-inputBg border-transparent"
              )}
              onClick={() => props.onInput(icon)}
              key={icon}
            >
              <UserIcon className="text-xl" icon={icon} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
