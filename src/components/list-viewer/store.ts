import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const packedItemsAtom = atomWithStorage<Record<string, string[]>>(
  "viewer-store",
  {},
);

type TogglePackedItemsProps = {
  packed: boolean;
  listId: string;
  itemId: string;
};

export const togglePackedItemAtom = atom(
  null, // This atom doesn't hold a value
  (get, set, { packed, listId, itemId }: TogglePackedItemsProps) => {
    const packedItems = get(packedItemsAtom);
    const listPackedItems = packedItems[listId] || [];

    // Update the packed items based on the toggle action
    const updatedPackedItems = packed
      ? [...listPackedItems, itemId] // Add item
      : listPackedItems.filter((i) => i !== itemId); // Remove item

    // Save the updated state
    set(packedItemsAtom, { ...packedItems, [listId]: updatedPackedItems });
  },
);

type IsItemPackedProps = {
  listId: string;
  itemId: string;
};

export const isItemPackedAtom = atom(
  (get) =>
    ({ listId, itemId }: IsItemPackedProps) => {
      const packedItems = get(packedItemsAtom);
      const listPackedItems = packedItems[listId] || [];
      return listPackedItems.includes(itemId);
    },
);
