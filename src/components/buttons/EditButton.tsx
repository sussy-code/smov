import { Icon, Icons } from "@/components/Icon";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useCallback } from "react";
import { ButtonControl } from "./ButtonControl";

export interface EditButtonProps {
  editing: boolean;
  onEdit?: (editing: boolean) => void;
}

export function EditButton(props: EditButtonProps) {
  const [parent] = useAutoAnimate<HTMLSpanElement>();

  const onClick = useCallback(() => {
    props.onEdit?.(!props.editing);
  }, [props]);

  return (
    <ButtonControl
      onClick={onClick}
      className="flex h-12 items-center overflow-hidden rounded-full bg-denim-400 px-4 py-2 text-white transition-[background-color,transform] hover:bg-denim-500 active:scale-105"
    >
      <span ref={parent}>
        {props.editing ? (
          <span className="mx-4 whitespace-nowrap">Stop editing</span>
        ) : (
          <Icon icon={Icons.EDIT} />
        )}
      </span>
    </ButtonControl>
  );
}
