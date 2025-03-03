import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useSetAtom } from "jotai";
import React from "react";
import { openEditorAtom } from "../item-editor/store";
import type { ItemSelect } from "@/lib/types";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import useMutations from "@/hooks/use-mutations";

type Props = {
  item: ItemSelect;
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
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};

export default PackingItemMenu;
