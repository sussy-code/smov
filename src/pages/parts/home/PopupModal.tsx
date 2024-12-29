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
}

export function PopupModal({
  title,
  message,
  closable = true,
  onClose,
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
      <Flare.Base className="group -m-[0.705em] rounded-xl bg-background-main transition-colors duration-300 focus:relative focus:z-10">
        <div
          className={classNames(
            "fixed top-0 left-0 right-0 z-50 p-6 bg-mediaCard-hoverBackground bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg",
            "max-w-md mx-auto mt-12",
            "transition-transform duration-300",
          )}
        >
          <Flare.Light
            flareSize={300}
            cssColorVar="--colors-mediaCard-hoverAccent"
            backgroundClass="bg-mediaCard-hoverBackground duration-100"
            className="rounded-xl bg-background-main group-hover:opacity-100"
          />
          <Flare.Child className="pointer-events-auto relative mb-2 p-[0.4em] transition-transform duration-300">
            <div className="flex justify-between items-center mb-4">
              <Heading2 className="!mt-0 !mb-0">{title}</Heading2>
              {closable && (
                <button
                  type="button"
                  className="text-s font-semibold text-type-secondary hover:text-white transition-transform hover:scale-110"
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
