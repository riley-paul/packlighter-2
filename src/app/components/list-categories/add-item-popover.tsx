import React from "react";

import { Button } from "@/app/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/app/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { itemsQueryOptions } from "@/app/lib/queries";
import { CommandLoading } from "cmdk";
import useMutations from "@/app/hooks/use-mutations";
import type { ExpandedCategory } from "@/lib/types";
import { initCategoryItem } from "@/app/lib/init";
import useCurrentList from "@/app/hooks/use-current-list";
import { usePackingItemsSortFilter } from "../packing-items-sort-filter/hook";
import { v4 as uuidv4 } from "uuid";

type Props = {
  category: ExpandedCategory;
};

const NEW_ITEM_VALUE = "create-new-item-" + uuidv4();

const AddItemPopover: React.FC<Props> = (props) => {
  const { category } = props;

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("");

  const { addItemToCategory, addCategoryItem } = useMutations();
  const { data: allItems = [], isLoading } = useQuery(itemsQueryOptions);

  const items = usePackingItemsSortFilter(allItems, { ignoreSearch: true });
  const { listItemIds } = useCurrentList();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          size="sm"
          variant="linkMuted"
          role="combobox"
          aria-expanded={open}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Gear
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
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
            {isLoading && <CommandLoading>Loading...</CommandLoading>}
            <CommandEmpty> No suggestions </CommandEmpty>
            <CommandGroup>
              <CommandItem
                value={NEW_ITEM_VALUE}
                onSelect={() => {
                  addCategoryItem.mutate({
                    categoryId: category.id,
                    itemData: { name: value },
                  });
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
              >
                <Plus className="mr-2 h-4 w-4 text-primary" />
                Create new gear
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  disabled={listItemIds.has(item.id)}
                  value={item.name}
                  onSelect={() => {
                    const newCategoryItem = initCategoryItem({
                      itemData: item,
                      categoryId: category.id,
                    });
                    addItemToCategory.mutate({
                      categoryId: category.id,
                      itemId: item.id,
                      categoryItems: [...category.items, newCategoryItem],
                      categoryItemId: newCategoryItem.id,
                    });
                    setOpen(false);
                    buttonRef.current?.focus();
                  }}
                >
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AddItemPopover;