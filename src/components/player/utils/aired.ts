const hasAiredCache: { [key: string]: boolean } = {};

export function hasAired(date: string) {
  if (hasAiredCache[date]) return hasAiredCache[date];

  const now = new Date();
  const airDate = new Date(date);

  hasAiredCache[date] = airDate < now;
  return hasAiredCache[date];
}
