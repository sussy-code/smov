import { sanitize } from "@/backend/helpers/captions";
import { useSettings } from "@/state/settings";

export function Caption({ text }: { text?: string }) {
  const { captionSettings } = useSettings();
  return (
    <span
      className="pointer-events-none mb-1 select-none px-1 text-center"
      dir="auto"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: sanitize(text || "", {
          // https://www.w3.org/TR/webvtt1/#dom-construction-rules
          ALLOWED_TAGS: ["c", "b", "i", "u", "span", "ruby", "rt"],
          ADD_TAGS: ["v", "lang"],
          ALLOWED_ATTR: ["title", "lang"],
        }),
      }}
      style={{
        ...captionSettings.style,
      }}
    />
  );
}
