export interface TextInputControlPropsNoLabel {
  onChange?: (data: string) => void;
  value?: string;
}

export interface TextInputControlProps extends TextInputControlPropsNoLabel {
  label?: string;
}

export function TextInputControl({ onChange, value, label }: TextInputControlProps) {
  const input = <input type="text" onChange={(e) => onChange && onChange(e.target.value)} value={value} />

  if (label) {
    return (
      <label>
        <span>{label}</span>
        {input}
      </label>
    )
  }

  return input;
}
