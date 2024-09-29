import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Icon, Icons } from "@/components/Icon";

export interface EditButtonProps {
  editing: boolean;
  onEdit?: (editing: boolean) => void;
  id?: string;
}

export function EditButton(props: EditButtonProps) {
  const { t } = useTranslation();
  const [parent] = useAutoAnimate<HTMLSpanElement>();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onClick = useCallback(() => {
    props.onEdit?.(!props.editing);
  }, [props]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        className="flex h-12 items-center overflow-hidden rounded-full bg-background-secondary px-4 py-2 text-white transition-[background-color,transform] hover:bg-background-secondaryHover active:scale-105"
        id={props.id} // Assign id to the button
      >
        <span ref={parent}>
          {props.editing ? (
            <span className="mx-2 sm:mx-4 whitespace-nowrap">
              {t("home.mediaList.stopEditing")}
            </span>
          ) : (
            <Icon icon={Icons.EDIT} />
          )}
        </span>
      </button>

      {props.editing && (
        <button
          type="button"
          onClick={onClick}
          className="fixed bottom-9 right-7 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-background-secondary text-white border-2 border-green-500 transition-[background-color,transform,box-shadow] hover:bg-background-secondaryHover hover:scale-110 cursor-pointer"
          id={props.id ? `${props.id}-check` : undefined} // Optionally use a different id for this button
        >
          <Icon icon={Icons.CHECKMARK} />
        </button>
      )}
    </>
  );
}
