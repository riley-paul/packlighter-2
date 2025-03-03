import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const userQueryOptions = queryOptions({
  queryKey: ["profile"],
  retry: false,
  staleTime: 1000 * 60 * 5,
  queryFn: actions.users.getMe.orThrow,
});
