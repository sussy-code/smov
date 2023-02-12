import "./Spinner.css";

interface SpinnerProps {
  className?: string;
}

export function Spinner(props: SpinnerProps) {
  return <div className={["spinner", props.className ?? ""].join(" ")} />;
}
