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

import Gripper from "@/components/base/gripper";
import useMutations from "@/hooks/use-mutations";
import useDraggableState from "@/hooks/use-draggable-state";
import {
  DND_ENTITY_TYPE,
  DndEntityType,
  isDndEntityType,
} from "@/lib/client/constants";
import useCurrentList from "@/hooks/use-current-list";
import { DropdownMenu, IconButton, Portal, Text } from "@radix-ui/themes";
import RadixProvider from "../../../../components/base/radix-provider";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { useSetAtom } from "jotai";
import { mobileSidebarOpenAtom } from "@/modules/sidebar/store";
import DropIndicatorWrapper from "../../../../components/ui/drop-indicator-wrapper";
import ConditionalForm from "../../../../components/base/conditional-form";
import { listLinkOptions } from "@/lib/client/links";
import { Link } from "@tanstack/react-router";
import type { ListSelect } from "@/lib/types";

interface Props {
  list: ListSelect;
  isOverlay?: boolean;
}

const ContextMenu: React.FC<{
  handleDelete: () => void;
  handleDuplicate: () => void;
  handleRename: () => void;
}> = ({ handleDelete, handleRename, handleDuplicate }) => (
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
      <DropdownMenu.Item onClick={handleRename}>
        <i className="fa-solid fa-pen w-4 text-center opacity-70" />
        Rename
      </DropdownMenu.Item>

      <DropdownMenu.Item onClick={handleDuplicate}>
        <i className="fa-solid fa-copy w-4 text-center opacity-70" />
        Duplicate
      </DropdownMenu.Item>

      <DropdownMenu.Item color="red" onClick={handleDelete}>
        <i className="fa-solid fa-backspace w-4 text-center opacity-70" />
        Delete
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);

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

  const { deleteList, duplicateList, updateList } = useMutations();

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
      <DropIndicatorWrapper draggableState={draggableState}>
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
            "transition-colors ease-in",
          )}
        >
          <ConditionalForm
            compactButtons
            formProps={{ className: "flex-1" }}
            value={list.name}
            handleSubmit={(value) => {
              updateList.mutate({ listId: list.id, data: { name: value } });
            }}
          >
            {({ startEditing, displayValue }) => (
              <>
                <Gripper ref={gripperRef} />
                <Text
                  asChild
                  size="2"
                  weight={isActive ? "bold" : "medium"}
                  truncate
                  color={displayValue ? undefined : "gray"}
                  className={cn("w-full flex-1", !displayValue && "italic")}
                >
                  <Link
                    {...listLinkOptions(list.id)}
                    onClick={() => closeMobileSidebar()}
                  >
                    {displayValue || "Unnamed List"}
                  </Link>
                </Text>
                <ContextMenu
                  handleRename={startEditing}
                  handleDelete={async () => {
                    const ok = await confirmDelete();
                    if (ok) deleteList.mutate({ listId: list.id });
                  }}
                  handleDuplicate={() =>
                    duplicateList.mutate({ listId: list.id })
                  }
                />
              </>
            )}
          </ConditionalForm>
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
