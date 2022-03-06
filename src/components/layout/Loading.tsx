export interface LoadingProps {
  text?: string;
  className?: string;
}

export function Loading(props: LoadingProps) {
  return (
    <div className={props.className}>
      <div className="flex flex-col items-center justify-center">
        <div className="flex h-12 items-center justify-center">
          <div className="animate-loading-pin bg-denim-300 mx-1 h-2 w-2 rounded-full" />
          <div className="animate-loading-pin bg-denim-300 mx-1 h-2 w-2 rounded-full [animation-delay:150ms]" />
          <div className="animate-loading-pin bg-denim-300 mx-1 h-2 w-2 rounded-full [animation-delay:300ms]" />
          <div className="animate-loading-pin bg-denim-300 mx-1 h-2 w-2 rounded-full [animation-delay:450ms]" />
        </div>
        {props.text && props.text.length ? (
          <p className="mt-3 max-w-xs text-sm opacity-75">{props.text}</p>
        ) : null}
      </div>
    </div>
  );
}
