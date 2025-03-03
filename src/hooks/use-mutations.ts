import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  itemsQueryOptions,
  listQueryOptions,
  listsQueryOptions,
  otherListCategoriesQueryOptions,
} from "@/lib/queries";
import {
  type ExpandedList,
  type ExpandedCategory,
  type ExpandedCategoryItem,
  type ListSelect,
} from "@/lib/types";
import { produce } from "immer";
import { initCategory, initCategoryItem, initItem } from "@/lib/init";
import { actions } from "astro:actions";
import useCurrentList from "./use-current-list";
import useMutationHelpers from "./use-mutation-helpers";
import { useNavigate } from "@tanstack/react-router";
import { listLinkOptions } from "@/lib/links";

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
    onMutate: async ({ categoryId, itemData, data }) => {
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
            ...data,
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
      data?: Partial<ExpandedCategoryItem>;
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

  const addItem = useMutation({
    mutationFn: actions.items.create.orThrow,
    onSuccess: () => {
      invalidateQueries([itemsQueryOptions.queryKey]);
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

  const duplicateItem = useMutation({
    mutationFn: actions.items.duplicate.orThrow,
    onSuccess: () => {
      const { queryKey } = itemsQueryOptions;
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const reorderLists = useMutation({
    mutationFn: (lists: ListSelect[]) =>
      actions.lists.reorder.orThrow(lists.map((i) => i.id)),
    onMutate: async (newLists) => {
      return optimisticUpdate(listsQueryOptions.queryKey, newLists);
    },
    onError: (error, __, context) => {
      const { queryKey } = listsQueryOptions;
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
    onSuccess: () => {
      invalidateQueries([
        listsQueryOptions.queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
    },
  });

  const reorderCategories = useMutation({
    mutationFn: (categories: ExpandedCategory[]) =>
      actions.categories.reorder.orThrow({
        listId,
        ids: categories.map((i) => i.id),
      }),
    onMutate: async (newCategories) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) => ({
        ...prev,
        categories: newCategories,
      }));
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
    onSuccess: () => {
      invalidateQueries([
        listQueryOptions(listId).queryKey,
        otherListCategoriesQueryOptions(listId).queryKey,
      ]);
    },
  });

  const reorderCategoryItems = useMutation({
    mutationFn: (props: {
      categoryId: string;
      categoryItems: ExpandedCategoryItem[];
    }) =>
      actions.categoryItems.reorder.orThrow({
        ...props,
        ids: props.categoryItems.map((i) => i.id),
      }),
    onMutate: async ({ categoryId, categoryItems }) => {
      const { queryKey } = listQueryOptions(listId);
      return optimisticUpdate<ExpandedList>(queryKey, (prev) => ({
        ...prev,
        categories: prev.categories.map((category) =>
          category.id === categoryId
            ? { ...category, items: categoryItems }
            : {
                ...category,
                items: category.items.filter(
                  (i) => !categoryItems.map((i) => i.id).includes(i.id),
                ),
              },
        ),
      }));
    },
    onError: (error, __, context) => {
      const { queryKey } = listQueryOptions(listId);
      onErrorOptimistic(queryKey, context);
      onError(error);
    },
    onSuccess: () => {
      const { queryKey } = listQueryOptions(listId);
      invalidateQueries([queryKey]);
    },
  });

  const unpackList = useMutation({
    mutationFn: actions.lists.unpack.orThrow,
    onSuccess: () => {
      invalidateQueries([listQueryOptions(listId).queryKey]);
    },
  });

  const addFeedback = useMutation({
    mutationFn: actions.feedback.create.orThrow,
    onSuccess: () => {
      toastSuccess("Feedback submitted");
    },
  });

  return {
    deleteCategoryItem,
    deleteCategory,
    deleteItem,
    deleteList,
    updateCategoryItem,
    updateItem,
    updateList,
    updateCategory,
    addCategoryItem,
    addItemToCategory,
    addList,
    addItem,
    duplicateItem,
    duplicateList,
    addCategory,
    reorderLists,
    reorderCategories,
    reorderCategoryItems,
    toggleCategoryPacked,
    copyCategoryToList,
    unpackList,
    addFeedback,
  };
}
