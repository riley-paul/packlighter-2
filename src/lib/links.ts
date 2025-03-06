import { linkOptions } from "@tanstack/react-router";

export const listLinkOptions = (listId: string) =>
  linkOptions({
    to: "/list/$listId",
    params: { listId },
  });

export const itemLinkOptions = (itemId: string) =>
  linkOptions({
    to: "/item/$itemId",
    params: { itemId },
  });
