import { cn } from "@/lib/utils";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import invariant from "tiny-invariant";

import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";

import { MoreHorizontal, Delete, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

import Gripper from "@/components/base/gripper";
import useMutations from "@/hooks/use-mutations";
import type { ListSelect } from "@/lib/types";
import ConfirmDeleteDialog from "../base/confirm-delete-dialog";
import useDraggableState, {
  type DraggableStateClassnames,
} from "@/hooks/use-draggable-state";
import { DropIndicator } from "../ui/drop-indicator";
import { createPortal } from "react-dom";
import {
  DND_ENTITY_TYPE,
  DndEntityType,
  isDndEntityType,
} from "@/lib/constants";
import { Link } from "react-router-dom";
import useCurrentList from "@/hooks/use-current-list";

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

  const { list, isOverlay } = props;
  const { listId } = useCurrentList();

  const isActive = listId === list.id;

  const { deleteList, duplicateList } = useMutations();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const { draggableState, setDraggableState, setDraggableIdle } =
    useDraggableState();

  React.useEffect(() => {
    const element = ref.current;
    const gripper = gripperRef.current;
    invariant(element);
    invariant(gripper);

    return combine(
      draggable({
        element: gripper,
        getInitialData: () => ({
          [DND_ENTITY_TYPE]: DndEntityType.List,
          ...list,
        }),
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: "16px",
              y: "8px",
            }),
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
          triggerPostMoveFlash(element);
        },
      }),
    );
  }, [list]);

  return (
    <>
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        handleDelete={() => deleteList.mutate({ listId: list.id })}
        entityName="packing list"
      />
      <div
        ref={ref}
        title={list.name || "Unnamed List"}
        className={cn(
          "flex h-9 items-center gap-2 border-l-4 border-transparent py-0.5 pl-2 pr-2 hover:border-primary/50",
          isOverlay && "w-64 rounded border border-l-4 border-border bg-card",
          isActive &&
            "border-primary bg-secondary font-medium text-secondary-foreground hover:border-primary",
          "relative transition-colors ease-in",
          draggableStyles[draggableState.type],
        )}
      >
        <Gripper ref={gripperRef} />
        <Link
          to={`/list/${list.id}`}
          className={cn(
            "flex-1 truncate text-sm",
            !list.name && "italic text-muted-foreground",
          )}
        >
          {list.name || "Unnamed List"}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn("h-6 w-6 rounded-full p-0 hover:bg-muted")}
              title="List Actions"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
              <Delete size="1rem" className="mr-2 text-destructive" />
              Delete
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => duplicateList.mutate({ listId: list.id })}
            >
              <Copy size="1rem" className="mr-2 text-primary" />
              Duplicate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {draggableState.type === "is-dragging-over" &&
          draggableState.closestEdge && (
            <DropIndicator edge={draggableState.closestEdge} gap="0px" />
          )}
      </div>
      {draggableState.type === "preview"
        ? createPortal(
            <PackingList list={list} isOverlay />,
            draggableState.container,
          )
        : null}
    </>
  );
};

export default PackingList;
