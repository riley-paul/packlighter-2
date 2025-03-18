import { defineAction } from "astro:actions";
import itemInputs from "./items.inputs";
import itemHandlers from "./items.handlers";

export const getAll = defineAction({
  input: itemInputs.getAll,
  handler: itemHandlers.getAll,
});

export const create = defineAction({
  input: itemInputs.create,
  handler: itemHandlers.create,
});

export const duplicate = defineAction({
  input: itemInputs.duplicate,
  handler: itemHandlers.duplicate,
});

export const remove = defineAction({
  input: itemInputs.remove,
  handler: itemHandlers.remove,
});

export const update = defineAction({
  input: itemInputs.update,
  handler: itemHandlers.update,
});

export const getListsIncluded = defineAction({
  input: itemInputs.getListsIncluded,
  handler: itemHandlers.getListsIncluded,
});
