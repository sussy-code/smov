import { ReactNode, useEffect, useState } from "react";

interface LazyTabContentProps {
  isActive: boolean;
  children: ReactNode;
  preloadWhenInactive?: boolean;
}

export function LazyTabContent({
  isActive,
  children,
  preloadWhenInactive = false,
}: LazyTabContentProps) {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Load content when tab becomes active or if preload is enabled
    if (isActive || preloadWhenInactive) {
      setHasLoaded(true);
    }
  }, [isActive, preloadWhenInactive]);

  // Only render children if the tab has been loaded
  return (
    <div style={{ display: isActive ? "block" : "none" }}>
      {hasLoaded ? children : null}
    </div>
  );
}
