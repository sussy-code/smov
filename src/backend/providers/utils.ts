import { DefaultedFetcherOptions } from "@movie-web/providers";

export function makeFullUrl(
  url: string,
  ops?: DefaultedFetcherOptions,
): string {
  // glue baseUrl and rest of url together
  let leftSide = ops?.baseUrl ?? "";
  let rightSide = url;

  // left side should always end with slash, if its set
  if (leftSide.length > 0 && !leftSide.endsWith("/")) leftSide += "/";

  // right side should never start with slash
  if (rightSide.startsWith("/")) rightSide = rightSide.slice(1);

  const fullUrl = leftSide + rightSide;
  if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://"))
    throw new Error(
      `Invald URL -- URL doesn't start with a http scheme: '${fullUrl}'`,
    );

  const parsedUrl = new URL(fullUrl);
  Object.entries(ops?.query ?? {}).forEach(([k, v]) => {
    parsedUrl.searchParams.set(k, v as string);
  });

  return parsedUrl.toString();
}
