import ReactGA from "react-ga4";

import { GA_ID } from "@/setup/constants";

if (GA_ID) {
  ReactGA.initialize([
    {
      trackingId: GA_ID,
    },
  ]);
}
