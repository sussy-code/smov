export function CenterControls(props: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none [&>*]:pointer-events-auto">
      {props.children}
    </div>
  );
}
