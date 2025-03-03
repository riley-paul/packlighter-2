import { DropdownMenu, IconButton, Spinner, Text } from "@radix-ui/themes";
import { useSetAtom } from "jotai";
import React from "react";
import { openEditorAtom } from "../item-editor/store";
import type { ItemSelect } from "@/lib/types";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import useMutations from "@/hooks/use-mutations";
import { itemListsIncludedOptions } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { listLinkOptions } from "@/lib/links";

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
        <Link {...listLinkOptions(list.listId)}>
          {({ isActive }) => (
            <DropdownMenu.Item key={list.listId} disabled={isActive}>
              {list.listName} / {list.categoryName}
              <i className="fas fa-arrow-right ml-auto pl-2 opacity-70" />
            </DropdownMenu.Item>
          )}
        </Link>
      ))}
    </>
  );
};

const PackingItemMenu: React.FC<Props> = ({ item }) => {
  const openEditor = useSetAtom(openEditorAtom);
  const { deleteItem, duplicateItem } = useMutations();

  const [ConfirmDeleteDialog, confirmDelete] = useConfirmDialog({
    title: "Delete Gear",
    description:
      "Are you sure you want to delete this gear? This cannot be undone.",
  });

  return (
    <>
      <ConfirmDeleteDialog />
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
            <i className="fa-solid fa-ellipsis" />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start" className="z-30">
          <DropdownMenu.Item
            onClick={() => {
              openEditor(item);
            }}
          >
            <i className="fa-solid fa-pen w-4 text-center opacity-70" />
            Edit
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => {
              duplicateItem.mutate({ itemId: item.id });
            }}
          >
            <i className="fa-solid fa-copy w-4 text-center opacity-70" />
            Duplicate
          </DropdownMenu.Item>

          <DropdownMenu.Item
            color="red"
            onClick={async () => {
              const ok = await confirmDelete();
              if (ok) deleteItem.mutate({ itemId: item.id });
            }}
          >
            <i className="fa-solid fa-backspace w-4 text-center opacity-70" />
            Delete
          </DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <i className="fas fa-list w-4 text-center opacity-70" />
              Used in
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent className="z-30">
              <ListIncludesSubmenu item={item} />
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};

export default PackingItemMenu;
