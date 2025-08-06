import React from "react";

import { FilterOptions, SortOptions } from "../../sidebar.types";
import { useAtom } from "jotai";
import {
  filterOptionsAtom,
  searchStringAtom,
  sortOptionAtom,
} from "@/app/modules/sidebar/sidebar.store";
import { IconButton, DropdownMenu, TextField } from "@radix-ui/themes";
import {
  ArrowDownWideNarrowIcon,
  DownloadIcon,
  EllipsisIcon,
  ListFilterIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

const PackingItemsSortFilter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useAtom(searchStringAtom);
  const [sortOption, setSortOption] = useAtom(sortOptionAtom);
  const [filterOptions, setFilterOptions] = useAtom(filterOptionsAtom);

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-1">
      <TextField.Root
        type="search"
        placeholder="Search..."
        value={searchQuery}
        variant="soft"
        color="gray"
        onChange={(e) => setSearchQuery(e.target.value)}
      >
        {searchQuery.length > 0 && (
          <TextField.Slot side="right">
            <IconButton
              size="1"
              radius="full"
              variant="ghost"
              color="red"
              onClick={() => setSearchQuery("")}
            >
              <XIcon className="size-4" />
            </IconButton>
          </TextField.Slot>
        )}
        <TextField.Slot side="left">
          <SearchIcon className="size-4" />
        </TextField.Slot>
      </TextField.Root>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="soft" color="gray">
            <EllipsisIcon className="size-4 opacity-70" />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="min-w-52">
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <ArrowDownWideNarrowIcon className="size-4 opacity-70" />
              Sort
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.RadioGroup
                value={sortOption}
                onValueChange={(value) => {
                  setSortOption(value as SortOptions);
                }}
              >
                {Object.values(SortOptions).map((option) => (
                  <DropdownMenu.RadioItem key={option} value={option}>
                    {option}
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <ListFilterIcon className="size-4 opacity-70" />
              Filter
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.CheckboxItem
                checked={filterOptions[FilterOptions.NotInList]}
                onCheckedChange={() =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    [FilterOptions.NotInList]: !prev[FilterOptions.NotInList],
                  }))
                }
              >
                Hide gear in current list
              </DropdownMenu.CheckboxItem>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Separator />
          <DropdownMenu.Item asChild>
            <a href="/download/items" download>
              <DownloadIcon className="size-4 opacity-70" />
              <span>Download CSV</span>
            </a>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};

export default PackingItemsSortFilter;
