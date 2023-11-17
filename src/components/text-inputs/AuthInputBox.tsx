import { TextInputControl } from "./TextInputControl";

export function AuthInputBox(props: {
  value?: string;
  label?: string;
  placeholder?: string;
  onChange?: (data: string) => void;
}) {
  return (
    <div className="space-y-3">
      {props.label ? (
        <p className="font-bold text-white">{props.label}</p>
      ) : null}
      <TextInputControl
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        className="w-full flex-1 bg-authentication-inputBg px-4 py-3 text-search-text focus:outline-none rounded-lg placeholder:text-gray-700"
      />
    </div>
  );
}
