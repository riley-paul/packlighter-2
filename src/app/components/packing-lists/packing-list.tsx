import { cn } from "@/app/lib/utils";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import invariant from "tiny-invariant";

import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";

import { MoreHorizontal, Delete, Copy } from "lucide-react";
import { Button } from "@/app/components/ui/button";

import Gripper from "@/app/components/base/gripper";
import { useSidebarStore } from "@/app/components/sidebar/sidebar-store";
import { Link } from "@tanstack/react-router";
import useMutations from "@/app/hooks/use-mutations";
import type { ListSelect } from "@/api/lib/types";
import useListId from "@/app/hooks/use-list-id";
import ConfirmDeleteDialog from "../base/confirm-delete-dialog";
import useDraggableState from "@/app/hooks/use-draggable-state";

interface Props {
  list: ListSelect;
}

const PackingList: React.FC<Props> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const { list } = props;
  const listId = useListId();

  const isActive = listId === list.id;

  const { deleteList, duplicateList } = useMutations();
  const { toggleMobileSidebar } = useSidebarStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const { draggableState, setDraggableState } = useDraggableState();

  React.useEffect(() => {
    const element = ref.current;
    invariant(element);

    return combine(draggable({ element }), dropTargetForElements({ element }));
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
        key={list.id}
        className={cn(
          "flex items-center gap-2 border-l-4 border-transparent py-0.5 pl-2 pr-2 hover:border-muted",
          // isDragging && "rounded border border-l-4 border-border bg-card/70",
          isActive &&
            "border-primary bg-secondary text-secondary-foreground hover:border-primary",
        )}
      >
        <Gripper />
        <Link
          to={`/list/$listId`}
          params={{ listId: list.id }}
          onClick={() => toggleMobileSidebar(false)}
          className={cn(
            "flex-1 truncate text-sm",
            !list.name && "italic text-muted-foreground",
          )}
        >
          {list.name || "Unnamed List"}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("h-8 w-8 p-0")}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
              <Delete size="1rem" className="mr-2" />
              Delete List
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => duplicateList.mutate({ listId: list.id })}
            >
              <Copy size="1rem" className="mr-2" />
              Duplicate List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default PackingList;
