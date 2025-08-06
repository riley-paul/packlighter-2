import {
  centerDragPreviewOnMouse,
  cn,
  triggerElementFlash,
} from "@/lib/client/utils";
import React from "react";
import invariant from "tiny-invariant";

import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import Gripper from "@/app/components/drag-and-drop/gripper";
import useDraggableState from "@/app/hooks/use-draggable-state";
import {
  DND_TYPE_KEY,
  DndEntityType,
  isDndEntityType,
} from "@/lib/client/constants";
import useCurrentList from "@/app/hooks/use-current-list";
import { Portal, Text } from "@radix-ui/themes";
import { useSetAtom } from "jotai";
import { mobileSidebarOpenAtom } from "@/app/modules/sidebar/sidebar.store";
import { listLinkOptions } from "@/lib/client/links";
import { Link } from "@tanstack/react-router";
import type { ListSelect } from "@/lib/types";
import DropIndicatorWrapper from "@/app/components/drag-and-drop/drop-indicator-wrapper";
import RadixProvider from "@/app/components/ui/radix-provider";
import PackingListMenu from "./packing-list-menu";

interface Props {
  list: ListSelect;
  isOverlay?: boolean;
}

const PackingList: React.FC<Props> = ({ list, isOverlay }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const gripperRef = React.useRef<HTMLButtonElement>(null);

  const setMobileSidebarOpen = useSetAtom(mobileSidebarOpenAtom);
  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  const { listId } = useCurrentList();

  const isActive = listId === list.id;

  const { draggableState, setDraggableState, setDraggableIdle } =
    useDraggableState();

  React.useEffect(() => {
    const element = ref.current;
    const gripper = gripperRef.current;
    invariant(element);
    invariant(gripper);

    return combine(
      draggable({
        element,
        dragHandle: gripper,
        getInitialData: () => ({
          [DND_TYPE_KEY]: DndEntityType.List,
          ...list,
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
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          // not allowing dropping on yourself
          if (source.data.id === list.id) {
            return false;
          }
          // only allowing tasks to be dropped on me
          return isDndEntityType(source.data, DndEntityType.List);
        },
        getData({ input }) {
          return attachClosestEdge(list, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky() {
          return true;
        },
        onDragEnter({ self, source }) {
          if (!isDndEntityType(source.data, DndEntityType.List)) return;
          const closestEdge = extractClosestEdge(self.data);
          setDraggableState({ type: "is-dragging-over", closestEdge });
        },
        onDrag({ self, source }) {
          if (!isDndEntityType(source.data, DndEntityType.List)) return;
          const closestEdge = extractClosestEdge(self.data);

          // Only need to update react state if nothing has changed.
          // Prevents re-rendering.
          setDraggableState((current) => {
            if (
              current.type === "is-dragging-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return { type: "is-dragging-over", closestEdge };
          });
        },
        onDragLeave() {
          setDraggableIdle();
        },
        onDrop() {
          setDraggableIdle();
          triggerElementFlash(element);
        },
      }),
    );
  }, [list]);

  return (
    <>
      <DropIndicatorWrapper draggableState={draggableState}>
        <div
          ref={ref}
          title={list.name || "Unnamed List"}
          data-drag-id={list.id}
          className={cn(
            "flex items-center gap-2 border-l-4 border-transparent py-2 pl-2 pr-4 hover:border-accentA-6",
            isOverlay &&
              "border-border w-64 rounded-2 border border-l-4 bg-gray-2",
            isActive &&
              "text-secondary-foreground hover:border-primary border-accentA-10 bg-accentA-3",
            "transition-colors ease-in",
          )}
        >
          <Gripper ref={gripperRef} />
          <Text
            asChild
            size="2"
            weight={isActive ? "bold" : "medium"}
            color={list.name ? undefined : "gray"}
            className={cn("w-full flex-1", !list.name && "italic")}
          >
            <Link
              {...listLinkOptions(list.id)}
              onClick={() => closeMobileSidebar()}
            >
              {list.name || "Unnamed List"}
            </Link>
          </Text>
          <PackingListMenu list={list} />
        </div>
      </DropIndicatorWrapper>

      {draggableState.type === "preview" ? (
        <Portal container={draggableState.container}>
          <RadixProvider>
            <PackingList list={list} isOverlay />
          </RadixProvider>
        </Portal>
      ) : null}
    </>
  );
};

export default PackingList;
