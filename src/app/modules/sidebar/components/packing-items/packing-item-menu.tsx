import { DropdownMenu, IconButton, Spinner, Text } from "@radix-ui/themes";
import { useAtom, useSetAtom } from "jotai";
import React from "react";
import { openEditorAtom } from "@/app/modules/items/items.store";
import { itemListsIncludedOptions } from "@/lib/client/queries";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { listLinkOptions } from "@/lib/client/links";
import useItemsMutations from "@/app/modules/items/items.mutations";
import type { ItemSelect } from "@/lib/types";
import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import {
  CopyIcon,
  DeleteIcon,
  Edit2Icon,
  EllipsisIcon,
  ListIcon,
} from "lucide-react";

type Props = {
  item: ItemSelect;
};

const ListIncludesSubmenu: React.FC<Props> = ({ item }) => {
  const { data = [], isLoading } = useQuery(
    itemListsIncludedOptions(item.id ?? ""),
  );

  if (isLoading) {
    return (
      <div className="p-4">
        <Spinner loading />
      </div>
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <div className="p-2 text-center">
        <Text size="2" color="gray" align="center">
          Not included in any lists
        </Text>
      </div>
    );
  }

  return (
    <>
      {data.map((list) => (
        <Link key={list.listId} {...listLinkOptions(list.listId)}>
          {({ isActive }) => (
            <DropdownMenu.Item disabled={isActive}>
              {list.listName} / {list.categoryName}
            </DropdownMenu.Item>
          )}
        </Link>
      ))}
    </>
  );
};

const PackingItemMenu: React.FC<Props> = ({ item }) => {
  const openEditor = useSetAtom(openEditorAtom);
  const { deleteItem, duplicateItem } = useItemsMutations();

  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const handleDelete = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete Gear",
        message:
          "Are you sure you want to delete this gear? This cannot be undone.",
        handleDelete: () => {
          deleteItem.mutate({ itemId: item.id });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const handleDuplicate = () => {
    duplicateItem.mutate({ itemId: item.id });
  };

  const handleEdit = () => {
    openEditor(item);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger onClick={(e) => e.stopPropagation()}>
        <IconButton
          variant="ghost"
          color="gray"
          title="List Actions"
          size="1"
          radius="full"
        >
          <span className="sr-only">Open menu</span>
          <EllipsisIcon className="size-4 opacity-70" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" className="z-30">
        <DropdownMenu.Item onClick={handleEdit}>
          <Edit2Icon className="size-4 opacity-70" />
          Edit
        </DropdownMenu.Item>

        <DropdownMenu.Item onClick={handleDuplicate}>
          <CopyIcon className="size-4 opacity-70" />
          Duplicate
        </DropdownMenu.Item>

        <DropdownMenu.Item color="red" onClick={handleDelete}>
          <DeleteIcon className="size-4 opacity-70" />
          Delete
        </DropdownMenu.Item>

        <DropdownMenu.Separator />

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <ListIcon className="size-4 opacity-70" />
            Used in
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent className="z-30">
            <ListIncludesSubmenu item={item} />
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default PackingItemMenu;
