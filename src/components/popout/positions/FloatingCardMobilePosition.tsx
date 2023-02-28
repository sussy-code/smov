import { useSpring, animated, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { ReactNode, useEffect, useRef, useState } from "react";

interface MobilePositionProps {
  children?: ReactNode;
  className?: string;
  onClose?: () => void;
}

export function FloatingCardMobilePosition(props: MobilePositionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const height = 500;
  const closing = useRef<boolean>(false);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);
  const [{ y }, api] = useSpring(() => ({
    y: 0,
    onRest() {
      if (!closing.current) return;
      if (props.onClose) props.onClose();
    },
  }));

  const bind = useDrag(
    ({ last, velocity: [, vy], direction: [, dy], movement: [, my] }) => {
      if (closing.current) return;
      if (last) {
        // if past half height downwards
        // OR Y velocity is past 0.5 AND going down AND 20 pixels below start position
        if (my > height * 0.5 || (vy > 0.5 && dy > 0 && my > 20)) {
          api.start({
            y: height * 1.2,
            immediate: false,
            config: { ...config.wobbly, velocity: vy, clamp: true },
          });
          closing.current = true;
        } else {
          api.start({
            y: 0,
            immediate: false,
            config: config.wobbly,
          });
        }
      } else {
        api.start({ y: my, immediate: true });
      }
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    }
  );

  useEffect(() => {
    if (!ref.current) return;
    function checkBox() {
      const divRect = ref.current?.getBoundingClientRect();
      setCardRect(divRect ?? null);
    }
    checkBox();
    const observer = new ResizeObserver(checkBox);
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="absolute inset-x-0 mx-auto max-w-[400px] origin-bottom-left touch-none"
      style={{
        transform: `translateY(${
          window.innerHeight - (cardRect?.height ?? 0) + 200
        }px)`,
      }}
    >
      <animated.div
        ref={ref}
        className={[props.className ?? "", "touch-none"].join(" ")}
        style={{
          y,
        }}
        {...bind()}
      >
        <div className="mx-auto my-2 mb-4 h-1 w-12 rounded-full bg-ash-500 bg-opacity-30" />
        {props.children}
        <div className="h-[200px]" />
      </animated.div>
    </div>
  );
}
