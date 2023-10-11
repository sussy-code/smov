import { usePlayerStore } from "@/stores/player/store";

export function Title() {
  const title = usePlayerStore((s) => s.meta?.title);
  return <p>{title}</p>;
}
