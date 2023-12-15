interface TextProps {
  className?: string;
  children: React.ReactNode;
  border?: boolean;
}

const borderClass = "pb-4 border-b border-utils-divider border-opacity-50";

export function Heading1(props: TextProps) {
  return (
    <h1
      className={[
        "text-3xl lg:text-5xl font-bold text-white mb-9",
        props.border ? borderClass : null,
        props.className ?? "",
      ].join(" ")}
    >
      {props.children}
    </h1>
  );
}

export function Heading2(props: TextProps) {
  return (
    <h2
      className={[
        "text-xl lg:text-2xl font-bold text-white mt-20 mb-9",
        props.border ? borderClass : null,
        props.className ?? "",
      ].join(" ")}
    >
      {props.children}
    </h2>
  );
}

export function Heading3(props: TextProps) {
  return (
    <h2
      className={[
        "text-lg lg:text-xl font-bold text-white mb-3",
        props.border ? borderClass : null,
        props.className ?? "",
      ].join(" ")}
    >
      {props.children}
    </h2>
  );
}

export function Paragraph(props: TextProps) {
  return (
    <p
      className={[
        "text-type-text my-9 font-medium",
        props.border ? borderClass : null,
        props.className ?? "",
      ].join(" ")}
    >
      {props.children}
    </p>
  );
}
