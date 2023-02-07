import { ReactNode } from "react";
import {
  Transition as HeadlessTransition,
  TransitionClasses,
} from "@headlessui/react";

type TransitionAnimations = "slide-down" | "slide-up" | "fade";

interface Props {
  show: boolean;
  durationClass?: string;
  animation: TransitionAnimations;
  className?: string;
  children?: ReactNode;
}

function getClasses(
  animation: TransitionAnimations,
  extraClasses: string,
  duration: string
): TransitionClasses {
  if (animation === "slide-down") {
    return {
      leave: `transition-[transform,opacity] ${duration} ${extraClasses}`,
      leaveFrom: "opacity-100 translate-y-0",
      leaveTo: "-translate-y-4 opacity-0",
      enter: `transition-[transform,opacity] ${duration} ${extraClasses}`,
      enterFrom: "opacity-0 -translate-y-4",
      enterTo: "translate-y-0 opacity-100",
    };
  }

  if (animation === "slide-up") {
    return {
      leave: `transition-[transform,opacity] ${duration} ${extraClasses}`,
      leaveFrom: "opacity-100 translate-y-0",
      leaveTo: "translate-y-4 opacity-0",
      enter: `transition-[transform,opacity] ${duration} ${extraClasses}`,
      enterFrom: "opacity-0 translate-y-4",
      enterTo: "translate-y-0 opacity-100",
    };
  }

  if (animation === "fade") {
    return {
      leave: `transition-[transform,opacity] ${duration} ${extraClasses}`,
      leaveFrom: "opacity-100",
      leaveTo: "opacity-0",
      enter: `transition-[transform,opacity] ${duration} ${extraClasses}`,
      enterFrom: "opacity-0",
      enterTo: "opacity-100",
    };
  }

  return {};
}

export function Transition(props: Props) {
  const duration = props.durationClass ?? "duration-200";
  const classes = getClasses(props.animation, props.className ?? "", duration);

  return (
    <HeadlessTransition
      show={props.show}
      {...classes}
      entered={props.className}
    >
      {props.children}
    </HeadlessTransition>
  );
}
