import React from "react";

import useMutations from "@/hooks/use-mutations";
import { useQuery } from "@tanstack/react-query";
import { otherListCategoriesQueryOptions } from "@/lib/client/queries";
import useCurrentList from "@/hooks/use-current-list";
import { Strong, Text } from "@radix-ui/themes";
import AddEntityPopover from "./add-entity-popover";

const AddCategoryPopover: React.FC = () => {
  const { listId } = useCurrentList();
  const { data, isLoading } = useQuery(otherListCategoriesQueryOptions(listId));
  const { addCategory, copyCategoryToList } = useMutations();

  return (
    <AddEntityPopover
      entityName="category"
      entities={data ?? []}
      groupHeader="Copy from another list"
      getEntityValue={(category) =>
        `${category.name}-${category.listId}-${category.id}-${category.listName}`
      }
      handleAdd={(value) => {
        addCategory.mutate({ listId, data: { name: value } });
      }}
      handleEntitySelect={(id) => {
        copyCategoryToList.mutate({ categoryId: id, listId });
      }}
      renderEntity={(category) => (
        <Text color="gray">
          {category.listName} / <Strong>{category.name}</Strong>
        </Text>
      )}
      isLoading={isLoading}
    />
  );
};

export default AddCategoryPopover;
