function normalizeTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/['":]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_");
}

export function compareTitle(a: string, b: string): boolean {
  return normalizeTitle(a) === normalizeTitle(b);
}
