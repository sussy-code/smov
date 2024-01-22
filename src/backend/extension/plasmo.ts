export interface ExtensionBaseRequest {}

export type ExtensionBaseResponse<T = object> =
  | ({
      success: true;
    } & T)
  | {
      success: false;
      error: string;
    };

export type ExtensionHelloResponse = ExtensionBaseResponse<{
  version: string;
  allowed: boolean;
  hasPermission: boolean;
}>;

export interface ExtensionMakeRequest extends ExtensionBaseRequest {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string | FormData | URLSearchParams | Record<string, any>;
}

export type ExtensionMakeRequestResponse<T> = ExtensionBaseResponse<{
  response: {
    statusCode: number;
    headers: Record<string, string>;
    finalUrl: string;
    body: T;
  };
}>;

export interface ExtensionPrepareStreamRequest extends ExtensionBaseRequest {
  ruleId: number;
  targetDomains: string[];
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
}

export interface MmMetadata {
  hello: {
    req: ExtensionBaseRequest;
    res: ExtensionHelloResponse;
  };
  makeRequest: {
    req: ExtensionMakeRequest;
    res: ExtensionMakeRequestResponse<any>;
  };
  prepareStream: {
    req: ExtensionPrepareStreamRequest;
    res: ExtensionBaseResponse;
  };
  openPage: {
    req: ExtensionBaseRequest & {
      page: string;
      redirectUrl: string;
    };
    res: ExtensionBaseResponse;
  };
}

interface MpMetadata {}

declare module "@plasmohq/messaging" {
  interface MessagesMetadata extends MmMetadata {}
  interface PortsMetadata extends MpMetadata {}
}
