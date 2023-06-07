import { describe, it } from "vitest";

import {
  getMWCaptionTypeFromUrl,
  isSupportedSubtitle,
  parseSubtitles,
} from "@/backend/helpers/captions";
import { MWCaptionType } from "@/backend/helpers/streams";

import {
  ass,
  multilineSubtitlesTestVtt,
  srt,
  visibleSubtitlesTestVtt,
  vtt,
} from "./testdata";

describe("subtitles", () => {
  it("should return true if given url ends with a known subtitle type", ({
    expect,
  }) => {
    expect(isSupportedSubtitle("https://example.com/test.srt")).toBe(true);
    expect(isSupportedSubtitle("https://example.com/test.vtt")).toBe(true);
    expect(isSupportedSubtitle("https://example.com/test.txt")).toBe(false);
  });

  it("should return corresponding MWCaptionType", ({ expect }) => {
    expect(getMWCaptionTypeFromUrl("https://example.com/test.srt")).toBe(
      MWCaptionType.SRT
    );
    expect(getMWCaptionTypeFromUrl("https://example.com/test.vtt")).toBe(
      MWCaptionType.VTT
    );
    expect(getMWCaptionTypeFromUrl("https://example.com/test.txt")).toBe(
      MWCaptionType.UNKNOWN
    );
  });

  it("should throw when empty text is given", ({ expect }) => {
    expect(() => parseSubtitles("")).toThrow("Given text is empty");
  });

  it("should parse srt", ({ expect }) => {
    const parsed = parseSubtitles(srt);
    const parsedSrt = [
      {
        type: "caption",
        index: 1,
        start: 0,
        end: 0,
        duration: 0,
        content: "Test",
        text: "Test",
      },
      {
        type: "caption",
        index: 2,
        start: 0,
        end: 0,
        duration: 0,
        content: "Test",
        text: "Test",
      },
    ];
    expect(parsed).toHaveLength(2);
    expect(parsed).toEqual(parsedSrt);
  });

  it("should parse vtt", ({ expect }) => {
    const parsed = parseSubtitles(vtt);
    const parsedVtt = [
      {
        type: "caption",
        index: 1,
        start: 0,
        end: 4000,
        duration: 4000,
        content: "Where did he go?",
        text: "Where did he go?",
      },
      {
        type: "caption",
        index: 2,
        start: 3000,
        end: 6500,
        duration: 3500,
        content: "I think he went down this lane.",
        text: "I think he went down this lane.",
      },
      {
        type: "caption",
        index: 3,
        start: 4000,
        end: 6500,
        duration: 2500,
        content: "What are you waiting for?",
        text: "What are you waiting for?",
      },
    ];
    expect(parsed).toHaveLength(3);
    expect(parsed).toEqual(parsedVtt);
  });

  it("should parse ass", ({ expect }) => {
    const parsed = parseSubtitles(ass);
    expect(parsed).toHaveLength(3);
  });

  it("should delay subtitles when given a delay", ({ expect }) => {
    const videoTime = 11;
    let delayedSeconds = 0;
    const parsed = parseSubtitles(visibleSubtitlesTestVtt);
    const isVisible = (start: number, end: number, delay: number): boolean => {
      const delayedStart = start / 1000 + delay;
      const delayedEnd = end / 1000 + delay;
      return (
        Math.max(0, delayedStart) <= videoTime &&
        Math.max(0, delayedEnd) >= videoTime
      );
    };
    const visibleSubtitles = parsed.filter((c) =>
      isVisible(c.start, c.end, delayedSeconds)
    );
    expect(visibleSubtitles).toHaveLength(1);

    delayedSeconds = 10;
    const delayedVisibleSubtitles = parsed.filter((c) =>
      isVisible(c.start, c.end, delayedSeconds)
    );
    expect(delayedVisibleSubtitles).toHaveLength(1);

    delayedSeconds = -10;
    const delayedVisibleSubtitles2 = parsed.filter((c) =>
      isVisible(c.start, c.end, delayedSeconds)
    );
    expect(delayedVisibleSubtitles2).toHaveLength(1);

    delayedSeconds = -20;
    const delayedVisibleSubtitles3 = parsed.filter((c) =>
      isVisible(c.start, c.end, delayedSeconds)
    );
    expect(delayedVisibleSubtitles3).toHaveLength(1);
  });

  it("should parse multiline captions", ({ expect }) => {
    const parsed = parseSubtitles(multilineSubtitlesTestVtt);

    expect(parsed[0].text).toBe(`- Test 1\n- Test 2\n- Test 3`);
    expect(parsed[1].text).toBe(`- Test 4`);
    expect(parsed[2].text).toBe(`- Test 6`);
  });
});
