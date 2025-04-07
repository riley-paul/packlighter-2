import React from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DndEntityType, isDndEntityType } from "@/lib/client/constants";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import { z } from "zod";
import { flushSync } from "react-dom";
import useMutations from "@/hooks/use-mutations";
import { initCategoryItem } from "@/lib/init";
import EditorCategory from "./editor-category";
import AddCategoryPopover from "./add-category-popover";
import {
  triggerElementFlash,
  triggerElementFlashByDragId,
} from "@/lib/client/utils";
import {
  type ExpandedList,
  zExpandedCategory,
  type ExpandedCategory,
  type ItemSelect,
  zExpandedCategoryItem,
} from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { listQueryOptions } from "@/lib/client/queries";
import useCurrentList from "@/hooks/use-current-list";

type Props = {
  categories: ExpandedCategory[];
};

const EditorCategories: React.FC<Props> = (props) => {
  const { categories } = props;
  const { updateCategoryItem, addItemToCategory, updateCategory } =
    useMutations();

  const queryClient = useQueryClient();
  const { listId } = useCurrentList();

  React.useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        const entities = [
          DndEntityType.Category,
          DndEntityType.Item,
          DndEntityType.CategoryItem,
        ];
        return entities.some((entity) => isDndEntityType(source.data, entity));
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        // sorting categories
        if (isDndEntityType(source.data, DndEntityType.Category)) {
          const sourceData = zExpandedCategory.safeParse(source.data);
          const targetData = zExpandedCategory.safeParse(target.data);

          if (!sourceData.success || !targetData.success) {
            return;
          }

          const sourceId = sourceData.data.id;
          const targetId = targetData.data.id;

          const indexOfSource = categories.findIndex((i) => i.id === sourceId);
          const indexOfTarget = categories.findIndex((i) => i.id === targetId);

          if (indexOfTarget < 0 || indexOfSource < 0) {
            return;
          }

          const closestEdgeOfTarget = extractClosestEdge(target.data);

          const newSortOrder = getReorderDestinationIndex({
            startIndex: indexOfSource,
            indexOfTarget,
            closestEdgeOfTarget,
            axis: "vertical",
          });

          const newCategories = reorderWithEdge({
            list: categories,
            startIndex: indexOfSource,
            indexOfTarget,
            closestEdgeOfTarget,
            axis: "vertical",
          });

          updateCategory.mutate({
            data: { sortOrder: newSortOrder },
            categoryId: sourceId,
          });

          queryClient.setQueryData<ExpandedList>(
            listQueryOptions(listId).queryKey,
            (prev) => {
              if (!prev) return prev;
              return { ...prev, categories: newCategories };
            },
          );

          return;
        }

        // adding item
        if (isDndEntityType(source.data, DndEntityType.Item)) {
          const sourceData = z.custom<ItemSelect>().safeParse(source.data);
          const targetData = z
            .object({ id: z.string(), categoryId: z.string() })
            .safeParse(target.data);

          if (!sourceData.success || !targetData.success) {
            return;
          }

          const targetCategoryId = targetData.data.categoryId;
          const targetCategory = categories.find(
            (i) => i.id === targetCategoryId,
          );
          if (!targetCategory) return;

          const newCategoryItem = initCategoryItem({
            itemData: sourceData.data,
            categoryId: targetCategoryId,
          });

          const items = [...targetCategory.items, newCategoryItem];

          const indexOfSource = items.findIndex(
            (i) => i.id === newCategoryItem.id,
          );
          const indexOfTarget = items.findIndex(
            (i) => i.id === targetData.data.id,
          );

          const closestEdgeOfTarget = extractClosestEdge(target.data);

          flushSync(() => {
            addItemToCategory.mutate({
              categoryId: targetCategoryId,
              categoryItems: reorderWithEdge({
                list: items,
                startIndex: indexOfSource,
                indexOfTarget,
                closestEdgeOfTarget,
                axis: "vertical",
              }),
              categoryItemData: newCategoryItem,
              itemId: sourceData.data.id,
            });
          });

          const element = document.querySelector(
            `[data-category-item-id="${sourceData.data.id}"]`,
          );
          if (element instanceof HTMLElement) {
            triggerElementFlash(element);
          }

          return;
        }

        // sorting items
        if (isDndEntityType(source.data, DndEntityType.CategoryItem)) {
          const sourceData = zExpandedCategoryItem.safeParse(source.data);
          const targetData = z
            .object({ categoryId: z.string(), id: z.string() })
            .safeParse(target.data);

          if (!sourceData.success || !targetData.success) {
            console.error("could not parse data");
            return;
          }

          const targetCategoryId = targetData.data.categoryId;
          const sourceCategoryId = sourceData.data.categoryId;

          const sourceId = sourceData.data.id;
          const targetId = targetData.data.id;

          const targetCategory = categories.find(
            (i) => i.id === targetCategoryId,
          );
          if (!targetCategory) return;

          const isMovingCategories = targetCategoryId !== sourceCategoryId;
          const items = isMovingCategories
            ? [...targetCategory.items, sourceData.data]
            : targetCategory.items;

          const indexOfSource = items.findIndex((i) => i.id === sourceId);
          const indexOfTarget = items.findIndex((i) => i.id === targetId);

          const closestEdgeOfTarget = extractClosestEdge(target.data);

          const newSortOrder = getReorderDestinationIndex({
            startIndex: indexOfSource,
            indexOfTarget,
            closestEdgeOfTarget,
            axis: "vertical",
          });

          const newCategoryItems = reorderWithEdge({
            list: items,
            startIndex: indexOfSource,
            indexOfTarget,
            closestEdgeOfTarget,
            axis: "vertical",
          }).map((item, index) => ({
            ...item,
            categoryId: targetCategoryId,
            sortOrder: index + 1,
          }));

          updateCategoryItem.mutate({
            data: { sortOrder: newSortOrder, categoryId: targetCategoryId },
            categoryItemId: sourceId,
          });

          queryClient.setQueryData<ExpandedList>(
            listQueryOptions(listId).queryKey,
            (prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                categories: prev.categories.map((category) =>
                  category.id === targetCategoryId
                    ? { ...category, items: newCategoryItems }
                    : {
                        ...category,
                        items: category.items.filter((i) => i.id !== sourceId),
                      },
                ),
              };
            },
          );

          triggerElementFlashByDragId(
            `[data-category-item-id="${targetData.data.id}"]`,
          );
          return;
        }
      },
    });
  }, [categories]);

  return (
    <div className="flex flex-col gap-4">
      {categories.map((category) => (
        <EditorCategory key={category.id} category={category} />
      ))}
      <div className="pl-2">
        <AddCategoryPopover />
      </div>
    </div>
  );
};

export default EditorCategories;
