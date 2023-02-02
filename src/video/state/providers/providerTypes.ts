export type VideoPlayerStateProvider = {
  pause: () => void;
  play: () => void;
  providerStart: () => {
    destroy: () => void;
  };
};
