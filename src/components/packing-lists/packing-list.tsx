import { centerDragPreviewOnMouse, cn, triggerElementFlash } from "@/lib/utils";
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

import Gripper from "@/components/base/gripper";
import useMutations from "@/hooks/use-mutations";
import type { ListSelect } from "@/lib/types";
import useDraggableState, {
  type DraggableStateClassnames,
} from "@/hooks/use-draggable-state";
import { DropIndicator } from "../ui/drop-indicator";
import {
  DND_ENTITY_TYPE,
  DndEntityType,
  isDndEntityType,
} from "@/lib/constants";
import { Link } from "react-router-dom";
import useCurrentList from "@/hooks/use-current-list";
import { DropdownMenu, IconButton, Portal, Text } from "@radix-ui/themes";
import RadixProvider from "../base/radix-provider";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { useSetAtom } from "jotai";
import { mobileSidebarOpenAtom } from "../sidebar/store";

interface Props {
  list: ListSelect;
  isOverlay?: boolean;
}

const draggableStyles: DraggableStateClassnames = {
  "is-dragging": "opacity-50",
};

const PackingList: React.FC<Props> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const gripperRef = React.useRef<HTMLButtonElement>(null);

  const setMobileSidebarOpen = useSetAtom(mobileSidebarOpenAtom);
  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  const [ConfirmDeleteDialog, confirmDelete] = useConfirmDialog({
    title: "Delete List",
    description:
      "Are you sure you want to delete this list? This cannot be undone.",
  });

  const { list, isOverlay } = props;
  const { listId } = useCurrentList();

  const isActive = listId === list.id;

  const { deleteList, duplicateList } = useMutations();

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
          [DND_ENTITY_TYPE]: DndEntityType.List,
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
      <ConfirmDeleteDialog />
      <div
        ref={ref}
        title={list.name || "Unnamed List"}
        data-drag-id={list.id}
        className={cn(
          "flex h-9 items-center gap-2 border-l-4 border-transparent py-0.5 pl-2 pr-4 hover:border-accentA-6",
          isOverlay &&
            "border-border w-64 rounded-2 border border-l-4 bg-gray-2",
          isActive &&
            "text-secondary-foreground hover:border-primary border-accentA-10 bg-accentA-3",
          "relative transition-colors ease-in",
          draggableStyles[draggableState.type],
        )}
      >
        <Gripper ref={gripperRef} />
        <Text
          asChild
          size="2"
          weight={isActive ? "bold" : "medium"}
          truncate
          color={list.name ? undefined : "gray"}
          className={cn("w-full flex-1", !list.name && "italic")}
        >
          <Link to={`/list/${list.id}`} onClick={() => closeMobileSidebar()}>
            {list.name || "Unnamed List"}
          </Link>
        </Text>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton
              variant="ghost"
              color="gray"
              title="List Actions"
              size="1"
              radius="full"
            >
              <span className="sr-only">Open menu</span>
              <i className="fa-solid fa-ellipsis" />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start" className="z-30">
            <DropdownMenu.Label>Actions</DropdownMenu.Label>

            <DropdownMenu.Item
              onClick={() => duplicateList.mutate({ listId: list.id })}
            >
              <i className="fa-solid fa-copy w-4 text-center opacity-70" />
              Duplicate
            </DropdownMenu.Item>

            <DropdownMenu.Item
              color="red"
              onClick={async () => {
                const ok = await confirmDelete();
                if (ok) {
                  deleteList.mutate({ listId: list.id });
                }
              }}
            >
              <i className="fa-solid fa-backspace w-4 text-center opacity-70" />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        {draggableState.type === "is-dragging-over" &&
          draggableState.closestEdge && (
            <DropIndicator edge={draggableState.closestEdge} gap="0px" />
          )}
      </div>
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
