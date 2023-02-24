export function normalizeTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/['":]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_");
}
