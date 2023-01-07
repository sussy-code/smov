interface MediaGridProps {
  children?: React.ReactNode;
}

export function MediaGrid(props: MediaGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
      {props.children}
    </div>
  );
}
