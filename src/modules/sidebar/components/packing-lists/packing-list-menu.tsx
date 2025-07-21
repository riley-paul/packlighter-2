import React from "react";

import useMutations from "@/hooks/use-mutations";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useAtom } from "jotai";
import type { ListSelect } from "@/lib/types";
import { alertSystemAtom } from "@/components/alert-system/alert-system.store";

interface Props {
  list: ListSelect;
}

const PackingListMenu: React.FC<Props> = ({ list: { name, id: listId } }) => {
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const { deleteList, duplicateList, updateList } = useMutations();

  const handleRename = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Rename List",
        message: "Enter a new name for your list.",
        value: name,
        handleSubmit: (newName) => {
          updateList.mutate({ listId, data: { name: newName } });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const handleDuplicate = () => {
    duplicateList.mutate({ listId });
    dispatchAlert({ type: "close" });
  };

  const handleDelete = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete List",
        message: "Are you sure you want to delete this packing list?",
        handleDelete: () => {
          deleteList.mutate({ listId });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton
          variant="ghost"
          color="gray"
          title="List Actions"
          size="1"
          radius="full"
        >
          <span className="sr-only">Open menu</span>
          <i className="fa-solid fa-ellipsis" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" className="z-30">
        <DropdownMenu.Item onClick={handleRename}>
          <i className="fa-solid fa-pen w-4 text-center opacity-70" />
          Rename
        </DropdownMenu.Item>

        <DropdownMenu.Item onClick={handleDuplicate}>
          <i className="fa-solid fa-copy w-4 text-center opacity-70" />
          Duplicate
        </DropdownMenu.Item>

        <DropdownMenu.Item color="red" onClick={handleDelete}>
          <i className="fa-solid fa-backspace w-4 text-center opacity-70" />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default PackingListMenu;
