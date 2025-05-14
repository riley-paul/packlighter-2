import type { QueryClient } from "@tanstack/react-query";
import type { ExpandedCategory, ExpandedList } from "../types";
import { listQueryOptions } from "./queries";

export const updateCachedCategory = (
  queryClient: QueryClient,
  category: ExpandedCategory,
) => {
  const { queryKey } = listQueryOptions(category.listId);
  queryClient.setQueryData<ExpandedList>(queryKey, (prev) => {
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
  queryClient.setQueryData<ExpandedList>(queryKey, (prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      categories: [...prev.categories, category].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      ),
    };
  });
};
