import useMutationHelpers from "@/hooks/use-mutation-helpers";
import { useMutation } from "@tanstack/react-query";
import { itemsQueryOptions } from "../sidebar/queries";
import {
  listQueryOptions,
  otherListCategoriesQueryOptions,
} from "@/lib/client/queries";
import { actions } from "astro:actions";
import useCurrentList from "@/hooks/use-current-list";
import type { ExpandedList, ItemForm } from "@/lib/types";

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
    mutationFn: (data: ItemForm & { id: string }) => {
      const formData = new FormData();
      formData.append("itemId", data.id);
      formData.append(
        "removeImageFile",
        data.removeImageFile ? "true" : "false",
      );
      if (data.imageFile) formData.append("imageFile", data.imageFile);

      return Promise.all([
        actions.items.update.orThrow(data),
        actions.items.imageUpload.orThrow(formData),
      ]);
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        itemsQueryOptions.queryKey,
      ]);
    },
    onMutate: ({ id, ...data }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) => ({
        ...prev,
        categories: prev.categories.map((category) => ({
          ...category,
          items: category.items.map((item) =>
            item.itemId === id
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
    mutationFn: async (data: ItemForm) => {
      const response = await actions.items.create.orThrow(data);

      const formData = new FormData();
      formData.append("itemId", response.id);
      formData.append(
        "removeImageFile",
        data.removeImageFile ? "true" : "false",
      );
      if (data.imageFile) formData.append("imageFile", data.imageFile);

      await actions.items.imageUpload.orThrow(formData);
    },
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
