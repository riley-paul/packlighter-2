import { QueryClient } from "@tanstack/react-query";
import type {
  ExpandedCategory,
  ExpandedCategoryItem,
  ExpandedList,
  ItemSelect,
  ListSelect,
} from "../types";
import {
  itemsQueryOptions,
  listQueryOptions,
  listsQueryOptions,
} from "./queries";

type UpdateCache<T> = (props: {
  queryClient: QueryClient;
  data: Partial<T>;
  listId: string;
}) => void;

type AddCache<T> = (props: {
  queryClient: QueryClient;
  data: T;
  listId: string;
}) => void;

export const updateCachedCategory: UpdateCache<ExpandedCategory> = ({
  queryClient,
  data,
  listId,
}) => {
  const { queryKey } = listQueryOptions(listId);
  queryClient.setQueryData(queryKey, (prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === data.id ? { ...c, ...data } : c,
      ),
    };
  });
};

export const addCachedCategory: AddCache<ExpandedCategory> = ({
  queryClient,
  data,
  listId,
}) => {
  const { queryKey } = listQueryOptions(listId);
  queryClient.setQueryData(queryKey, (prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      categories: [...prev.categories, data].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      ),
    };
  });
};

export const updateCachedList: UpdateCache<ExpandedList> = ({
  queryClient,
  data,
  listId,
}) => {
  const { queryKey: individualQueryKey } = listQueryOptions(listId);
  const { queryKey: allQueryKey } = listsQueryOptions;

  queryClient.setQueryData(individualQueryKey, (prev) => {
    if (!prev) return prev;
    return { ...prev, ...data };
  });

  queryClient.setQueryData(allQueryKey, (prev) => {
    if (!prev) return prev;
    return prev.map((l) => (l.id === data.id ? { ...l, ...data } : l));
  });
};

export const addCachedList: AddCache<ListSelect> = ({ queryClient, data }) => {
  const { queryKey } = listsQueryOptions;
  queryClient.setQueryData(queryKey, (prev) => {
    if (!prev) return prev;
    return [...prev, data].sort((a, b) => a.sortOrder - b.sortOrder);
  });
};

export const updateCachedItem: UpdateCache<ItemSelect> = ({
  queryClient,
  data,
  listId,
}) => {
  const { queryKey: itemListQueryKey } = itemsQueryOptions;
  const { queryKey: listQueryKey } = listQueryOptions(listId);

  queryClient.setQueryData(itemListQueryKey, (prev) => {
    if (!prev) return prev;
    return prev.map((i) => (i.id === data.id ? { ...i, ...data } : i));
  });

  queryClient.setQueryData(listQueryKey, (prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      categories: prev.categories.map((category) => ({
        ...category,
        items: category.items.map((item) =>
          item.itemId === data.id
            ? { ...item, itemData: { ...item.itemData, ...data } }
            : item,
        ),
      })),
    };
  });
};

export const addCachedItem: AddCache<ItemSelect> = ({ queryClient, data }) => {
  const { queryKey } = itemsQueryOptions;
  queryClient.setQueryData(queryKey, (prev) => {
    if (!prev) return prev;
    return [...prev, data];
  });
};

export const updateCachedCategoryItem: UpdateCache<ExpandedCategoryItem> = ({
  queryClient,
  data,
  listId,
}) => {
  const { queryKey } = listQueryOptions(listId);

  queryClient.setQueryData(queryKey, (prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      categories: prev.categories.map((category) => ({
        ...category,
        items: category.items.map((item) =>
          item.id === data.id ? { ...item, ...data } : item,
        ),
      })),
    };
  });
};
