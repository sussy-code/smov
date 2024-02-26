export interface HeroTitleProps {
  children?: React.ReactNode;
  className?: string;
}

export function HeroTitle(props: HeroTitleProps) {
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
