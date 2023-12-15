import { Icon, Icons } from "@/components/Icon";

export function Input(props: {
  value: string;
  onInput: (str: string) => void;
}) {
  return (
    <div className="w-full relative">
      <Icon
        className="pointer-events-none absolute top-1/2 left-3 transform -translate-y-1/2 text-video-context-inputPlaceholder"
        icon={Icons.SEARCH}
      />
      <input
        placeholder="Search"
        className="w-full py-2 px-3 pl-[calc(0.75rem+24px)] tabbable bg-video-context-inputBg rounded placeholder:text-video-context-inputPlaceholder"
        value={props.value}
        onInput={(e) => props.onInput(e.currentTarget.value)}
      />
    </div>
  );
}
