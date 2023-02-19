export interface TitleProps {
  children?: React.ReactNode;
  className?: string;
}

export function Title(props: TitleProps) {
  return (
    <h1
      className={`text-2xl font-bold text-white sm:text-3xl md:text-4xl ${
        props.className ?? ""
      }`}
    >
      {props.children}
    </h1>
  );
}
