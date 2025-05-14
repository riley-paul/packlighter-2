import { QueryClient } from "@tanstack/react-query";
import type {
  ExpandedCategory,
  ExpandedList,
  ItemSelect,
  ListSelect,
} from "../types";
import {
  itemsQueryOptions,
  listQueryOptions,
  listsQueryOptions,
} from "./queries";

type UpdateCacheProps<T> = {
  queryClient: QueryClient;
  data: Partial<T>;
  listId: string;
};

type AddCacheProps<T> = {
  queryClient: QueryClient;
  data: T;
  listId: string;
};

export const updateCachedCategory = ({
  queryClient,
  data,
  listId,
}: UpdateCacheProps<ExpandedCategory>) => {
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

export const addCachedCategory = ({
  queryClient,
  data,
  listId,
}: AddCacheProps<ExpandedCategory>) => {
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

export const updateCachedList = ({
  queryClient,
  data,
  listId,
}: UpdateCacheProps<ExpandedList>) => {
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

export const addCachedList = ({
  queryClient,
  data,
}: AddCacheProps<ListSelect>) => {
  const { queryKey } = listsQueryOptions;
  queryClient.setQueryData(queryKey, (prev) => {
    if (!prev) return prev;
    return [...prev, data].sort((a, b) => a.sortOrder - b.sortOrder);
  });
};

export const updateCachedItem = ({
  queryClient,
  data,
  listId,
}: UpdateCacheProps<ItemSelect>) => {
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

export const addCachedItem = ({
  queryClient,
  data,
}: AddCacheProps<ItemSelect>) => {
  const { queryKey } = itemsQueryOptions;
  queryClient.setQueryData(queryKey, (prev) => {
    if (!prev) return prev;
    return [...prev, data];
  });
};
