import * as items from "./items/items.actions";
import * as lists from "./lists/lists.actions";
import * as categories from "./categories/categories.actions";
import * as categoryItems from "./category-items/category-items.actions";
import * as users from "./users/users.actions";
import * as feedback from "./feedback";

export const server = {
  items,
  lists,
  categories,
  categoryItems,
  users,
  feedback,
};
