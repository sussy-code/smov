import { useSettings } from "@/state/settings";

export function Caption({ text }: { text?: string }) {
  const { captionSettings } = useSettings();
  return (
    <span
      className="pointer-events-none mb-1 select-none px-1 text-center"
      /*
        WebVTT files may have html elements (such as <i>, <b>) in them 
        but if we want full customization we will have to 
        remove tags with a regex from raw text
      */
      dangerouslySetInnerHTML={{ __html: text ?? "" }}
      style={{
        ...captionSettings.style,
      }}
    />
  );
}
