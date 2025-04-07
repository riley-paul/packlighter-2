import { defineAction } from "astro:actions";
import categoryItemInputs from "./category-items.inputs";
import categoryItemHandlers from "./category-items.handlers";

export const create = defineAction({
  input: categoryItemInputs.create,
  handler: categoryItemHandlers.create,
});

export const createAndAddToCategory = defineAction({
  input: categoryItemInputs.createAndAddToCategory,
  handler: categoryItemHandlers.createAndAddToCategory,
});

export const update = defineAction({
  input: categoryItemInputs.update,
  handler: categoryItemHandlers.update,
});

export const remove = defineAction({
  input: categoryItemInputs.remove,
  handler: categoryItemHandlers.remove,
});
