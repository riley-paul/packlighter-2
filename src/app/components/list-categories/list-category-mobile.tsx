import React from "react";
import { Checkbox } from "@/app/components/ui/checkbox";
import DeleteButton from "@/app/components/base/delete-button";
import Gripper from "@/app/components/base/gripper";

import { cn } from "@/app/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import ServerInput from "@/app/components/input/server-input";
import { formatWeight, isCategoryFullyPacked } from "@/app/lib/helpers";
import useListId from "@/app/hooks/useListId";
import { listQueryOptions } from "@/app/lib/queries";
import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import type { ExpandedCategory } from "@/api/lib/types";
import useMutations from "@/app/hooks/useMutations";
import {
  Draggable,
  Droppable,
  type DraggableProvided,
} from "react-beautiful-dnd";
import ListCategoryItemMobile from "./list-category-item-mobile";
import { Badge } from "../ui/badge";

interface Props {
  category: ExpandedCategory;
  provided: DraggableProvided;
  isDragging?: boolean;
}

const ListCategoryMobile: React.FC<Props> = (props) => {
  const { category, isDragging, provided } = props;
  const listId = useListId();
  const queryClient = useQueryClient();

  const list = queryClient.getQueryData(listQueryOptions(listId).queryKey);

  const {
    deleteCategory,
    toggleCategoryPacked,
    updateCategory,
    addItemToCategory,
  } = useMutations();

  if (!list) return null;

  return (
    <div
      ref={provided.innerRef}
      className={cn(
        "transition-all",
        isDragging && "rounded border bg-card/70",
      )}
      {...provided.draggableProps}
    >
      <header className="flex items-center gap-1 rounded-t border-b bg-card/50 px-2 py-1">
        {list.showPacked && (
          <Checkbox
            className="mr-2"
            checked={isCategoryFullyPacked(category)}
            onCheckedChange={() =>
              toggleCategoryPacked.mutate({ categoryId: category.id })
            }
          />
        )}
        <Gripper {...provided.dragHandleProps} isGrabbing={isDragging} />
        <ServerInput
          className="text-foregound px-1 py-0.5 text-base font-semibold"
          placeholder="Category Name"
          currentValue={category.name ?? ""}
          onUpdate={(value) =>
            updateCategory.mutate({
              categoryId: category.id,
              data: { name: value },
            })
          }
        />
        {list.showWeights && (
          <Badge className="shrink-0 rounded-full" variant="secondary">
            {`${formatWeight(category.weight)} ${list.weightUnit ?? "g"}`}
          </Badge>
        )}
        <DeleteButton
          handleDelete={() =>
            deleteCategory.mutate({
              categoryId: category.id,
              categoryName: category.name,
            })
          }
        />
      </header>
      <Droppable droppableId={category.id} type="item">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {category.items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <ListCategoryItemMobile
                    key={item.id}
                    item={item}
                    provided={provided}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <footer className="w-full px-2 py-1">
        <Button
          variant="linkMuted"
          size="sm"
          onClick={() => addItemToCategory.mutate({ categoryId: category.id })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </footer>
    </div>
  );
};

export default ListCategoryMobile;