import { useEffect, useState } from "react";

export function useIsTV() {
  const [isTV, setIsTV] = useState(false);

  useEffect(() => {
    function detectTV() {
      const userAgent = navigator.userAgent || "";

      const tvKeywords = [
        "Silk",
        "SmartTV",
        "Tizen",
        "Web0S",
        "SamsungBrowser",
        "HbbTV",
        "Viera",
        "NetCast",
        "AppleTV",
        "Android TV",
        "GoogleTV",
        "Roku",
        "PlayStation",
        "Xbox",
        "Opera TV",
        "AquosBrowser",
        "Hisense",
        "SonyBrowser",
        "SharpBrowser",
        "AFT", // Amazon Fire TV
        "Chromecast",
      ];

      const isTVDetected = tvKeywords.some((keyword) =>
        userAgent.toLowerCase().includes(keyword.toLowerCase()),
      );

      if (isTVDetected) {
        setIsTV(true);
      }
    }

    detectTV();
  }, []);

  return {
    isTV,
  };
}
