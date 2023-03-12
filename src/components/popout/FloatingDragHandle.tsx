import { useIsMobile } from "@/hooks/useIsMobile";

export function FloatingDragHandle() {
  const { isMobile } = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="mx-auto my-2 mb-2 h-1 w-12 rounded-full bg-ash-500 bg-opacity-30" />
  );
}

export function MobilePopoutSpacer() {
  const { isMobile } = useIsMobile();

  if (!isMobile) return null;

  return <div className="h-[200px]" />;
}
