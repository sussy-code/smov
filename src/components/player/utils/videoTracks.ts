export interface VideoTrack {
  selected: boolean;
  id: string;
  kind: string;
  label: string;
  language: string;
}

export type VideoTrackList = Array<VideoTrack> & {
  selectedIndex: number;
  getTrackById(id: string): VideoTrack | null;
  addEventListener(type: "change", listener: (ev: Event) => any): void;
};

export function getVideoTracks(video: HTMLVideoElement): VideoTrackList | null {
  const videoAsAny = video as any;
  if (!videoAsAny.videoTracks) return null;
  return videoAsAny.videoTracks;
}
