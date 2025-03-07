import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const itemQueryOptions = (itemId: string) =>
  queryOptions({
    queryKey: ["item", { itemId }],
    queryFn: () => actions.items.getOne.orThrow({ itemId }),
  });
