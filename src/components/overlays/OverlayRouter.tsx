import { ReactNode } from "react";

import { OverlayAnchorPosition } from "@/components/overlays/positions/OverlayAnchorPosition";
import { OverlayMobilePosition } from "@/components/overlays/positions/OverlayMobilePosition";
import { useIsMobile } from "@/hooks/useIsMobile";

interface OverlayRouterProps {
  children?: ReactNode;
  id: string;
}

export function OverlayRouter(props: OverlayRouterProps) {
  const { isMobile } = useIsMobile();
  const content = props.children;

  if (isMobile) return <OverlayMobilePosition>{content}</OverlayMobilePosition>;
  return <OverlayAnchorPosition id={props.id}>{content}</OverlayAnchorPosition>;
}
