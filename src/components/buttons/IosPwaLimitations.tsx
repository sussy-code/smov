/* eslint-disable no-alert */
import { Icon, Icons } from "../Icon";

function IosPwaLimitations() {
  const showAlert = () => {
    alert(
      "Due to Apple’s limitations, Picture-in-Picture (PiP) and Fullscreen are disabled on iOS PWAs. Use the browser vertion to re-enable these features.\n" +
        "Tip: To hide the iOS home indicator, use guided access within the PWA!",
    );
  };

  return (
    <button
      type="button"
      onClick={showAlert}
      className="tabbable p-2 rounded-full hover:bg-video-buttonBackground hover:bg-opacity-50 transition-transform duration-100 flex items-center gap-3 active:scale-110 active:bg-opacity-75 active:text-white"
    >
      <Icon className="text-2xl" icon={Icons.CIRCLE_QUESTION} />
    </button>
  );
}

export default IosPwaLimitations;
