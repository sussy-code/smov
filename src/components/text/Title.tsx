export interface TitleProps {
  children?: React.ReactNode;
}

export function Title(props: TitleProps) {
  return <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{props.children}</h1>;
}
