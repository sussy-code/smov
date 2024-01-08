/* eslint-disable @typescript-eslint/ban-types */
import "@plasmohq/messaging";

export interface PlasmoRequestBody {
  ruleId: number;
  domain: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
}

export type PlasmoResponseBody =
  | {
      success: true;
      ruleId: number;
    }
  | {
      success: false;
      error: string;
    };

interface MmMetadata {
  "declarative-net-request": {
    req: PlasmoRequestBody;
    res: PlasmoResponseBody;
  };
  "proxy-request": {
    req: PlasmoRequestBody;
    res: PlasmoResponseBody;
  };
}

interface MpMetadata {}

declare module "@plasmohq/messaging" {
  interface MessagesMetadata extends MmMetadata {}
  interface PortsMetadata extends MpMetadata {}
}
