import { forwardRef } from "react";

export interface TextInputControlPropsNoLabel {
  onChange?: (data: string) => void;
  onUnFocus?: () => void;
  onFocus?: () => void;
  value?: string;
  name?: string;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
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
    },
    ref
  ) => {
    const input = (
      <input
        type="text"
        ref={ref}
        className={className}
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
  }
);
