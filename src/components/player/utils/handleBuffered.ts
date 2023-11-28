export function handleBuffered(time: number, buffered: TimeRanges): number {
  // TODO normalize the buffer sections into one section. they can be stitched together
  for (let i = 0; i < buffered.length; i += 1) {
    if (buffered.start(buffered.length - 1 - i) < time) {
      return buffered.end(buffered.length - 1 - i);
    }
  }
  return 0;
}
