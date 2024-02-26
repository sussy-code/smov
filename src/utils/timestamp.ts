// Convert `t` param to time. Supports having only seconds (like `?t=192`), but also `3:30` or `1:30:02`
export function parseTimestamp(str: string | undefined | null): number | null {
  const input = str ?? "";
  const isValid = !!input.match(/^\d+(:\d+)*$/);
  if (!isValid) return null;

  const timeArr = input.split(":").map(Number).reverse();
  const hours = timeArr[2] ?? 0;
  const minutes = Math.min(timeArr[1] ?? 0, 59);
  const seconds = Math.min(timeArr[0] ?? 0, minutes > 0 ? 59 : Infinity);

  const timeInSeconds = hours * 60 * 60 + minutes * 60 + seconds;
  return timeInSeconds;
}
