import { Table } from "@radix-ui/themes";
import React from "react";
import { cn, formatWeight, toTitleCase } from "@/lib/client/utils";
import { useAtom } from "jotai";
import {
  activeCategoryIdAtom,
  selectedCategoryIdAtom,
} from "./weight-chart.store";
import type { ExpandedList } from "@/lib/types";
import { getCategoryWeight, getListWeight } from "./weight-chart.utils";
import { weightTypes } from "@/db/schema";

type Props = {
  list: ExpandedList;
  listColorMap: Map<string, string>;
};

const WeightTable: React.FC<Props> = ({ list, listColorMap }) => {
  const [activeId, setActiveId] = useAtom(activeCategoryIdAtom);
  const [selectedId, setSelectedId] = useAtom(selectedCategoryIdAtom);

  const totalWeight = getListWeight(list, list.weightUnit);
  const totalBaseWeight = getListWeight(list, list.weightUnit, "base");

  const tableFooters: { title: string; value: number }[] = [
    { title: "Total", value: totalWeight },
    ...weightTypes
      .filter((i) => i !== "base")
      .map((t) => ({
        title: toTitleCase(t),
        value: getListWeight(list, list.weightUnit, t),
      })),
    {
      title: "Base Weight",
      value: totalBaseWeight === totalWeight ? 0 : totalBaseWeight,
    },
  ].filter((i) => i.value > 0);

  return (
    <Table.Root size="1">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Weight</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {list.categories.map((category) => (
          <Table.Row
            key={category.id}
            className={cn(
              "cursor-pointer transition-colors ease-out",
              activeId === category.id && "bg-gray-2",
              selectedId === category.id && "bg-gray-3",
            )}
            onMouseEnter={() => setActiveId(category.id)}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setSelectedId(category.id)}
          >
            <Table.Cell>
              <div className="flex items-center gap-3">
                <div
                  className="size-4 rounded-full"
                  style={{ backgroundColor: listColorMap.get(category.id) }}
                />
                <span>{category.name}</span>
              </div>
            </Table.Cell>
            <Table.Cell className="flex justify-end gap-2">
              <span>
                {formatWeight(getCategoryWeight(category, list.weightUnit))}
              </span>
              <span>{list.weightUnit}</span>
            </Table.Cell>
          </Table.Row>
        ))}
        {tableFooters.map((footer) => (
          <Table.Row>
            <Table.Cell className="text-right font-medium">
              {footer.title}
            </Table.Cell>
            <Table.Cell className="flex gap-2 font-bold">
              <span>{formatWeight(footer.value)}</span>
              <span>{list.weightUnit}</span>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default WeightTable;
