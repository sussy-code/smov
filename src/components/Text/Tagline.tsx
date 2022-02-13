export interface TaglineProps {
  children?: React.ReactNode;
}

export function Tagline(props: TaglineProps) {
  return <p className="font-bold text-bink-600">{props.children}</p>;
}
