import { useIsMobile } from "@/hooks/useIsMobile";

export function FloatingDragHandle() {
  const { isMobile } = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="relative z-50 mx-auto my-3 -mb-3 h-1 w-12 rounded-full bg-ash-500 bg-opacity-30" />
  );
}

export function MobilePopoutSpacer() {
  const { isMobile } = useIsMobile();

  if (!isMobile) return null;

  return <div className="h-[200px]" />;
}
