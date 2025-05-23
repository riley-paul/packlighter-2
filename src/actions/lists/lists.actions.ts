import { defineAction } from "astro:actions";
import listInputs from "./lists.inputs";
import listHandlers from "./lists.handlers";

export const getAll = defineAction({
  input: listInputs.getAll,
  handler: listHandlers.getAll,
});

export const getOne = defineAction({
  input: listInputs.getOne,
  handler: listHandlers.getOne,
});

export const create = defineAction({
  input: listInputs.create,
  handler: listHandlers.create,
});

export const update = defineAction({
  input: listInputs.update,
  handler: listHandlers.update,
});

export const remove = defineAction({
  input: listInputs.remove,
  handler: listHandlers.remove,
});

export const unpack = defineAction({
  input: listInputs.unpack,
  handler: listHandlers.unpack,
});

export const duplicate = defineAction({
  input: listInputs.duplicate,
  handler: listHandlers.duplicate,
});
