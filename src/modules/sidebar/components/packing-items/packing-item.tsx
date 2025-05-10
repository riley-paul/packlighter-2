import React from "react";
import { centerDragPreviewOnMouse, cn } from "@/lib/client/utils";
import { formatWeight } from "@/lib/client/utils";
import Gripper from "@/components/drag-and-drop/gripper";
import invariant from "tiny-invariant";

import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import useDraggableState, {
  type DraggableStateClassnames,
} from "@/hooks/use-draggable-state";
import { DND_TYPE_KEY, DndEntityType } from "@/lib/client/constants";
import { Portal, Text } from "@radix-ui/themes";
import RadixProvider from "@/components/ui/radix-provider";
import PackingItemMenu from "./packing-item-menu";
import type { ItemSelect } from "@/lib/types";

interface Props {
  item: ItemSelect;
  isOverlay?: boolean;
  isIncludedInList?: boolean;
}

const draggableStyles: DraggableStateClassnames = {
  "is-dragging": "opacity-50",
};

const PackingItem: React.FC<Props> = (props) => {
  const { item, isOverlay, isIncludedInList } = props;

  const ref = React.useRef<HTMLDivElement>(null);
  const gripperRef = React.useRef<HTMLButtonElement>(null);

  const itemName = item.name || "Unnamed Gear";

  const { draggableState, setDraggableState, setDraggableIdle } =
    useDraggableState();

  React.useEffect(() => {
    const element = ref.current;
    const gripper = gripperRef.current;
    invariant(element);
    invariant(gripper);

    return draggable({
      element: gripper,
      canDrag: () => !isIncludedInList,
      getInitialData: () => ({
        [DND_TYPE_KEY]: DndEntityType.Item,
        ...item,
      }),
      onGenerateDragPreview({ location, nativeSetDragImage }) {
        setCustomNativeDragPreview({
          nativeSetDragImage,
          getOffset: centerDragPreviewOnMouse(location, element),
          render({ container }) {
            setDraggableState({ type: "preview", container });
          },
        });
      },
      onDragStart() {
        setDraggableState({ type: "is-dragging" });
      },
      onDrop() {
        setDraggableIdle();
      },
    });
  }, [item, isIncludedInList]);

  return (
    <>
      <div
        ref={ref}
        data-item-id={item.id}
        title={itemName || "Unnamed Gear"}
        className={cn(
          "flex w-full items-center gap-2 py-2 pl-3 pr-4 text-left transition-colors ease-in-out hover:bg-accentA-2",
          draggableStyles[draggableState.type],
          isOverlay && "w-64 rounded-2 border bg-gray-2",
          isIncludedInList && "opacity-50",
        )}
      >
        <Gripper ref={gripperRef} />
        <div className="flex flex-1 flex-col">
          <Text
            size="2"
            weight="medium"
            className={cn(!item.name && "text-muted-foreground italic")}
          >
            {itemName}
          </Text>
          <Text size="2" color="gray">
            {item.description}
          </Text>
        </div>
        <Text color="gray" size="2">
          <span>{formatWeight(item.weight)}</span>
          <span>{item.weightUnit}</span>
        </Text>
        <PackingItemMenu item={item} />
      </div>
      {draggableState.type === "preview" ? (
        <Portal container={draggableState.container}>
          <RadixProvider>
            <PackingItem item={item} isOverlay />
          </RadixProvider>
        </Portal>
      ) : null}
    </>
  );
};

export default PackingItem;
