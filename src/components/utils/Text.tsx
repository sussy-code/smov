interface TextProps {
  className?: string;
  children: React.ReactNode;
}

export function Heading1(props: TextProps) {
  return (
    <h1
      className={[
        "text-5xl font-bold text-white mb-9",
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
        "text-3xl font-bold text-white mt-20 mb-9",
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
        props.className ?? "",
      ].join(" ")}
    >
      {props.children}
    </p>
  );
}
