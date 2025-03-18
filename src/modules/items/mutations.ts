import useMutationHelpers from "@/hooks/use-mutation-helpers";
import { useMutation } from "@tanstack/react-query";
import { itemsQueryOptions } from "../sidebar/queries";
import {
  listQueryOptions,
  otherListCategoriesQueryOptions,
} from "@/lib/client/queries";
import { actions } from "astro:actions";
import useCurrentList from "@/hooks/use-current-list";
import type { ExpandedList } from "@/db/schema";

export default function useItemsMutations() {
  const { listId } = useCurrentList();
  const {
    invalidateQueries,
    toastSuccess,
    onMutateMessage,
    optimisticUpdate,
    onErrorOptimistic,
    onError,
  } = useMutationHelpers();

  const updateItem = useMutation({
    mutationFn: actions.items.update.orThrow,
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        itemsQueryOptions.queryKey,
      ]);
    },
    onMutate: ({ itemId, data }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) => ({
        ...prev,
        categories: prev.categories.map((category) => ({
          ...category,
          items: category.items.map((item) =>
            item.itemId === itemId
              ? { ...item, itemData: { ...item.itemData, ...data } }
              : item,
          ),
        })),
      }));
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const addItem = useMutation({
    mutationFn: actions.items.create.orThrow,
    onSuccess: () => {
      invalidateQueries([itemsQueryOptions.queryKey]);
    },
  });

  const duplicateItem = useMutation({
    mutationFn: actions.items.duplicate.orThrow,
    onSuccess: () => {
      invalidateQueries([itemsQueryOptions.queryKey]);
    },
  });

  const deleteItem = useMutation({
    mutationFn: actions.items.remove.orThrow,
    onSuccess: () => {
      invalidateQueries([
        itemsQueryOptions.queryKey,
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
      toastSuccess(`Gear has been deleted`);
    },
    onMutate: () => onMutateMessage("Deleting item..."),
  });

  return { updateItem, addItem, duplicateItem, deleteItem };
}
