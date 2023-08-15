import { Source } from "@/components/player/hooks/usePlayer";

type EventMap = Record<string, any>;
type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

export interface Emitter<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void;
}

interface Listener<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
}

export interface DisplayInterface<Events extends EventMap>
  extends Listener<Events> {
  play(): void;
  pause(): void;
  load(source: Source): void;
}
