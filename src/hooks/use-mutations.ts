import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listQueryOptions,
  otherListCategoriesQueryOptions,
} from "@/lib/client/queries";
import { produce } from "immer";
import { initCategory, initCategoryItem, initItem } from "@/lib/init";
import { actions } from "astro:actions";
import useCurrentList from "./use-current-list";
import useMutationHelpers from "./use-mutation-helpers";
import { useNavigate } from "@tanstack/react-router";
import { listLinkOptions } from "@/lib/client/links";
import {
  itemsQueryOptions,
  listsQueryOptions,
} from "@/modules/sidebar/queries";
import type { ExpandedList, ExpandedCategoryItem } from "@/lib/types";

export default function useMutations() {
  const { listId } = useCurrentList();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    onError,
    onMutateMessage,
    toastSuccess,
    optimisticUpdate,
    onErrorOptimistic,
    invalidateQueries,
  } = useMutationHelpers();

  const deleteCategoryItem = useMutation({
    mutationFn: actions.categoryItems.remove.orThrow,
    onMutate: ({ categoryItemId }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) =>
        produce(prev, (draft) => {
          draft.categories.forEach((category) => {
            category.items = category.items.filter(
              (i) => i.id !== categoryItemId,
            );
          });
        }),
      );
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        itemsQueryOptions.queryKey,
      ]);
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: actions.categories.remove.orThrow,
    onMutate: ({ categoryId }) => {
      onMutateMessage("Deleting category...");
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) => ({
        ...prev,
        categories: prev.categories.filter((i) => i.id !== categoryId),
      }));
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
      toastSuccess(`Category deleted`);
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const deleteList = useMutation({
    mutationFn: actions.lists.remove.orThrow,
    onSuccess: (_, props) => {
      invalidateQueries([
        listsQueryOptions.queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
      toastSuccess("List deleted successfully");
      if (props.listId === listId) {
        navigate({ to: "/" });
      }
    },
    onMutate: () => onMutateMessage("Deleting list..."),
  });

  const updateCategoryItem = useMutation({
    mutationFn: actions.categoryItems.update.orThrow,
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
    onMutate: ({ categoryItemId, data }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) => ({
        ...prev,
        categories: prev.categories.map((category) => ({
          ...category,
          items: category.items.map((item) =>
            item.id === categoryItemId ? { ...item, ...data } : item,
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

  const updateCategory = useMutation({
    mutationFn: actions.categories.update.orThrow,
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
    },
  });

  const addCategoryItem = useMutation({
    mutationFn: actions.categoryItems.createAndAddToCategory.orThrow,
    onMutate: async ({ categoryId, itemData, categoryItemData }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) =>
        produce(prev, (draft) => {
          const categoryIdx = draft.categories.findIndex(
            (i) => i.id === categoryId,
          );
          if (categoryIdx === -1) return draft;
          // TODO - fix issue with mismatched Ids
          const item = initItem(itemData);
          const categoryItem = initCategoryItem({
            itemData: item,
            categoryId,
            ...categoryItemData,
          });
          draft.categories[categoryIdx].items.push(categoryItem);
        }),
      );
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        itemsQueryOptions.queryKey,
      ]);
    },
  });

  const addItemToCategory = useMutation({
    mutationFn: (props: {
      itemId: string;
      categoryId: string;
      categoryItemData?: Partial<ExpandedCategoryItem>;
      categoryItems: ExpandedCategoryItem[];
    }) =>
      actions.categoryItems.create.orThrow({
        ...props,
        reorderIds: props.categoryItems.map((i) => i.id),
      }),
    onMutate: async ({ categoryId, itemId, categoryItems }) => {
      const { queryKey } = listQueryOptions(listId);
      const item = queryClient
        .getQueryData(itemsQueryOptions.queryKey)
        ?.find((i) => i.id === itemId);
      if (!item) return;
      return optimisticUpdate<ExpandedList>(queryKey, (prev) =>
        produce(prev, (draft) => {
          const categoryIdx = draft.categories.findIndex(
            (i) => i.id === categoryId,
          );
          if (categoryIdx === -1) return draft;
          draft.categories[categoryIdx].items = categoryItems;
        }),
      );
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
        itemsQueryOptions.queryKey,
      ]);
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const addCategory = useMutation({
    mutationFn: actions.categories.create.orThrow,
    onMutate: ({ data }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) =>
        produce(prev, (draft) => {
          const newCategory = initCategory(data);
          draft.categories.push(newCategory);
        }),
      );
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const toggleCategoryPacked = useMutation({
    mutationFn: actions.categories.togglePacked.orThrow,
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
  });

  const copyCategoryToList = useMutation({
    mutationFn: actions.categories.copyToList.orThrow,
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
    },
  });

  const updateList = useMutation({
    mutationFn: actions.lists.update.orThrow,
    onMutate: ({ data }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) => ({
        ...prev,
        ...data,
      }));
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
        listsQueryOptions.queryKey,
      ]);
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
  });

  const addList = useMutation({
    mutationFn: actions.lists.create.orThrow,
    onSuccess: (data) => {
      invalidateQueries([
        listsQueryOptions.queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
      navigate(listLinkOptions(data.id));
    },
  });

  const duplicateList = useMutation({
    mutationFn: actions.lists.duplicate.orThrow,
    onSuccess: (data) => {
      invalidateQueries([
        listsQueryOptions.queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
      navigate(listLinkOptions(data.listId));
    },
  });

  const unpackList = useMutation({
    mutationFn: actions.lists.unpack.orThrow,
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
  });

  return {
    deleteCategoryItem,
    deleteCategory,
    deleteList,
    updateCategoryItem,
    updateList,
    updateCategory,
    addCategoryItem,
    addItemToCategory,
    addList,
    duplicateList,
    addCategory,
    toggleCategoryPacked,
    copyCategoryToList,
    unpackList,
  };
}
