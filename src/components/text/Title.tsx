export interface TitleProps {
  children?: React.ReactNode;
}

export function Title(props: TitleProps) {
  return (
    <h1 className="mx-auto max-w-xs text-2xl font-bold text-white sm:text-3xl md:text-4xl">
      {props.children}
    </h1>
  );
}
