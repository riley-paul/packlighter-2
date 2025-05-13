import { WeightConvertible } from "@/lib/convertible";
import type { ExpandedList } from "@/lib/types";
import { Table } from "@radix-ui/themes";
import React from "react";

type Props = {
  list: ExpandedList;
};

const WeightTable: React.FC<Props> = ({ list }) => {
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
          <Table.Row key={category.id}>
            <Table.Cell>{category.name}</Table.Cell>
            <Table.Cell className="flex gap-2">
              <span>
                {category.items.reduce(
                  (acc, val) =>
                    acc +
                    WeightConvertible.convert(
                      val.itemData.weight,
                      val.itemData.weightUnit,
                      list.weightUnit,
                    ),
                  0,
                )}
              </span>
              <span>{list.weightUnit}</span>
            </Table.Cell>
          </Table.Row>
        ))}
        <Table.Row>
          <Table.Cell className="font-bold">Total</Table.Cell>
          <Table.Cell className="flex gap-2 font-bold">
            <span>
              {list.categories.reduce(
                (acc, category) =>
                  acc +
                  category.items.reduce(
                    (acc, val) =>
                      acc +
                      WeightConvertible.convert(
                        val.itemData.weight,
                        val.itemData.weightUnit,
                        list.weightUnit,
                      ),
                    0,
                  ),
                0,
              )}
            </span>
            <span>{list.weightUnit}</span>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};

export default WeightTable;
