import useMutationHelpers from "@/hooks/use-mutation-helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  itemsQueryOptions,
  listQueryOptions,
  otherListCategoriesQueryOptions,
} from "@/lib/client/queries";
import { actions } from "astro:actions";
import useCurrentList from "@/hooks/use-current-list";
import type { ExpandedList, ItemForm } from "@/lib/types";
import { addCachedItem, updateCachedItem } from "@/lib/client/cache-updaters";

export default function useItemsMutations() {
  const { listId } = useCurrentList();
  const queryClient = useQueryClient();
  const {
    invalidateQueries,
    toastSuccess,
    onMutateMessage,
    optimisticUpdate,
    onErrorOptimistic,
    onError,
  } = useMutationHelpers();

  const updateItem = useMutation({
    mutationFn: (data: Partial<ItemForm> & { id: string }) => {
      const { removeImageFile, imageFile } = data;
      if (!!imageFile || !!removeImageFile) {
        const formData = new FormData();
        formData.append("itemId", data.id);
        formData.append("removeImageFile", removeImageFile ? "true" : "false");
        if (imageFile) formData.append("imageFile", imageFile);
        actions.items.imageUpload.orThrow(formData);
      }
      return actions.items.update.orThrow(data);
    },
    onSuccess: (data) => {
      updateCachedItem({ queryClient, data, listId });
      invalidateQueries([listQueryOptions(listId).queryKey]);
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

      const { imageFile, removeImageFile } = data;
      if (!!imageFile || !!removeImageFile) {
        const formData = new FormData();
        formData.append("itemId", response.id);
        formData.append("removeImageFile", removeImageFile ? "true" : "false");
        if (imageFile) formData.append("imageFile", imageFile);
        await actions.items.imageUpload.orThrow(formData);
      }

      return response;
    },
    onSuccess: (data) => addCachedItem({ queryClient, data, listId }),
  });

  const duplicateItem = useMutation({
    mutationFn: actions.items.duplicate.orThrow,
    onSuccess: (data) => addCachedItem({ queryClient, data, listId }),
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
