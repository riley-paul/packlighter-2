import { defineAction } from "astro:actions";
import categoryInputs from "./categories.inputs";
import categoryHandlers from "./categories.handlers";

export const getFromOtherLists = defineAction({
  input: categoryInputs.getFromOtherLists,
  handler: categoryHandlers.getFromOtherLists,
});

export const copyToList = defineAction({
  input: categoryInputs.copyToList,
  handler: categoryHandlers.copyToList,
});

export const create = defineAction({
  input: categoryInputs.create,
  handler: categoryHandlers.create,
});

export const reorder = defineAction({
  input: categoryInputs.reorder,
  handler: categoryHandlers.reorder,
});

export const remove = defineAction({
  input: categoryInputs.remove,
  handler: categoryHandlers.remove,
});

export const update = defineAction({
  input: categoryInputs.update,
  handler: categoryHandlers.update,
});

export const togglePacked = defineAction({
  input: categoryInputs.togglePacked,
  handler: categoryHandlers.togglePacked,
});
