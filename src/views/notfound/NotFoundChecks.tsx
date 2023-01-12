import { ReactElement } from "react";

export interface NotFoundChecksProps {
  id: string;
  children?: ReactElement;
}

/*
 ** Component that only renders children if the passed in data is fully correct
 */
export function NotFoundChecks(
  props: NotFoundChecksProps
): ReactElement | null {
  // TODO do notfound check

  return props.children || null;
}
