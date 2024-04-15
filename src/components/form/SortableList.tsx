import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";

import { Icon, Icons } from "../Icon";

function SortableItem(props: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={classNames(
        "bg-dropdown-background hover:bg-dropdown-hoverBackground select-none cursor-pointer space-x-3 flex items-center max-w-[25rem] py-3 px-4 rounded-lg",
        transform && "cursor-grabbing",
      )}
    >
      <span className="flex-1 text-white font-bold">{props.id}</span>
      <Icon icon={Icons.MENU} />
    </div>
  );
}

export function DraggableList(props: {
  items: string[];
  setItems: (items: string[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const currentItems = props.items;
      const oldIndex = currentItems.indexOf(active.id as string);
      const newIndex = currentItems.indexOf(over.id as string);
      const newItems = arrayMove(currentItems, oldIndex, newIndex);
      props.setItems(newItems);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={props.items}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {props.items.map((id) => (
            <SortableItem key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
