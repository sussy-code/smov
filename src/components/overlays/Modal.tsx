import { ReactNode, useCallback } from "react";
import { Helmet } from "react-helmet-async";

import { OverlayPortal } from "@/components/overlays/OverlayDisplay";
import { useQueryParam } from "@/hooks/useQueryParams";

export function useModal(id: string) {
  const [currentModal, setCurrentModal] = useQueryParam("m");
  const show = useCallback(() => setCurrentModal(id), [id, setCurrentModal]);
  const hide = useCallback(() => setCurrentModal(null), [setCurrentModal]);
  return {
    id,
    isShown: currentModal === id,
    show,
    hide,
  };
}

export function ModalCard(props: { children?: ReactNode }) {
  return (
    <div className="w-[30rem] max-w-full">
      <div className="w-full bg-dropdown-background rounded-xl p-8 m-4 pointer-events-auto">
        {props.children}
      </div>
    </div>
  );
}

export function Modal(props: { id: string; children?: ReactNode }) {
  const modal = useModal(props.id);

  return (
    <OverlayPortal darken close={modal.hide} show={modal.isShown}>
      <Helmet>
        <html data-no-scroll />
      </Helmet>
      <div className="flex absolute inset-0 items-center justify-center flex-col">
        {props.children}
      </div>
    </OverlayPortal>
  );
}
