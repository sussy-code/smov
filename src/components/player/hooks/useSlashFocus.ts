import { useEffect } from "react";

export function useSlashFocus(ref: React.RefObject<HTMLInputElement>) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "/") {
        if (
          document.activeElement &&
          document.activeElement.tagName.toLowerCase() === "input"
        )
          return;
        e.preventDefault();
        ref.current?.focus();
      }
    };

    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [ref]);
}
