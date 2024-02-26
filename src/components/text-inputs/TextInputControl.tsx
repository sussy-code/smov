import classNames from "classnames";
import { forwardRef, useState } from "react";

import { Icon, Icons } from "../Icon";

export interface TextInputControlPropsNoLabel {
  onChange?: (data: string) => void;
  onUnFocus?: () => void;
  onFocus?: () => void;
  value?: string;
  name?: string;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
  passwordToggleable?: boolean;
}

export interface TextInputControlProps extends TextInputControlPropsNoLabel {
  label?: string;
}

export const TextInputControl = forwardRef<
  HTMLInputElement,
  TextInputControlProps
>(
  (
    {
      onChange,
      onUnFocus,
      value,
      label,
      name,
      autoComplete,
      className,
      placeholder,
      onFocus,
      passwordToggleable,
    },
    ref,
  ) => {
    let inputType = "text";
    const [showPassword, setShowPassword] = useState(true);
    if (passwordToggleable) inputType = showPassword ? "password" : "text";

    const input = (
      <div className="relative">
        <input
          type={inputType}
          ref={ref}
          className={classNames(className, passwordToggleable && "pr-12")}
          placeholder={placeholder}
          onChange={(e) => onChange && onChange(e.target.value)}
          value={value}
          name={name}
          autoComplete={autoComplete}
          onBlur={() => onUnFocus && onUnFocus()}
          onFocus={() => onFocus?.()}
          onKeyDown={(e) =>
            e.key === "Enter" ? (e.target as HTMLInputElement).blur() : null
          }
        />
        {passwordToggleable ? (
          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 right-1 text-xl p-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Icon icon={showPassword ? Icons.EYE : Icons.EYE_SLASH} />
          </button>
        ) : null}
      </div>
    );

    if (label) {
      return (
        <label>
          <span>{label}</span>
          {input}
        </label>
      );
    }

    return input;
  },
);
