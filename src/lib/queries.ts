import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const listsQueryOptions = queryOptions({
  queryKey: ["lists"],
  queryFn: () => actions.lists.get.orThrow(),
});

export const listQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ["lists", listId],
    queryFn: () => actions.lists.getOne.orThrow({ listId }),
    enabled: listId.length > 0,
  });

export const otherListCategoriesQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ["other-categories", listId],
    queryFn: () => actions.categories.getFromOtherLists.orThrow({ listId }),
  });

export const userQueryOptions = queryOptions({
  queryKey: ["profile"],
  retry: false,
  staleTime: 1000 * 60 * 5,
  queryFn: () => actions.getMe.orThrow(),
});

export const itemsQueryOptions = queryOptions({
  queryKey: ["items"],
  queryFn: () => actions.items.get.orThrow(),
});
