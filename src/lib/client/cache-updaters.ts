import { QueryClient } from "@tanstack/react-query";
import {
  type ExpandedCategory,
  type ExpandedList,
  type ItemSelect,
  type ListSelect,
} from "../types";
import {
  itemsQueryOptions,
  listQueryOptions,
  listsQueryOptions,
} from "./queries";

export const updateCachedCategory = (
  queryClient: QueryClient,
  category: ExpandedCategory,
) => {
  const { queryKey } = listQueryOptions(category.listId);
  queryClient.setQueryData(queryKey, (prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === category.id ? { ...c, ...category } : c,
      ),
    };
  });
};

export const addCachedCategory = (
  queryClient: QueryClient,
  category: ExpandedCategory,
) => {
  const { queryKey } = listQueryOptions(category.listId);
  queryClient.setQueryData(queryKey, (prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      categories: [...prev.categories, category].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      ),
    };
  });
};

export const updateCachedList = (
  queryClient: QueryClient,
  list: ExpandedList,
) => {
  const { queryKey: individualQueryKey } = listQueryOptions(list.id);
  const { queryKey: allQueryKey } = listsQueryOptions;

  queryClient.setQueryData(individualQueryKey, (prev) => {
    if (!prev) return prev;
    return { ...prev, ...list };
  });

  queryClient.setQueryData(allQueryKey, (prev) => {
    if (!prev) return prev;
    return prev.map((l) => (l.id === list.id ? { ...l, ...list } : l));
  });
};

export const addCachedList = (queryClient: QueryClient, list: ListSelect) => {
  const { queryKey } = listsQueryOptions;
  queryClient.setQueryData(queryKey, (prev) => {
    if (!prev) return prev;
    return [...prev, list].sort((a, b) => a.sortOrder - b.sortOrder);
  });
};

export const updateCachedItem = (
  queryClient: QueryClient,
  item: ItemSelect,
) => {
  const { queryKey } = itemsQueryOptions;
  queryClient.setQueryData(queryKey, (prev) => {
    if (!prev) return prev;
    return prev.map((i) => (i.id === item.id ? { ...i, ...item } : i));
  });
};

export const addCachedItem = (queryClient: QueryClient, item: ItemSelect) => {
  const { queryKey } = itemsQueryOptions;
  queryClient.setQueryData(queryKey, (prev) => {
    if (!prev) return prev;
    return [...prev, item];
  });
};
