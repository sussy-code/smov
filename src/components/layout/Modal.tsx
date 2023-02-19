import { Overlay } from "@/components/Overlay";
import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  show: boolean;
  children?: ReactNode;
}

export function ModalFrame(props: { children?: ReactNode }) {
  return <Overlay>{props.children}</Overlay>;
}

export function Modal(props: Props) {
  if (!props.show) return null;
  return createPortal(<ModalFrame>{props.children}</ModalFrame>, document.body);
}

export function ModalCard(props: { children?: ReactNode }) {
  return (
    <div className="relative w-4/5 max-w-[645px] overflow-hidden rounded-lg bg-denim-200 px-10 py-16">
      {props.children}
    </div>
  );
}
