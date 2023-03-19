declare module "node-webvtt" {
  interface Cue {
    identifier: string;
    start: number;
    end: number;
    text: string;
    styles: string;
  }
  interface Options {
    meta?: boolean;
    strict?: boolean;
  }
  type ParserError = Error;
  interface ParseResult {
    valid: boolean;
    strict: boolean;
    cues: Cue[];
    errors: ParserError[];
    meta?: Map<string, string>;
  }
  interface Segment {
    duration: number;
    cues: Cue[];
  }
  function parse(text: string, options: Options): ParseResult;
  function segment(input: string, segmentLength?: number): Segment[];
}
