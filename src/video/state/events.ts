export type VideoPlayerEvent =
  | "mediaplaying"
  | "source"
  | "progress"
  | "interface"
  | "meta"
  | "error"
  | "misc";

function createEventString(id: string, event: VideoPlayerEvent): string {
  return `_vid:::${id}:::${event}`;
}

export function sendEvent<T>(id: string, event: VideoPlayerEvent, data: T) {
  const evObj = new CustomEvent(createEventString(id, event), {
    detail: data,
  });
  document.dispatchEvent(evObj);
}

export function listenEvent<T>(
  id: string,
  event: VideoPlayerEvent,
  cb: (data: T) => void
) {
  document.addEventListener<any>(createEventString(id, event), cb);
}

export function unlistenEvent<T>(
  id: string,
  event: VideoPlayerEvent,
  cb: (data: T) => void
) {
  document.removeEventListener<any>(createEventString(id, event), cb);
}
