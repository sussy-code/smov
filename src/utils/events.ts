export type EventMap = Record<string, any>;
type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

export interface Emitter<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void;
}

export interface Listener<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
}

export function makeEmitter<T extends EventMap>(): Emitter<T> {
  const listeners: Partial<
    Record<EventKey<T>, ((...params: any[]) => void)[]>
  > = {};

  return {
    on(eventName, fn) {
      if (!listeners[eventName]) listeners[eventName] = [];
      listeners[eventName]?.push(fn);
    },
    off(eventName, fn) {
      listeners[eventName] =
        listeners[eventName]?.filter((v) => v !== fn) ?? [];
    },
    emit(eventName, params) {
      (listeners[eventName] ?? []).forEach((fn) => fn(params));
    },
  };
}
