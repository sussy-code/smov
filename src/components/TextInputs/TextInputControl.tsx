export interface TextInputControlPropsNoLabel {
  onChange?: (data: string) => void;
  value?: string;
  placeholder?: string;
  className?: string;
}

export interface TextInputControlProps extends TextInputControlPropsNoLabel {
  label?: string;
}

export function TextInputControl({
  onChange,
  value,
  label,
  className,
  placeholder,
}: TextInputControlProps) {
  const input = (
    <input
      type="text"
      className={className}
      placeholder={placeholder}
      onChange={(e) => onChange && onChange(e.target.value)}
      value={value}
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
