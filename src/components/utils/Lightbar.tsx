import "./Lightbar.css";

export function Lightbar(props: { className?: string }) {
  return (
    <div className={props.className}>
      <div className="lightbar" />
    </div>
  );
}
