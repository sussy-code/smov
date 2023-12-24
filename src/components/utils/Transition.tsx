import {
  Transition as HeadlessTransition,
  TransitionClasses,
} from "@headlessui/react";
import { CSSProperties, Fragment, ReactNode } from "react";

export type TransitionAnimations =
  | "slide-down"
  | "slide-full-left"
  | "slide-full-right"
  | "slide-up"
  | "fade"
  | "none";

interface Props {
  show?: boolean;
  durationClass?: string;
  animation: TransitionAnimations;
  className?: string;
  children?: ReactNode;
  isChild?: boolean;
  style?: CSSProperties;
}

function getClasses(
  animation: TransitionAnimations,
  duration: string,
): TransitionClasses {
  if (animation === "slide-down") {
    return {
      leave: `transition-[transform,opacity] ${duration}`,
      leaveFrom: "opacity-100 translate-y-0",
      leaveTo: "-translate-y-4 opacity-0",
      enter: `transition-[transform,opacity] ${duration}`,
      enterFrom: "opacity-0 -translate-y-4",
      enterTo: "translate-y-0 opacity-100",
    };
  }

  if (animation === "slide-up") {
    return {
      leave: `transition-[transform,opacity] ${duration}`,
      leaveFrom: "opacity-100 translate-y-0",
      leaveTo: "translate-y-4 opacity-0",
      enter: `transition-[transform,opacity] ${duration}`,
      enterFrom: "opacity-0 translate-y-4",
      enterTo: "translate-y-0 opacity-100",
    };
  }

  if (animation === "slide-full-left") {
    return {
      leave: `transition-[transform] ${duration}`,
      leaveFrom: "translate-x-0",
      leaveTo: "-translate-x-full",
      enter: `transition-[transform] ${duration}`,
      enterFrom: "-translate-x-full",
      enterTo: "translate-x-0",
    };
  }

  if (animation === "slide-full-right") {
    return {
      leave: `transition-[transform] ${duration}`,
      leaveFrom: "translate-x-0",
      leaveTo: "translate-x-full",
      enter: `transition-[transform] ${duration}`,
      enterFrom: "translate-x-full",
      enterTo: "translate-x-0",
    };
  }

  if (animation === "fade") {
    return {
      leave: `transition-[transform,opacity] ${duration}`,
      leaveFrom: "opacity-100",
      leaveTo: "opacity-0",
      enter: `transition-[transform,opacity] ${duration}`,
      enterFrom: "opacity-0",
      enterTo: "opacity-100",
    };
  }

  return {};
}

export function Transition(props: Props) {
  const duration = props.durationClass ?? "duration-200";
  const classes = getClasses(props.animation, duration);

  if (props.isChild) {
    return (
      <HeadlessTransition.Child as={Fragment} {...classes}>
        <div className={props.className} style={props.style}>
          {props.children}
        </div>
      </HeadlessTransition.Child>
    );
  }

  return (
    <HeadlessTransition show={props.show} as={Fragment} {...classes}>
      <div className={props.className} style={props.style}>
        {props.children}
      </div>
    </HeadlessTransition>
  );
}
