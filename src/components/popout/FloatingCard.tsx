import { animated, easings, useSpringValue } from "@react-spring/web";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { FloatingCardAnchorPosition } from "@/components/popout/positions/FloatingCardAnchorPosition";
import { FloatingCardMobilePosition } from "@/components/popout/positions/FloatingCardMobilePosition";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PopoutSection } from "@/video/components/popouts/PopoutUtils";

import { FloatingDragHandle, MobilePopoutSpacer } from "./FloatingDragHandle";
import { Icon, Icons } from "../Icon";

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
  const [pages, setPages] = useState<NodeListOf<Element> | null>(null);

  const getNewHeight = useCallback(
    (updateList = true) => {
      if (!ref.current) return;
      const children = ref.current.querySelectorAll(
        ":scope *[data-floating-page='true']"
      );
      if (updateList) setPages(children);
      if (children.length === 0) {
        height.start(0);
        width.start(0);
        return;
      }
      const lastChild = children[children.length - 1];
      const rect = lastChild.getBoundingClientRect();
      const rectHeight = lastChild.scrollHeight;
      if (height.get() === 0) {
        height.set(rectHeight);
        width.set(rect.width);
      } else {
        height.start(rectHeight);
        width.start(rect.width);
      }
    },
    [height, width]
  );

  useEffect(() => {
    if (!ref.current) return;
    getNewHeight();
    const observer = new MutationObserver(() => {
      getNewHeight();
    });
    observer.observe(ref.current, {
      attributes: false,
      childList: true,
      subtree: false,
    });
    return () => {
      observer.disconnect();
    };
  }, [getNewHeight]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      getNewHeight(false);
    });
    pages?.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
    };
  }, [pages, getNewHeight]);

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

export const FloatingCardView = {
  Header(props: {
    title: string;
    description: string;
    close?: boolean;
    goBack: () => any;
    action?: React.ReactNode;
    backText?: string;
  }) {
    const { t } = useTranslation();

    let left = (
      <div
        onClick={props.goBack}
        className="flex cursor-pointer items-center space-x-2 transition-colors duration-200 hover:text-white"
      >
        <Icon icon={Icons.ARROW_LEFT} />
        <span>{props.backText || t("videoPlayer.popouts.back")}</span>
      </div>
    );
    if (props.close)
      left = (
        <div
          onClick={props.goBack}
          className="flex cursor-pointer items-center space-x-2 transition-colors duration-200 hover:text-white"
        >
          <Icon icon={Icons.X} />
          <span>{t("videoPlayer.popouts.close")}</span>
        </div>
      );

    return (
      <div className="flex flex-col bg-[#1C161B]">
        <FloatingDragHandle />
        <PopoutSection>
          <div className="flex justify-between">
            <div>{left}</div>
            <div>{props.action ?? null}</div>
          </div>

          <h2 className="mb-2 mt-8 text-3xl font-bold text-white">
            {props.title}
          </h2>
          <p>{props.description}</p>
        </PopoutSection>
      </div>
    );
  },
  Content(props: { children: React.ReactNode; noSection?: boolean }) {
    return (
      <div className="grid h-full grid-rows-[1fr]">
        {props.noSection ? (
          <div className="relative h-full overflow-y-auto bg-ash-300">
            {props.children}
          </div>
        ) : (
          <PopoutSection className="relative h-full overflow-y-auto bg-ash-300">
            {props.children}
          </PopoutSection>
        )}
        <MobilePopoutSpacer />
      </div>
    );
  },
};
