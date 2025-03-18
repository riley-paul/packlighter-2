import { defineAction } from "astro:actions";
import feedbackInputs from "./feedback.inputs";
import feedbackHandlers from "./feedback.handlers";

export const create = defineAction({
  input: feedbackInputs.create,
  handler: feedbackHandlers.create,
});
