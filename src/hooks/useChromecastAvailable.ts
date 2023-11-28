/// <reference types="chromecast-caf-sender"/>

import { useEffect, useState } from "react";

import { isChromecastAvailable } from "@/setup/chromecast";

export function useChromecastAvailable() {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    isChromecastAvailable((bool) => setAvailable(bool));
  }, []);

  return available;
}
