import { createColumnHelper } from "@tanstack/react-table";
import ServerInput from "../ui/server-input";
import useMutations from "@/hooks/use-mutations";
import React from "react";
import DeleteButton from "../base/delete-button";
import { cn, formatWeight, getCheckboxState } from "@/lib/client/utils";
import AddItemPopover from "./add-item-popover";
import useCurrentList from "@/hooks/use-current-list";
import CellWrapper from "../base/cell-wrapper";
import { WeightConvertible } from "@/lib/convertible";
import {
  TextField,
  Select,
  Checkbox,
  Heading,
  Text,
  Button,
} from "@radix-ui/themes";
import ConditionalForm from "../base/conditional-form";
import { z } from "zod";
import useItemsMutations from "@/modules/items/mutations";
import { type ExpandedCategory, type ExpandedCategoryItem } from "@/lib/types";
import { weightUnitsInfo, type WeightUnit } from "@/lib/client/constants";
import ItemImageDroppable from "@/modules/items/components/item-image-droppable";

const columnHelper = createColumnHelper<ExpandedCategoryItem>();

type UseColumnsProps = {
  category: ExpandedCategory;
  addItemRef: React.RefObject<HTMLButtonElement>;
};

const QTY_WIDTH = "3.5rem";
const WEIGHT_WIDTH = "5rem";

export default function useEditorColumns({
  category,
  addItemRef,
}: UseColumnsProps) {
  const {
    updateCategory,
    deleteCategory,
    deleteCategoryItem,
    toggleCategoryPacked,
    updateCategoryItem,
  } = useMutations();
  const { updateItem } = useItemsMutations();

  const { list } = useCurrentList();

  if (!list) return [];

  return React.useMemo(
    () => [
      columnHelper.accessor("packed", {
        id: "packed",
        header: () => (
          <CellWrapper>
            <Checkbox
              size="3"
              checked={getCheckboxState(category.items.map((i) => i.packed))}
              onCheckedChange={() =>
                toggleCategoryPacked.mutate({ categoryId: category.id })
              }
            />
          </CellWrapper>
        ),
        cell: (props) => (
          <CellWrapper>
            <Checkbox
              size="3"
              checked={props.getValue()}
              onCheckedChange={(packed) =>
                updateCategoryItem.mutate({
                  categoryItemId: props.row.original.id,
                  data: { packed: Boolean(packed) },
                })
              }
            />
          </CellWrapper>
        ),
      }),

      columnHelper.accessor("itemData.image", {
        id: "image",
        header: () => null,
        cell: (props) => (
          <ItemImageDroppable
            item={props.row.original.itemData}
            className="size-16"
          />
        ),
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
            <ConditionalForm
              value={category.name}
              handleSubmit={(name) =>
                updateCategory.mutate({
                  categoryId: category.id,
                  data: { name },
                })
              }
              formProps={{ className: "flex-1" }}
            >
              {({ startEditing, displayValue }) => (
                <Heading
                  as="h3"
                  size="4"
                  weight="bold"
                  className="flex-1"
                  onClick={startEditing}
                >
                  {displayValue ?? "Unnamed Category"}
                </Heading>
              )}
            </ConditionalForm>
          ),
          cell: (props) => (
            <div
              className={cn(
                "flex-1 @container",
                list.showPacked &&
                  props.getValue().isPacked &&
                  "line-through opacity-50",
              )}
            >
              <div className="grid items-center @lg:grid-cols-[1fr_2fr] @lg:gap-2">
                <ConditionalForm
                  value={props.getValue().name}
                  handleSubmit={(name) =>
                    updateItem.mutate({
                      itemId: props.row.original.itemData.id,
                      data: { name },
                    })
                  }
                  textFieldProps={{ placeholder: "Name" }}
                  compactButtons
                >
                  {({ startEditing, displayValue }) => (
                    <Text onClick={startEditing} size="2">
                      {displayValue || "Name"}
                    </Text>
                  )}
                </ConditionalForm>

                <ConditionalForm
                  value={props.getValue().description}
                  handleSubmit={(description) =>
                    updateItem.mutate({
                      itemId: props.row.original.itemData.id,
                      data: { description },
                    })
                  }
                  textFieldProps={{ placeholder: "Description" }}
                  customSchema={z.string()}
                  compactButtons
                >
                  {({ startEditing, displayValue }) => (
                    <Text
                      onClick={startEditing}
                      size="2"
                      color="gray"
                      className={cn(!displayValue && "italic text-gray-10")}
                    >
                      {displayValue || "Description"}
                    </Text>
                  )}
                </ConditionalForm>
              </div>
            </div>
          ),
          footer: () => (
            <CellWrapper className="flex-1">
              <AddItemPopover ref={addItemRef} category={category} />
            </CellWrapper>
          ),
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
            <CellWrapper width={WEIGHT_WIDTH}>
              <Heading as="h3" size="2" color="gray">
                Weight
              </Heading>
            </CellWrapper>
          ),
          cell: (props) => (
            <CellWrapper width={WEIGHT_WIDTH}>
              <ServerInput
                type="number"
                currentValue={String(props.getValue().weight)}
                min={0}
                selectOnFocus
                onUpdate={(weight) =>
                  updateItem.mutate({
                    itemId: props.row.original.itemId,
                    data: { weight: Number(weight) },
                  })
                }
              >
                <TextField.Slot side="right">
                  <Select.Root
                    size="1"
                    value={props.getValue().weightUnit}
                    onValueChange={(weightUnit: WeightUnit) =>
                      updateItem.mutate({
                        itemId: props.row.original.itemId,
                        data: { weightUnit },
                      })
                    }
                  >
                    <Select.Trigger variant="ghost" />
                    <Select.Content>
                      {Object.values(weightUnitsInfo).map(({ symbol }) => (
                        <Select.Item value={symbol}>{symbol}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </TextField.Slot>
              </ServerInput>
            </CellWrapper>
          ),
          footer: () => {
            const totalWeight = category.items.reduce(
              (acc, val) =>
                acc +
                WeightConvertible.convert(
                  val.itemData.weight,
                  val.itemData.weightUnit,
                  list.weightUnit,
                ),
              0,
            );
            return (
              <CellWrapper width={WEIGHT_WIDTH}>
                <Text size="2" weight="medium">
                  {formatWeight(totalWeight)}
                  <span>{list.weightUnit}</span>
                </Text>
              </CellWrapper>
            );
          },
        },
      ),
      columnHelper.accessor("quantity", {
        id: "qty",
        header: () => (
          <CellWrapper width={QTY_WIDTH}>
            <Heading as="h3" size="2" color="gray">
              Qty
            </Heading>
          </CellWrapper>
        ),
        cell: (props) => (
          <CellWrapper width={QTY_WIDTH}>
            <ServerInput
              type="number"
              placeholder="Qty"
              selectOnFocus
              currentValue={String(props.getValue())}
              onUpdate={(quantity) =>
                updateCategoryItem.mutate({
                  categoryItemId: props.row.original.id,
                  data: { quantity: Number(quantity) },
                })
              }
            >
              <TextField.Slot side="right">
                <div className="grid gap-0.5">
                  <Button
                    size="1"
                    variant="ghost"
                    className="text-[0.5rem]"
                    onClick={() =>
                      updateCategoryItem.mutate({
                        categoryItemId: props.row.original.id,
                        data: { quantity: props.getValue() + 1 },
                      })
                    }
                  >
                    <i className="fa-solid fa-chevron-up" />
                  </Button>
                  <Button
                    size="1"
                    variant="ghost"
                    className="text-[0.5rem]"
                    onClick={() => {
                      const quantity = props.getValue() - 1;
                      if (quantity < 1) return;
                      updateCategoryItem.mutate({
                        categoryItemId: props.row.original.id,
                        data: { quantity },
                      });
                    }}
                  >
                    <i className="fa-solid fa-chevron-down" />
                  </Button>
                </div>
              </TextField.Slot>
            </ServerInput>
          </CellWrapper>
        ),
        footer: () => (
          <CellWrapper width={QTY_WIDTH}>
            <Text size="2" weight="medium">
              {category.items.reduce((acc, val) => acc + val.quantity, 0)}
            </Text>
          </CellWrapper>
        ),
      }),
      columnHelper.display({
        id: "delete",
        header: () => (
          <DeleteButton
            handleDelete={() =>
              deleteCategory.mutate({
                categoryId: category.id,
              })
            }
          />
        ),
        cell: (props) => (
          <DeleteButton
            noConfirm
            handleDelete={() =>
              deleteCategoryItem.mutate({
                categoryItemId: props.row.original.id,
              })
            }
          />
        ),
        footer: () => <CellWrapper width="1.5rem" />,
      }),
    ],
    [category, list],
  );
}
