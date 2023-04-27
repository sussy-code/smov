import ReactGA from "react-ga4";

import { GA_ID } from "@/setup/constants";

ReactGA.initialize([
  {
    trackingId: GA_ID,
  },
]);
