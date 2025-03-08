import React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useQuery } from "@tanstack/react-query";
import { CommandLoading } from "cmdk";
import useMutations from "@/hooks/use-mutations";
import { initCategoryItem } from "@/lib/init";
import useCurrentList from "@/hooks/use-current-list";
import { usePackingItemsSortFilter } from "../../modules/sidebar/components/packing-items-sort-filter/use-packing-item-sort-filter";
import { v4 as uuidv4 } from "uuid";
import { Button, Popover, Spinner } from "@radix-ui/themes";
import { itemsQueryOptions } from "@/modules/sidebar/queries";
import type { ExpandedCategory } from "@/db/schema";

type Props = {
  category: ExpandedCategory;
};

const NEW_ITEM_VALUE = "create-new-item-" + uuidv4();

const AddItemPopover = React.forwardRef<HTMLButtonElement, Props>(
  ({ category }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [value, setValue] = React.useState<string>("");

    const { addItemToCategory, addCategoryItem } = useMutations();
    const { data: allItems = [], isLoading } = useQuery(itemsQueryOptions);

    const items = usePackingItemsSortFilter(allItems, { ignoreSearch: true });
    const { listItemIds } = useCurrentList();

    return (
      <Popover.Root
        open={isOpen}
        onOpenChange={(open) => {
          if (open) setValue("");
          setIsOpen(open);
        }}
      >
        <Popover.Trigger>
          <Button
            ref={ref}
            size="1"
            variant="ghost"
            role="combobox"
            aria-expanded={isOpen}
          >
            <i className="fa-solid fa-plus" />
            <span>Add Gear</span>
          </Button>
        </Popover.Trigger>
        <Popover.Content className="w-[300px] p-0" align="start" side="bottom">
          <Command
            loop
            filter={(value, search) => {
              if (value === NEW_ITEM_VALUE) return 1;
              if (value.toLowerCase().includes(search.toLowerCase())) return 1;
              return 0;
            }}
          >
            <CommandInput
              placeholder="Enter name..."
              value={value}
              onValueChange={setValue}
            />
            <CommandList>
              {isLoading && (
                <CommandLoading>
                  <Spinner />
                </CommandLoading>
              )}
              <CommandEmpty> No suggestions </CommandEmpty>
              {value && (
                <CommandGroup>
                  <CommandItem
                    value={NEW_ITEM_VALUE}
                    onSelect={() => {
                      addCategoryItem.mutate({
                        categoryId: category.id,
                        itemData: { name: value },
                      });
                      setIsOpen(false);
                    }}
                  >
                    <i className="fa-solid fa-plus mr-2 text-accent-10" />
                    <span>Create new gear "{value}"</span>
                  </CommandItem>
                </CommandGroup>
              )}
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    disabled={listItemIds.has(item.id)}
                    value={`${item.name}~${item.id}~${item.description}`}
                    onSelect={() => {
                      const newCategoryItem = initCategoryItem({
                        itemData: item,
                        categoryId: category.id,
                      });
                      addItemToCategory.mutate({
                        categoryId: category.id,
                        itemId: item.id,
                        categoryItems: [...category.items, newCategoryItem],
                        categoryItemData: newCategoryItem,
                      });
                      setIsOpen(false);
                    }}
                  >
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </Popover.Content>
      </Popover.Root>
    );
  },
);

export default AddItemPopover;
