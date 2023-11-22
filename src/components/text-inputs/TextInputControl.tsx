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

export function TextInputControl({
  onChange,
  onUnFocus,
  value,
  label,
  name,
  autoComplete,
  className,
  placeholder,
  onFocus,
}: TextInputControlProps) {
  const input = (
    <input
      type="text"
      className={className}
      placeholder={placeholder}
      onChange={(e) => onChange && onChange(e.target.value)}
      value={value}
      name={name}
      autoComplete={autoComplete}
      onBlur={() => onUnFocus && onUnFocus()}
      onFocus={() => onFocus?.()}
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
