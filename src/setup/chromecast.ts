const CHROMECAST_SENDER_SDK =
  "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";

const callbacks: ((available: boolean) => void)[] = [];
let _available: boolean | null = null;

function init(available: boolean) {
  _available = available;
  callbacks.forEach((cb) => cb(available));
}

export function isChromecastAvailable(cb: (available: boolean) => void) {
  if (_available !== null) return cb(_available);
  callbacks.push(cb);
}

export function initializeChromecast() {
  window.__onGCastApiAvailable = (isAvailable) => {
    init(isAvailable);
  };

  // add script if doesnt exist yet
  const exists = !!document.getElementById("chromecast-script");
  if (!exists) {
    const script = document.createElement("script");
    script.setAttribute("src", CHROMECAST_SENDER_SDK);
    script.setAttribute("id", "chromecast-script");
    document.body.appendChild(script);
  }
}
