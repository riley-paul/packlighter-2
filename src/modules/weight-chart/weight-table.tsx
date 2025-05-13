import { Table } from "@radix-ui/themes";
import React from "react";
import type { ChartDataNested } from "./weight-chart.types";

type Props = {
  list: ChartDataNested[];
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
        {list.map((category) => (
          <Table.Row key={category.id}>
            <Table.Cell>
              <div className="flex items-center gap-3">
                <div
                  className="size-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.label}</span>
              </div>
            </Table.Cell>
            <Table.Cell className="flex gap-2">
              <span>{category.value}</span>
              <span>{category.unit}</span>
            </Table.Cell>
          </Table.Row>
        ))}
        <Table.Row>
          <Table.Cell className="font-bold">Total</Table.Cell>
          <Table.Cell className="flex gap-2 font-bold">
            <span>
              {list.reduce((acc, category) => acc + category.value, 0)}
            </span>
            <span>{list[0].unit}</span>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};

export default WeightTable;
