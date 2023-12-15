export function sortLangCodes(langCodes: string[]) {
  const languagesOrder = ["en", "hi", "fr", "de", "nl", "pt"].reverse(); // Reverse is neccesary, not sure why

  const results = langCodes.sort((a, b) => {
    if (languagesOrder.indexOf(b) !== -1 || languagesOrder.indexOf(a) !== -1)
      return languagesOrder.indexOf(b) - languagesOrder.indexOf(a);

    return a.localeCompare(b);
  });

  return results;
}
