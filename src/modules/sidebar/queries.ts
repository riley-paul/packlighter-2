import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const itemsQueryOptions = queryOptions({
  queryKey: ["items"],
  queryFn: actions.items.getAll.orThrow,
});

export const listsQueryOptions = queryOptions({
  queryKey: ["lists"],
  queryFn: () => actions.lists.getAll.orThrow({}),
});
