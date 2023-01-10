import fscreen from "fscreen";

export const isSafari = /^((?!chrome|android).)*safari/i.test(
  navigator.userAgent
);
export const canFullscreen = fscreen.fullscreenEnabled || isSafari;
