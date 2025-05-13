import React from "react";

import { useQuery } from "@tanstack/react-query";
import useMutations from "@/hooks/use-mutations";
import useCurrentList from "@/hooks/use-current-list";
import { usePackingItemsSortFilter } from "../../sidebar/components/packing-items-sort-filter/use-packing-item-sort-filter";
import { itemsQueryOptions } from "@/modules/sidebar/sidebar.queries";
import type { ExpandedCategory } from "@/lib/types";
import AddEntityPopover from "./add-entity-popover";

type Props = {
  category: ExpandedCategory;
};

const AddItemPopover = React.forwardRef<HTMLButtonElement, Props>(
  ({ category }) => {
    const { addItemToCategory, addCategoryItem } = useMutations();
    const { data: allItems = [], isLoading } = useQuery(itemsQueryOptions);

    const items = usePackingItemsSortFilter(allItems, { ignoreSearch: true });
    const { listItemIds } = useCurrentList();

    return (
      <AddEntityPopover
        entityName="gear"
        entities={items}
        getEntityValue={(item) => `${item.name}~${item.id}~${item.description}`}
        handleAdd={(value) => {
          addCategoryItem.mutate({
            categoryId: category.id,
            itemData: { name: value },
          });
        }}
        handleEntitySelect={(itemId) => {
          addItemToCategory.mutate({
            data: {
              itemId,
              categoryId: category.id,
            },
          });
        }}
        getEntityDisabled={(item) => listItemIds.has(item.id)}
        renderEntity={(item) => item.name}
        isLoading={isLoading}
        className="w-[250px]"
      />
    );
  },
);

export default AddItemPopover;
