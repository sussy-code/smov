export function Loading() {
  return (
    <div className="flex items-center h-12 justify-center">
      <div className="w-2 mx-1 h-2 rounded-full animate-loading-pin bg-denim-300"></div>
      <div className="w-2 mx-1 h-2 rounded-full [animation-delay:150ms] animate-loading-pin bg-denim-300"></div>
      <div className="w-2 mx-1 h-2 rounded-full [animation-delay:300ms] animate-loading-pin bg-denim-300"></div>
      <div className="w-2 mx-1 h-2 rounded-full [animation-delay:450ms] animate-loading-pin bg-denim-300"></div>
    </div>
  );
}
