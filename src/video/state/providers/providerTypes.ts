export type VideoPlayerStateController = {
  pause: () => void;
  play: () => void;
};

export type VideoPlayerStateProvider = VideoPlayerStateController & {
  providerStart: () => {
    destroy: () => void;
  };
};
