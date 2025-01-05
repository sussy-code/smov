import classNames from "classnames";
import { ReactNode, useEffect } from "react";

import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { Flare } from "@/components/utils/Flare";
import { Heading2 } from "@/components/utils/Text";

export interface PopupModalProps {
  title: string;
  message: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  styles?: string;
}

export function PopupModal({
  title,
  message,
  closable = true,
  onClose,
  styles,
}: PopupModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className={classNames(
        "fixed inset-0 z-[100] flex items-center justify-center",
        "bg-background-main bg-opacity-75 backdrop-filter backdrop-blur-sm",
        "transition-opacity duration-400",
        "pointer-events-auto",
      )}
    >
      <Flare.Base
        className={classNames(
          "group -m-[0.705em] rounded-3xl bg-background-main transition-colors duration-300 focus:relative focus:z-10",
          "fixed top-0 left-0 right-0 z-50 p-6 bg-mediaCard-hoverBackground bg-opacity-60 backdrop-filter backdrop-blur-lg shadow-lg mx-auto",
        )}
      >
        <div
          className={classNames(
            "transition-transform duration-300",
            "overflow-y-scroll max-h-[90dvh] md:max-h-[90dvh] scrollbar-none",
            styles,
          )}
        >
          <Flare.Light
            flareSize={300}
            cssColorVar="--colors-mediaCard-hoverAccent"
            backgroundClass="bg-mediaCard-hoverBackground duration-100"
            className="rounded-3xl bg-background-main group-hover:opacity-100"
          />
          <Flare.Child className="pointer-events-auto relative mb-2p-[0.4em] transition-transform duration-300">
            <div className="flex justify-between items-center mb-4">
              <Heading2 className="!mt-0 !mb-0 pr-6">{title}</Heading2>
              {closable && (
                <button
                  type="button"
                  className="fixed right-4 text-s font-semibold text-type-secondary hover:text-white transition-transform hover:scale-110"
                  onClick={onClose}
                >
                  <IconPatch icon={Icons.X} />
                </button>
              )}
            </div>
            <p className="text-lg text-type-secondary">{message}</p>
          </Flare.Child>
        </div>
      </Flare.Base>
    </div>
  );
}
