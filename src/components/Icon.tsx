export enum Icons {
  SEARCH = "search",
}

export interface IconProps {
  icon: Icons;
}

const iconList = {
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
}

export function Icon(props: IconProps) {
  return <span dangerouslySetInnerHTML={{ __html: iconList[props.icon] }} />;
}
