import { ReactNode } from "react";
import {
  Transition as HeadlessTransition,
  TransitionClasses,
} from "@headlessui/react";

type TransitionAnimations = "slide-down" | "slide-up" | "fade";

interface Props {
  show: boolean;
  durationClass?: "duration-200" | string; // default is specified so tailwind doesnt remove the class in prod builds
  animation: TransitionAnimations;
  className?: string;
  children?: ReactNode;
}

function getClasses(
  animation: TransitionAnimations,
  duration: number
): TransitionClasses {
  if (animation === "slide-down") {
    return {
      leave: `transition-[transform,opacity] duration-${duration}`,
      leaveFrom: "opacity-100 translate-y-0",
      leaveTo: "-translate-y-4 opacity-0",
      enter: `transition-[transform,opacity] duration-${duration}`,
      enterFrom: "opacity-0 -translate-y-4",
      enterTo: "translate-y-0 opacity-100",
    };
  }

  if (animation === "slide-up") {
    return {
      leave: `transition-[transform,opacity] duration-${duration}`,
      leaveFrom: "opacity-100 translate-y-0",
      leaveTo: "translate-y-4 opacity-0",
      enter: `transition-[transform,opacity] duration-${duration}`,
      enterFrom: "opacity-0 translate-y-4",
      enterTo: "translate-y-0 opacity-100",
    };
  }

  if (animation === "fade") {
    return {
      leave: `transition-[transform,opacity] duration-${duration}`,
      leaveFrom: "opacity-100",
      leaveTo: "opacity-0",
      enter: `transition-[transform,opacity] duration-${duration}`,
      enterFrom: "opacity-0",
      enterTo: "opacity-100",
    };
  }

  return {};
}

export function Transition(props: Props) {
  const duration = props.durationClass
    ? parseInt(props.durationClass.split("-")[1], 10)
    : 200;
  const classes = getClasses(props.animation, duration);

  return (
    <div className={props.className}>
      <HeadlessTransition show={props.show} {...classes}>
        {props.children}
      </HeadlessTransition>
    </div>
  );
}
