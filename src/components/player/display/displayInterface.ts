import { Source } from "@/components/player/hooks/usePlayer";
import { Listener } from "@/utils/events";

export type DisplayInterfaceEvents = {
  play: void;
  pause: void;
};

export interface DisplayInterface extends Listener<DisplayInterfaceEvents> {
  play(): void;
  pause(): void;
  load(source: Source): void;
}
