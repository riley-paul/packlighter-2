import { createColumnHelper } from "@tanstack/react-table";
import React from "react";
import { cn, formatWeight, getCheckboxState } from "@/lib/client/utils";
import CellWrapper from "../base/cell-wrapper";
import ItemImage from "../../modules/items/components/item-image";
import { Checkbox } from "@radix-ui/themes";
import { useAtomValue, useSetAtom } from "jotai";
import { isItemPackedAtom, togglePackedItemAtom } from "./store";
import type {
  ExpandedCategory,
  ExpandedCategoryItem,
  ListSelect,
} from "@/lib/types";

const columnHelper = createColumnHelper<ExpandedCategoryItem>();

export default function useViewerColumns(
  category: ExpandedCategory,
  list: ListSelect,
) {
  const togglePackedItem = useSetAtom(togglePackedItemAtom);
  const isItemPacked = useAtomValue(isItemPackedAtom);
  const { listId } = category;

  return React.useMemo(
    () => [
      columnHelper.accessor("packed", {
        id: "packed",
        header: () => (
          <CellWrapper center>
            <Checkbox
              size="3"
              checked={getCheckboxState(
                category.items.map((item) =>
                  isItemPacked({ listId, itemId: item.id }),
                ),
              )}
              onCheckedChange={(checked) =>
                category.items.forEach((item) =>
                  togglePackedItem({
                    packed: Boolean(checked),
                    listId,
                    itemId: item.id,
                  }),
                )
              }
            />
          </CellWrapper>
        ),
        cell: (props) => (
          <CellWrapper center>
            <Checkbox
              size="3"
              checked={isItemPacked({ listId, itemId: props.row.original.id })}
              onCheckedChange={(checked) =>
                togglePackedItem({
                  packed: Boolean(checked),
                  listId,
                  itemId: props.row.original.id,
                })
              }
            />
          </CellWrapper>
        ),
      }),

      columnHelper.accessor("itemData.image", {
        id: "image",
        header: () => null,
        cell: ({ getValue, row }) => {
          return (
            <ItemImage
              item={row.original.itemData}
              size="sm"
              className="w-16"
            />
          );
        },
      }),

      columnHelper.accessor(
        (row) => ({
          name: row.itemData.name,
          description: row.itemData.description,
          isPacked: row.packed,
        }),
        {
          id: "name-description",
          header: () => (
            <h2 className="flex-1 py-0.5 text-4 text-gray-12">
              {category.name || "Unnamed Category"}
            </h2>
          ),
          cell: (props) => (
            <div className="flex-1 @container">
              <div
                className={cn(
                  "grid @lg:grid-cols-[1fr_2fr] @lg:gap-1",
                  props.getValue().isPacked && "line-through opacity-50",
                )}
              >
                <div>{props.getValue().name}</div>
                <div className="text-gray-11">
                  {props.getValue().description}
                </div>
              </div>
            </div>
          ),
          // footer: () => <div className="flex-1" />,
        },
      ),

      columnHelper.accessor(
        (row) => ({
          weight: row.itemData.weight,
          weightUnit: row.itemData.weightUnit,
        }),
        {
          id: "weight",
          header: () => (
            <CellWrapper center width="7rem">
              Weight
            </CellWrapper>
          ),
          cell: (props) => (
            <CellWrapper center width="7rem">
              {formatWeight(props.getValue().weight)}
              <span>{props.getValue().weightUnit}</span>
            </CellWrapper>
          ),
          // footer: () => (
          //   <CellWrapper center width="7rem">
          //     {formatWeight(category.weight)}
          //     {/* <span>{list.weightUnit}</span> */}
          //   </CellWrapper>
          // ),
        },
      ),
      columnHelper.accessor("quantity", {
        id: "qty",
        header: () => (
          <CellWrapper center width={50}>
            Qty
          </CellWrapper>
        ),
        cell: (props) => (
          <CellWrapper center width={50}>
            {props.getValue()}
          </CellWrapper>
        ),
        // footer: () => (
        //   <CellWrapper center width={50}>
        //     {category.items.reduce((acc, val) => acc + val.quantity, 0)}
        //   </CellWrapper>
        // ),
      }),
    ],
    [category, list],
  );
}
