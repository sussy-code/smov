import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
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

export interface Item {
  id: string;
  name: string;
  disabled?: boolean;
}

function SortableItem(props: { item: Item }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.item.id });

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
        "bg-dropdown-background hover:bg-dropdown-hoverBackground select-none space-x-3 flex items-center max-w-[25rem] py-3 px-4 rounded-lg touch-manipulation",
        props.item.disabled && "opacity-50",
        transform ? "cursor-grabbing" : "cursor-grab",
      )}
    >
      <span className="flex-1 text-white font-bold">{props.item.name}</span>
      {props.item.disabled && <Icon icon={Icons.WARNING} />}
      <Icon icon={Icons.MENU} />
    </div>
  );
}

export function SortableList(props: {
  items: Item[];
  setItems: (items: Item[]) => void;
}) {
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 75,
        tolerance: 1,
      },
    }),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const currentItems = props.items;
      const oldIndex = currentItems.findIndex((item) => item.id === active.id);
      const newIndex = currentItems.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(currentItems, oldIndex, newIndex);
      props.setItems(newItems);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={props.items}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {props.items.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
