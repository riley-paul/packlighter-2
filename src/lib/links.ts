import { linkOptions } from "@tanstack/react-router";

export const listLinkOptions = (listId: string) =>
  linkOptions({
    to: "/list/$listId",
    params: { listId },
  });
