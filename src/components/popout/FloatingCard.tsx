import { FloatingCardAnchorPosition } from "@/components/popout/positions/FloatingCardAnchorPosition";
import { FloatingCardMobilePosition } from "@/components/popout/positions/FloatingCardMobilePosition";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSpringValue, animated, easings } from "@react-spring/web";
import { ReactNode, useCallback, useEffect, useRef } from "react";

interface FloatingCardProps {
  children?: ReactNode;
  onClose?: () => void;
  for: string;
}

interface RootFloatingCardProps extends FloatingCardProps {
  className?: string;
}

function CardBase(props: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useIsMobile();
  const height = useSpringValue(0, {
    config: { easing: easings.easeInOutSine, duration: 300 },
  });
  const width = useSpringValue(0, {
    config: { easing: easings.easeInOutSine, duration: 300 },
  });

  const getNewHeight = useCallback(() => {
    if (!ref.current) return;
    const children = ref.current.querySelectorAll(
      ":scope *[data-floating-page='true']"
    );
    if (children.length === 0) {
      height.start(0);
      width.start(0);
      return;
    }
    const lastChild = children[children.length - 1];
    const rect = lastChild.getBoundingClientRect();
    if (height.get() === 0) {
      height.set(rect.height);
      width.set(rect.width);
    } else {
      height.start(rect.height);
      width.start(rect.width);
    }
  }, [height, width]);

  useEffect(() => {
    if (!ref.current) return;
    getNewHeight();
    const observer = new MutationObserver(() => {
      getNewHeight();
    });
    observer.observe(ref.current, {
      attributes: false,
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
    };
  }, [getNewHeight]);

  return (
    <animated.div
      ref={ref}
      style={{
        height,
        width: isMobile ? "100%" : width,
      }}
      className="relative flex items-center justify-center overflow-hidden"
    >
      {props.children}
    </animated.div>
  );
}

export function FloatingCard(props: RootFloatingCardProps) {
  const { isMobile } = useIsMobile();
  const content = <CardBase>{props.children}</CardBase>;

  if (isMobile)
    return (
      <FloatingCardMobilePosition
        className={props.className}
        onClose={props.onClose}
      >
        {content}
      </FloatingCardMobilePosition>
    );

  return (
    <FloatingCardAnchorPosition id={props.for} className={props.className}>
      {content}
    </FloatingCardAnchorPosition>
  );
}

export function PopoutFloatingCard(props: FloatingCardProps) {
  return (
    <FloatingCard
      className="overflow-hidden rounded-md bg-ash-300"
      {...props}
    />
  );
}
