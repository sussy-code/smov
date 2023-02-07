import { ReactNode, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";

type TransitionAnimations = "slide-down" | "slide-up" | "fade" | "fade-inverse";

interface Props {
  show: boolean;
  durationClass?: string;
  animation: TransitionAnimations;
  className?: string;
  children?: ReactNode;
}

function getClasses(
  animation: TransitionAnimations,
  duration: number
): CSSTransitionClassNames {
  if (animation === "slide-down") {
    return {
      exit: `transition-[transform,opacity] translate-y-0 duration-${duration} opacity-100`,
      exitActive: "!-translate-y-4 !opacity-0",
      exitDone: "hidden",
      enter: `transition-[transform,opacity] -translate-y-4 duration-${duration} opacity-0`,
      enterActive: "!translate-y-0 !opacity-100",
    };
  }

  if (animation === "slide-up") {
    return {
      exit: `transition-[transform,opacity] translate-y-0 duration-${duration} opacity-100`,
      exitActive: "!translate-y-4 !opacity-0",
      exitDone: "hidden",
      enter: `transition-[transform,opacity] translate-y-4 duration-${duration} opacity-0`,
      enterActive: "!translate-y-0 !opacity-100",
    };
  }

  if (animation === "fade") {
    return {
      exit: `transition-[transform,opacity] duration-${duration} opacity-100`,
      exitActive: "!opacity-0",
      exitDone: "hidden",
      enter: `transition-[transform,opacity] duration-${duration} opacity-0`,
      enterActive: "!opacity-100",
    };
  }

  if (animation === "fade-inverse") {
    return {
      enter: `transition-[transform,opacity] duration-${duration} opacity-100`,
      enterActive: "!opacity-0",
      exit: `transition-[transform,opacity] duration-${duration} opacity-0`,
      exitActive: "!opacity-100",
      enterDone: "hidden",
    };
  }

  return {};
}

export function Transition(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const duration = props.durationClass
    ? parseInt(props.durationClass.split("-")[1], 10)
    : 200;
  const classes = getClasses(props.animation, duration);

  return (
    <CSSTransition
      nodeRef={ref}
      in={props.show}
      timeout={duration}
      classNames={classes}
    >
      <div
        ref={ref}
        className={[props.className ?? "", classes.enter ?? ""].join(" ")}
      >
        {props.children}
      </div>
    </CSSTransition>
  );
}
