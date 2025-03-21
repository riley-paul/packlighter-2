import React from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DndEntityType, isDndEntityType } from "@/lib/client/constants";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import { z } from "zod";
import { flushSync } from "react-dom";
import useMutations from "@/hooks/use-mutations";
import { initCategoryItem } from "@/lib/init";
import EditorCategory from "./editor-category";
import AddCategoryPopover from "./add-category-popover";
import { triggerElementFlash } from "@/lib/client/utils";
import type {
  ExpandedCategory,
  ExpandedCategoryItem,
  ItemSelect,
} from "@/lib/types";

type Props = {
  categories: ExpandedCategory[];
};

const EditorCategories: React.FC<Props> = (props) => {
  const { categories } = props;
  const { reorderCategories, reorderCategoryItems, addItemToCategory } =
    useMutations();

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
          const sourceData = z
            .custom<ExpandedCategory>()
            .safeParse(source.data);
          const targetData = z
            .custom<ExpandedCategory>()
            .safeParse(target.data);

          if (!sourceData.success || !targetData.success) {
            return;
          }

          const indexOfSource = categories.findIndex(
            (i) => i.id === sourceData.data.id,
          );
          const indexOfTarget = categories.findIndex(
            (i) => i.id === targetData.data.id,
          );

          if (indexOfTarget < 0 || indexOfSource < 0) {
            return;
          }

          const closestEdgeOfTarget = extractClosestEdge(target.data);

          flushSync(() => {
            reorderCategories.mutate(
              reorderWithEdge({
                list: categories,
                startIndex: indexOfSource,
                indexOfTarget,
                closestEdgeOfTarget,
                axis: "vertical",
              }),
            );
          });

          const element = document.querySelector(
            `[data-category-id="${sourceData.data.id}"]`,
          );
          if (element instanceof HTMLElement) {
            triggerElementFlash(element);
          }
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
          const sourceData = z
            .custom<ExpandedCategoryItem>()
            .safeParse(source.data);
          const targetData = z
            .object({ categoryId: z.string(), id: z.string() })
            .safeParse(target.data);

          if (!sourceData.success || !targetData.success) {
            console.error("could not parse data");
            return;
          }

          const targetCategoryId = targetData.data.categoryId;
          const sourceCategoryId = sourceData.data.categoryId;

          const targetCategory = categories.find(
            (i) => i.id === targetCategoryId,
          );
          if (!targetCategory) return;

          const isMovingCategories = targetCategoryId !== sourceCategoryId;
          const items = isMovingCategories
            ? [...targetCategory.items, sourceData.data]
            : targetCategory.items;

          const indexOfSource = items.findIndex(
            (i) => i.id === sourceData.data.id,
          );
          const indexOfTarget = items.findIndex(
            (i) => i.id === targetData.data.id,
          );

          const closestEdgeOfTarget = extractClosestEdge(target.data);

          flushSync(() => {
            reorderCategoryItems.mutate({
              categoryId: targetCategoryId,
              categoryItems: reorderWithEdge({
                list: items,
                startIndex: indexOfSource,
                indexOfTarget,
                closestEdgeOfTarget,
                axis: "vertical",
              }),
            });
          });

          const element = document.querySelector(
            `[data-category-item-id="${targetData.data.id}"]`,
          );
          if (element instanceof HTMLElement) {
            triggerElementFlash(element);
          }
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
